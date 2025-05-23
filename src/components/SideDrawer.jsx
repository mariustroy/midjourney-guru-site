"use client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Menu } from "lucide-react";

const NavLinks = ({ close }) => (
  <>
    <nav className="flex-1 space-y-4">
      <Link href="/resources" onClick={close}>
        Resources
      </Link>
      <Link href="/formulas" onClick={close}>
        Formulas
      </Link>
    </nav>
    <Separator className="my-4" />
    <Link
      href="/settings"
      className="text-sm text-cyan-500"
      onClick={close}
    >
      Manage subscription
    </Link>
  </>
);

export default function SideDrawer() {
  return (
    <>
      {/* ---------- Desktop static sidebar ---------- */}
      <aside
        className="
          hidden md:flex md:flex-col
          md:fixed md:inset-y-0 md:left-0 md:w-64
          md:bg-background md:text-foreground md:border-r md:p-4
        "
      >
        <NavLinks close={() => {}} />
      </aside>

      {/* ---------- Mobile overlay drawer ---------- */}
      <Sheet>
        +<SheetTrigger asChild>
  <button
    aria-label="Open menu"
    className="
      md:hidden
      fixed top-4 left-4 z-50
      p-2 rounded bg-background/80 backdrop-blur
      focus:outline-none focus:ring
    "
  >
    <Menu className="h-5 w-5" />
  </button>
</SheetTrigger>

        <SheetContent
          side="left"
          className="w-64 bg-background text-foreground p-4 md:hidden"
        >
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>

          <NavLinks close={() => document.activeElement?.click()} />
        </SheetContent>
      </Sheet>
    </>
  );
}