import { DocsNav } from "@/components/site/docs-nav";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Two independent scroll regions on desktop so the rail cannot drift; on
    // small screens the page scrolls normally under the collapsed nav.
    <div className="flex min-h-0 flex-col lg:h-[calc(100vh-3.5rem)] lg:flex-row lg:overflow-hidden">
      <DocsNav />
      <div className="min-w-0 flex-1 lg:overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
          {children}
        </div>
      </div>
    </div>
  );
}
