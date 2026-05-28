import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoMark({
  className,
  size = 40,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-md bg-black",
        className,
      )}
      style={{ height: size, width: size }}
    >
      <Image
        src="/logo.png"
        alt=""
        width={size}
        height={size}
        sizes={`${size}px`}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
