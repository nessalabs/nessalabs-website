"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Github } from "lucide-react";
import { Button } from "@nessa-ui/react";
import { ThemeToggle } from "./theme";
import { NavBar } from "./nav-bar";
import { Brand } from "./brand";

const links = [
  { href: "/ui/components", label: "Components" },
  { href: "/courses", label: "Courses" },
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
        <div className="flex items-center gap-1 sm:gap-2">
          <a
            href="https://github.com/nessalabs/nessa_ui"
            target="_blank"
            rel="noreferrer"
            aria-label="nessa-ui on GitHub"
            title="nessa-ui on GitHub"
            className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Github aria-hidden className="size-4" />
          </a>
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
