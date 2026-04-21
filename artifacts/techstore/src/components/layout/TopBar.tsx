import { AppWindow, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopBar() {
  return (
    <div className="bg-primary/10 text-primary-foreground py-2 px-4 text-sm flex justify-between items-center border-b border-primary/20">
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline">حمل تطبيق TECHSTORE الآن لتجربة تسوق أفضل!</span>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="h-8 gap-2 bg-background/50 border-primary/30 hover:bg-primary/20 hover:text-primary-foreground" asChild>
          <a href="https://github.com/loayashraf2288-boop/tech-store-pro/releases/download/v1.0/_TECH_STORE_19748700.apk" download>
            <AppWindow className="w-4 h-4" />
            Android APK
          </a>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-2 bg-background/50 border-primary/30 opacity-50 cursor-not-allowed" disabled>
          <Apple className="w-4 h-4" />
          iOS قريباً
        </Button>
      </div>
    </div>
  );
}
