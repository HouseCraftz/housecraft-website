import Image from "next/image";

export function CollectionCard({ index }: { index: number }) {
  const number = String(index).padStart(2, "0");
  return (
    <article className="collection-card">
      <div className="card-image"><Image src={`/assets/nfts/${number}.gif`} alt={`HouseCraft collection preview ${number}`} width={1254} height={1254} loading={index === 1 ? "eager" : "lazy"} unoptimized /></div>
      <div><span>HOUSECRAFT</span><strong>BUILD #{number}</strong></div>
    </article>
  );
}
