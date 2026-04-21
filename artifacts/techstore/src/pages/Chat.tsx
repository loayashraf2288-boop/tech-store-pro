import { useState, useEffect, useRef } from "react";
import { useListChatMessages, useSendChatMessage, getListChatMessagesQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Send, Paperclip, Smile, Sparkles, Headphones, X } from "lucide-react";
import { Link } from "wouter";

export function Chat() {
  const qc = useQueryClient();
  const { data: messages } = useListChatMessages();
  const send = useSendChatMessage();
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"ai" | "agent">("ai");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText("");
    send.mutate({ data: { text: t, mode } }, { onSuccess: () => qc.invalidateQueries({ queryKey: getListChatMessagesQueryKey() }) });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="bg-card border border-border rounded-3xl overflow-hidden flex flex-col h-[calc(100vh-180px)]">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10"><AvatarFallback className="bg-primary/20 text-primary"><Headphones className="h-5 w-5" /></AvatarFallback></Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
            </div>
            <div>
              <h2 className="font-bold">دردشة الدعم</h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1">متصل الآن</p>
            </div>
          </div>
          <Button asChild variant="ghost" size="icon"><Link href="/"><X className="h-5 w-5" /></Link></Button>
        </div>

        <div className="grid grid-cols-2 gap-2 p-4 border-b border-border bg-muted/10">
          <button onClick={() => setMode("ai")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${mode === "ai" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/50 hover:bg-muted text-muted-foreground"}`}>
            <Sparkles className="h-4 w-4" /> شات ذكي (AI)
          </button>
          <button onClick={() => setMode("agent")} className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition ${mode === "agent" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "bg-muted/50 hover:bg-muted text-muted-foreground"}`}>
            <Headphones className="h-4 w-4" /> تحدث مع موظف
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
          {!messages?.length && (
            <div className="text-center py-10 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-3 text-primary/50" />
              <p>ابدأ المحادثة — اسأل عن أي منتج أو طلب</p>
            </div>
          )}
          {messages?.map((m) => {
            const isUser = m.role === "user";
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? "flex-row" : "flex-row-reverse"}`}>
                <Avatar className="h-9 w-9 shrink-0">
                  <AvatarFallback className={isUser ? "bg-muted" : "bg-primary/20 text-primary"}>
                    {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[75%] ${isUser ? "" : "text-right"}`}>
                  <div className="text-xs text-muted-foreground mb-1">{m.author}</div>
                  <div className={`px-4 py-3 rounded-2xl ${isUser ? "bg-gradient-to-l from-primary to-blue-500 text-primary-foreground rounded-tr-sm" : "bg-muted rounded-tl-sm"}`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {send.isPending && <div className="text-xs text-muted-foreground text-center">جارٍ الكتابة...</div>}
        </div>

        <form onSubmit={submit} className="p-4 border-t border-border bg-muted/10 flex items-end gap-2">
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground"><Paperclip className="h-5 w-5" /></Button>
          <Button type="button" variant="ghost" size="icon" className="text-muted-foreground"><Smile className="h-5 w-5" /></Button>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="اكتب رسالتك..." className="flex-1 min-h-[44px] max-h-32 resize-none bg-background border-border" rows={1}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) submit(e); }} />
          <Button type="submit" size="icon" disabled={!text.trim() || send.isPending} className="rounded-full shadow-lg shadow-primary/20 h-11 w-11">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
