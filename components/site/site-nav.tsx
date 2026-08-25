"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@nessa-ui/react";
import { ThemeToggle } from "./theme";
import { NavBar } from "./nav-bar";
import { Brand } from "./brand";

const links = [
  { href: "/ui/components", label: "Components" },
  { href: "/research", label: "Research" },
  { href: "/agents", label: "Agents" },
];

export function SiteNav() {
  const pathname = usePathname();

  // The harness runs as its own app surface, with its own way back.
  if (pathname.startsWith("/ui/harness")) return null;

  return (
    <NavBar
      brand={<Brand />}
      links={links}
      activeHref={pathname}
      action={
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/ui/components">
            <Button size="sm" variant="secondary">
              Get started
            </Button>
          </Link>
        </div>
      }
    />
  );
}
