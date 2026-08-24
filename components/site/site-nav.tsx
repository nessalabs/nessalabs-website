"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button, NavBar } from "@/components/nessa-ui";
import { Brand } from "./brand";

const links = [
  { href: "/ui/components", label: "Components" },
  { href: "/research", label: "Research" },
  { href: "/agents", label: "Agents" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <NavBar
      brand={<Brand />}
      links={links}
      activeHref={pathname}
      action={
        <Link href="/ui/components">
          <Button size="sm" variant="secondary">
            Get started
          </Button>
        </Link>
      }
    />
  );
}
