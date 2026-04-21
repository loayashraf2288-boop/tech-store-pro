import { Card } from "@/components/ui/card";
import { Settings } from "lucide-react";

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">الإعدادات</h1>
      <Card className="border-border p-10 text-center text-muted-foreground">
        <Settings className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p>إعدادات النظام قيد التطوير</p>
      </Card>
    </div>
  );
}
