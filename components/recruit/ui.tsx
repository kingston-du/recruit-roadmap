import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-sm", className)}>
      {children}
    </section>
  );
}

export function StatusPill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "cyan" | "green" | "amber" | "slate";
}) {
  const tones = {
    cyan: "bg-cyan-50 text-cyan-800 ring-cyan-100",
    green: "bg-emerald-50 text-emerald-800 ring-emerald-100",
    amber: "bg-amber-50 text-amber-800 ring-amber-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-700">{children}</label>;
}
