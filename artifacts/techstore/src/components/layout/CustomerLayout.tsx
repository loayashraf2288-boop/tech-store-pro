import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function CustomerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <TopBar />
      <Header />
      <main className="flex-1 flex flex-col relative">{children}</main>
      <Footer />
    </div>
  );
}
