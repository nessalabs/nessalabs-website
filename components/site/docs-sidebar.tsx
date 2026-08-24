"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { groups, registry } from "@/registry";

/**
 * Pinned to the viewport under the nav: the sidebar itself never scrolls with
 * the page, only within its own overflow when the list gets long.
 */
export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 self-start overflow-y-auto lg:block">
      <div className="py-8 pr-6">
        <div className="mb-6">
          <div className="mb-2 px-3 text-xs font-medium text-dim">
            Getting started
          </div>
          <SidebarLink
            href="/ui/components"
            active={pathname === "/ui/components"}
          >
            Overview
          </SidebarLink>
        </div>

        {groups.map((group) => {
          const items = registry.filter((c) => c.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group} className="mb-6">
              <div className="mb-2 px-3 text-xs font-medium text-dim">
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
        "rounded-md px-3 py-1.5 text-sm transition-colors",
        active
          ? "bg-raised font-medium text-fg"
          : "text-dim hover:bg-surface hover:text-fg"
      )}
    >
      {children}
    </Link>
  );
}
