import Image from "next/image";

export function CollectionCard({ index }: { index: number }) {
  const number = String(index).padStart(2, "0");
  return (
    <article className="collection-card">
      <div className="card-image"><Image src={`/assets/nfts/${number}.png`} alt={`HouseCraft collection preview ${number}`} width={1024} height={1024} loading={index === 3491 ? "eager" : "lazy"} unoptimized /></div>
      <div><span>HOUSECRAFT</span><strong>BUILD #{number}</strong></div>
    </article>
  );
}
