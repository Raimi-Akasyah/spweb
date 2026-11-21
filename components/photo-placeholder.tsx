import Image from "next/image";
import { publicAssetPath } from "@/lib/public-asset";

type Props = {
  label: string;
  className?: string;
  aspect?: "wide" | "portrait" | "square";
  src?: string;
  alt?: string;
  priority?: boolean;
};

export function PhotoPlaceholder({
  label,
  className = "",
  aspect = "wide",
  src,
  alt = "",
  priority = false,
}: Props) {
  return (
    <div className={`photo-frame photo-frame--${aspect} ${className}`}>
      <Image
        src={publicAssetPath(src ?? "/images/event-syafiq-izzaty.jpg")}
        alt={alt || label}
        fill
        priority={priority}
        sizes="(max-width: 700px) 100vw, 50vw"
        placeholder="blur"
        blurDataURL="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='2'/%3E%3C/filter%3E%3Cpath fill='%23e7e2d7' filter='url(%23b)' d='M0 0h8v8H0z'/%3E%3C/svg%3E"
        className="photo-frame__image"
      />
    </div>
  );
}
