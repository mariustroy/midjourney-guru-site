"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import {
  Home,
  Video,
  Sparkle,
  BookOpen,
  Users,
  Settings as Cog,
} from "lucide-react";

/* nav data --------------------------------------------------------- */
const links = [
  { href: "/",          label: "Guru",      icon: Home       },
  { href: "/tutorials", label: "Tutorials", icon: Video      },
  { href: "/formulas",  label: "Formulas",  icon: Sparkle    },
  { href: "/resources", label: "Resources", icon: BookOpen   },
  { href: "/coaching",  label: "Coaching",  icon: Users      },
];

export default function TopMenu() {
  const pathname = usePathname() ?? "/";
  const navRef   = useRef(null);

  /* center active item on mobile at mount ----------------------- */
  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector("[data-active='true']");
    if (active) {
      const nav = navRef.current;
      const left = active.offsetLeft - (nav.clientWidth - active.clientWidth) / 2;
      nav.scrollTo({ left, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f120b]">
      <nav
        ref={navRef}
        className="
          mx-auto flex gap-2 overflow-x-auto px-4 py-3
          sm:justify-start lg:justify-center   /* ← left on mobile, centered desktop */
          lg:max-w-7xl
        "
      >
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              data-active={active || undefined}
              className={clsx(
                "flex shrink-0 items-center gap-1 rounded-full px-4 py-1 text-sm transition-colors",
                active
                  ? "bg-yellow-400 text-black"
                  : "bg-white/5 text-white hover:bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          );
        })}

        {/* settings link — icon only -------------------------------- */}
        <Link
          href="/settings"
          data-active={pathname.startsWith("/settings") || undefined}
          className={clsx(
            "flex shrink-0 items-center rounded-full px-3 py-1 transition-colors",
            pathname.startsWith("/settings")
              ? "bg-yellow-400 text-black"
              : "bg-white/5 text-white hover:bg-white/10"
          )}
        >
          <Cog className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}