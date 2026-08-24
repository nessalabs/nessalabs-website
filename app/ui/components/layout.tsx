import { DocsSidebar } from "@/components/site/docs-sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-6xl px-6 sm:px-10">
      <DocsSidebar />
      <div className="min-w-0 flex-1 py-10 lg:pl-10">{children}</div>
    </div>
  );
}
