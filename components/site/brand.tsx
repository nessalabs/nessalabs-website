import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-fg"
    >
      <span
        aria-hidden
        className="text-accent transition-colors group-hover:text-fg"
      >
        ◼
      </span>
      <span>
        nessa<span className="font-normal text-dim">labs</span>
      </span>
    </Link>
  );
}
