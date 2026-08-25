import Link from "next/link";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-2 text-sm font-semibold tracking-tight text-foreground"
    >
      <span
        aria-hidden
        className="text-muted-foreground transition-colors group-hover:text-foreground"
      >
        ◼
      </span>
      <span>
        nessa<span className="font-normal text-muted-foreground">labs</span>
      </span>
    </Link>
  );
}
