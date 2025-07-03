// components/TopMenu.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/* ------------------------------------------------------------------ */
/*  Route links                                                       */
/* ------------------------------------------------------------------ */
const links = [
  { href: "/",          label: "Guru" },
  { href: "/formulas",  label: "Formulas" },
  { href: "/tutorials", label: "Tutorials" },
  { href: "/resources", label: "Resources" },
  { href: "/coaching",  label: "Coaching" },
  { href: "/settings",  label: "Settings" },
];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
export default function TopMenu() {
  const pathname = usePathname() ?? "/";

  /* Hide the menu on auth/login routes, just like the old SideDrawer */
  if (
    pathname.startsWith("/login")   ||
    pathname.startsWith("/auth")    ||
    pathname.startsWith("/waitlist")
  ) {
    return null;
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f120b] backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-6 py-3">
        {links.map(({ href, label }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "whitespace-nowrap rounded-full px-4 py-1 text-sm transition-colors",
                active
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-white hover:bg-white/10"
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}