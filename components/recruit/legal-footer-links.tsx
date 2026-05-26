import Link from "next/link";

export const legalLinks = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/disclaimer", label: "Disclaimer" },
] as const;

export function LegalFooterLinks({
  className = "",
  linkClassName = "",
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <nav className={className} aria-label="Legal links">
      {legalLinks.map((link) => (
        <Link key={link.href} href={link.href} className={linkClassName}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
