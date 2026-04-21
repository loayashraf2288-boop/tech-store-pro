import type { Request, Response, NextFunction } from "express";
import crypto from "crypto";

const COOKIE_SESSION = "ts_sid";
const COOKIE_ADMIN = "ts_admin";
const SECRET = process.env.SESSION_SECRET || "dev-techstore-secret";

function sign(value: string): string {
  const sig = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  return `${value}.${sig}`;
}

function unsign(signed: string | undefined): string | null {
  if (!signed) return null;
  const idx = signed.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("base64url");
  try {
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  return value;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      sessionId: string;
      adminUsername: string | null;
    }
  }
}

export function sessionMiddleware(req: Request, res: Response, next: NextFunction): void {
  const cookies = (req as Request & { cookies?: Record<string, string> }).cookies || {};
  let sid = unsign(cookies[COOKIE_SESSION]);
  if (!sid) {
    sid = crypto.randomBytes(16).toString("hex");
    res.cookie(COOKIE_SESSION, sign(sid), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      path: "/",
    });
  }
  req.sessionId = sid;
  req.adminUsername = unsign(cookies[COOKIE_ADMIN]);
  next();
}

export function setAdminCookie(res: Response, username: string): void {
  res.cookie(COOKIE_ADMIN, sign(username), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    path: "/",
  });
}

export function clearAdminCookie(res: Response): void {
  res.clearCookie(COOKIE_ADMIN, { path: "/" });
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.adminUsername) {
    res.status(401).json({ message: "غير مصرح" });
    return;
  }
  next();
}
