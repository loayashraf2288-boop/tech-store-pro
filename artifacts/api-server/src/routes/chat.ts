import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { chatMessagesTable } from "@workspace/db/schema";
import { eq, asc } from "drizzle-orm";
import { getAiReply } from "../lib/openai";

const router: IRouter = Router();

router.get("/chat", async (req, res) => {
  const rows = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, req.sessionId)).orderBy(asc(chatMessagesTable.createdAt));
  res.json(
    rows.map((m) => ({
      id: m.id,
      role: m.role,
      author: m.author,
      avatar: m.avatar,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    })),
  );
});

router.post("/chat", async (req, res) => {
  const text = String(req.body?.text ?? "").trim();
  const mode = req.body?.mode === "agent" ? "agent" : "ai";
  if (!text) {
    res.status(400).json({ message: "اكتب رسالة" });
    return;
  }
  const sid = req.sessionId;

  await db.insert(chatMessagesTable).values({
    sessionId: sid,
    role: "user",
    author: "أنت",
    text,
  });

  let replyText: string;
  let author: string;
  let avatar: string | null;
  if (mode === "agent") {
    replyText = "أهلاً بك في TECHSTORE، أنا أحد موظفي الدعم وسأكون معك خلال دقيقة. هل تستطيع وصف استفسارك بالتفصيل؟";
    author = "موظف الدعم";
    avatar = null;
  } else {
    const history = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, sid)).orderBy(asc(chatMessagesTable.createdAt)).limit(20);
    replyText = await getAiReply(history.map((h) => ({ role: h.role, text: h.text })), text);
    author = "مساعد TECHSTORE";
    avatar = null;
  }

  await db.insert(chatMessagesTable).values({
    sessionId: sid,
    role: mode === "agent" ? "agent" : "ai",
    author,
    avatar,
    text: replyText,
  });

  const rows = await db.select().from(chatMessagesTable).where(eq(chatMessagesTable.sessionId, sid)).orderBy(asc(chatMessagesTable.createdAt));
  res.json(
    rows.map((m) => ({
      id: m.id,
      role: m.role,
      author: m.author,
      avatar: m.avatar,
      text: m.text,
      createdAt: m.createdAt.toISOString(),
    })),
  );
});

export default router;
