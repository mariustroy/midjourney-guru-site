"use client";

import Link from "next/link";
import Image from "next/image";
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
  { href: "/",          label: "Guru",      icon: Home    },
  { href: "/tutorials", label: "Tutorials", icon: Video   },
  { href: "/formulas",  label: "Formulas",  icon: Sparkle },
  { href: "/resources", label: "Resources", icon: BookOpen},
  { href: "/coaching",  label: "Coaching",  icon: Users   },
];

export default function TopMenu() {
  const pathname = usePathname() ?? "/";
  const navRef   = useRef(null);

  /* center active pill on mobile ---------------------------------- */
  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector("[data-active]");
    if (active) {
      const nav   = navRef.current;
      const left  =
        active.offsetLeft - (nav.clientWidth - active.clientWidth) / 2;
      nav.scrollTo({ left, behavior: "instant" });
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full" style={{ background: "#131B0E" }}>
      {/* logo row -------------------------------------------------- */}
      <div className="flex px-4 pt-12 py-2 justify-center">
        <Link href="/">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={88}
            height={21}
            priority
          />
        </Link>
      </div>

      {/* nav row --------------------------------------------------- */}
      <nav
        ref={navRef}
        className="
          mx-auto flex gap-2 overflow-x-auto px-4 py-3
          sm:justify-start lg:justify-center
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
                "flex shrink-0 items-center gap-1 rounded-full px-4 py-1 text-sm transition-colors border",
                active
                  ? "bg-[#FFFD91] text-[#131B0E] border-[#374739]"
                  : "bg-transparent text-[#FFFD91] border-[#374739] hover:bg-[#374739]/20"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}

        {/* settings – icon only ----------------------------------- */}
        <Link
          href="/settings"
          data-active={pathname.startsWith("/settings") || undefined}
          className={clsx(
            "flex shrink-0 items-center rounded-full p-2 transition-colors border",
            pathname.startsWith("/settings")
              ? "bg-[#FFFD91] text-[#131B0E] border-[#374739]"
              : "bg-transparent text-[#FFFD91] border-[#374739] hover:bg-[#374739]/20"
          )}
        >
          <Cog className="h-4 w-4" />
        </Link>
      </nav>
    </header>
  );
}