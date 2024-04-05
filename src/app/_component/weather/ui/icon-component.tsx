import { weatherIconMappings } from "@/lib/iconMap";
import Image from "next/image";

interface IconComponentProps {
  weatherCode?: number;
  className?: string;
}

export default function IconComponent({
  weatherCode,
  className,
}: IconComponentProps) {
  const iconName = weatherIconMappings[weatherCode || ""];

  return (
    <div className={`relative invert-0 dark:invert ${className}`}>
      <Image
        fill
        alt={`${weatherCode}`}
        src={`/icons/wi-${iconName}.svg`}
        className="select-none"
      />
    </div>
  );
}
