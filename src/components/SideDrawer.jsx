"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function SideDrawer() {
  const [open, setOpen] = useState(false);

  /* ───────── open by default on desktop ───────── */
  useEffect(() => {
    if (window.innerWidth >= 768) setOpen(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* ────── Mobile hamburger (hidden ≥ md) ────── */}
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="p-2 md:hidden rounded focus:outline-none focus:ring"
        >
          <Menu className="h-6 w-6" />
        </button>
      </SheetTrigger>

      {/* ────── Drawer / Sidebar ────── */}
      <SheetContent
        side="left"
        className="
          w-64  bg-background text-foreground
          p-4 flex flex-col
          md:static md:translate-x-0 md:shadow-none md:border-r
        "
      >
        {/* invisible title → satisfies Radix a11y check */}
        <SheetHeader>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
        </SheetHeader>

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