"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { groups, registry } from "@/registry";

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 border-r border-line lg:block">
      <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-6">
        <div className="mb-6">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
            Getting started
          </div>
          <SidebarLink href="/ui/components" active={pathname === "/ui/components"}>
            Overview
          </SidebarLink>
        </div>

        {groups.map((group) => {
          const items = registry.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-6">
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-dim">
                {group}
              </div>
              <div className="flex flex-col gap-0.5">
                {items.map((item) => {
                  const href = `/ui/components/${item.slug}`;
                  return (
                    <SidebarLink
                      key={item.slug}
                      href={href}
                      active={pathname === href}
                    >
                      {item.name}
                    </SidebarLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "border-l px-3 py-1.5 font-mono text-xs transition-colors",
        active
          ? "border-accent bg-raised text-fg"
          : "border-line text-dim hover:border-dim hover:text-muted"
      )}
    >
      {children}
    </Link>
  );
}
