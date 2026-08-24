"use client";

import { usePathname } from "next/navigation";
import { Button, NavBar } from "@/components/nessa-ui";
import { Brand } from "./brand";

const links = [
  { href: "/ui/components", label: "nessa-ui" },
  { href: "/research", label: "research" },
  { href: "/agents", label: "agents" },
  {
    href: "https://github.com/nessalabs",
    label: "github",
    external: true,
  },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <NavBar
      brand={<Brand />}
      links={links}
      activeHref={pathname}
      action={
        <Button
          variant="outline"
          size="sm"
          brackets
          onClick={() => {
            window.location.href = "mailto:hello@nessalabs.ai";
          }}
        >
          sync with us
        </Button>
      }
    />
  );
}
