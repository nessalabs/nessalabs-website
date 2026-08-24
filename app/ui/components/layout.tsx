import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Fixed viewport height with two independent scroll regions: the sidebar
    // cannot drift when the content scrolls.
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <DocsSidebar />
      <div className="min-w-0 flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
