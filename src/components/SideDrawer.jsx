"use client";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function SideDrawer() {
  const [open, setOpen] = useState(false);

  // 🖥️  open by default ≥768 px
  useEffect(() => {
    if (window.innerWidth >= 768) setOpen(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* mobile hamburger */}
      <SheetTrigger asChild>
        <button className="md:hidden p-2">
          <Menu size={24} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-64 md:static md:translate-x-0 md:shadow-none p-4 flex flex-col"
      >
        <nav className="flex-1 space-y-4">
          <Link href="/resources" onClick={() => setOpen(false)}>
            Resources
          </Link>
          <Link href="/formulas" onClick={() => setOpen(false)}>
            Formulas
          </Link>
        </nav>

        <Separator className="my-4" />

        <Link
          href="/settings"
          className="text-sm text-cyan-500"
          onClick={() => setOpen(false)}
        >
          Manage subscription
        </Link>
      </SheetContent>
    </Sheet>
  );
}