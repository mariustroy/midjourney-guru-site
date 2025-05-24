"use client";

import { usePathname } from "next/navigation";
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

/* ------------------------------------------------------------------ */
/*  NavLinks                                                          */
/* ------------------------------------------------------------------ */
const links = [
  { href: "/",          label: "Guru"      },
  { href: "/resources", label: "Resources" },
  { href: "/formulas",  label: "Formulas"  },
];

function NavLinks({ close }) {
  const pathname = usePathname();

  return (
    <>
      {/* main menu -------------------------------------------------- */}
      <nav className="flex-1 space-y-1 text-lg font-medium">
        {links.map(({ href, label }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={close}
              className={`
                block rounded px-3 py-2 transition-colors
                ${active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/20 hover:text-accent-foreground"}
              `}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* feedback link — bottom of drawer, just above separator ----- */}
      <Link
        href="https://docs.google.com/forms/d/e/1FAIpQLScpfr6zzb0JBkTRkeEgzeU4eV6_b7SsX27q-nPLNMIiBQ1tDA/viewform?usp=header"
        target="_blank"
        rel="noreferrer"
        onClick={close}
        className="
          block text-sm mt-4
          bottomlinks
          hover:underline
          focus-visible:outline-none focus-visible:ring
        "
      >
        💬 Feedback
      </Link>

      {/* footer action --------------------------------------------- */}
      <Separator className="my-4" />

      <Link
        href="/settings"
        onClick={close}
        className="
          block text-sm
          bottomlinks
          hover:underline
          focus-visible:outline-none focus-visible:ring
        "
      >
        Manage Subscription
      </Link>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  SideDrawer component                                              */
/* ------------------------------------------------------------------ */
export default function SideDrawer() {
  const pathname = usePathname();

  /* hide drawer on auth/login routes */
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/waitlist")
  ) {
    return null;
  }

  return (
    <>
      {/* Desktop static sidebar */}
      <aside
        className="
          hidden md:flex md:flex-col
          md:fixed md:inset-y-0 md:left-0 md:w-64
          md:bg-background md:text-foreground md:border-r md:p-4
        "
      >
        <NavLinks close={() => {}} />
      </aside>

      {/* Mobile overlay drawer */}
      <Sheet>
        <SheetTrigger asChild>
          <button
            aria-label="Open menu"
            className="
              md:hidden
              fixed top-8 left-4 z-50
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