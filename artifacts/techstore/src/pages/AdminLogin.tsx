import { useState } from "react";
import { useLocation } from "wouter";
import { useAdminLogin, getAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, User, Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const login = useAdminLogin();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate(
      { data: { username, password } },
      {
        onSuccess: () => {
          qc.invalidateQueries({ queryKey: getAdminMeQueryKey() });
          setLocation("/admin");
        },
        onError: () => toast.error("بيانات الدخول غير صحيحة"),
      },
    );
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(45,168,255,0.15),transparent_50%)]" />
      <div className="absolute top-10 left-10 opacity-30 text-primary"><Zap className="h-32 w-32" /></div>
      <div className="absolute bottom-10 right-10 opacity-30 text-primary"><Zap className="h-32 w-32" /></div>

      <form onSubmit={submit} className="relative z-10 bg-card/80 backdrop-blur-xl border border-primary/30 rounded-3xl p-8 w-full max-w-md shadow-2xl shadow-primary/10">
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/30">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-l from-primary to-accent bg-clip-text text-transparent">TECHSTORE</h1>
          <p className="text-muted-foreground">لوحة التحكم - تسجيل الدخول</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block">اسم المستخدم</Label>
            <div className="relative">
              <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="loay" className="pr-10 h-12 bg-background/60" />
            </div>
          </div>
          <div>
            <Label className="mb-2 block">كلمة المرور</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type={showPwd ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className="pr-10 pl-10 h-12 bg-background/60" />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={login.isPending} className="w-full mt-6 h-12 text-lg font-bold bg-gradient-to-l from-primary to-blue-600 hover:opacity-90 shadow-lg shadow-primary/30">
          تسجيل الدخول <ArrowLeft className="h-4 w-4 mr-2" />
        </Button>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" /> لوحة تحكم آمنة ومشفرة
        </div>
      </form>
    </div>
  );
}
