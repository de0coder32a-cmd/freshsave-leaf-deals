const images = import.meta.glob<string>("../assets/p/*.jpg", { eager: true, import: "default" });
const byCode: Record<string, string> = Object.fromEntries(
  Object.entries(images).map(([path, url]) => [path.split("/").pop()!.replace(".jpg", ""), url]),
);

export const productImage = (code: string) => byCode[code];

export function ProductImage({ code, name, className = "" }: { code: string; name: string; className?: string }) {
  const src = byCode[code];
  if (!src) return <div className={`bg-primary-soft ${className}`} />;
  return <img src={src} alt={name} loading="lazy" width={512} height={512} className={`object-cover ${className}`} />;
}
