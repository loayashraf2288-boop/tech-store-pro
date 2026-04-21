import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAdminMe, useAdminLogout } from "@workspace/api-client-react";
import { getAdminMeQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Zap, Bell, MessageSquare, Search, LogOut, Home, ShoppingBag, Package, Grid, Users, Ticket, ShieldAlert, MessageCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SIDEBAR_NAV = [
  { href: "/admin/dashboard", label: "الرئيسية", icon: Home },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الأقسام", icon: Grid },
  { href: "/admin/customers", label: "العملاء", icon: Users },
  { href: "/admin/coupons", label: "كوبونات الخصم", icon: Ticket },
  { href: "/admin/admins", label: "المسؤولين", icon: ShieldAlert },
  { href: "/admin/chat", label: "الشات المباشر", icon: MessageCircle },
  { href: "/admin/settings", label: "الإعدادات", icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: admin, isError, isLoading } = useAdminMe({ query: { retry: false } });
  const logout = useAdminLogout();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">جاري التحميل...</div>;
  }

  if (isError || !admin) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getAdminMeQueryKey() });
        setLocation("/admin/login");
      }
    });
  };

  return (
    <div className="min-h-[100dvh] flex bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-l border-border hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <div className="bg-primary/20 p-1.5 rounded-lg group-hover:bg-primary/30 transition-colors">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TECHSTORE
            </span>
          </Link>
        </div>
        <div className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          {SIDEBAR_NAV.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}>
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="p-4 border-t border-border">
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
            تسجيل خروج
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center flex-1 max-w-md">
            <div className="relative w-full hidden sm:block">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="بحث..." className="w-full pl-4 pr-10 bg-muted/50 border-transparent focus-visible:ring-primary" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary"></span>
            </Button>
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive"></span>
            </Button>
            <div className="h-8 w-px bg-border mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-semibold leading-none">{admin.username}</span>
                <span className="text-xs text-muted-foreground mt-1">مدير النظام</span>
              </div>
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src={admin.avatar} alt={admin.username} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {admin.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 bg-background/50">
          {children}
        </div>
      </main>
    </div>
  );
}
