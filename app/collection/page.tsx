import { BrandMark } from "@/components/BrandMark";
import { BackButton } from "@/components/BackButton";
import { HomeButton } from "@/components/HomeButton";
import { CollectionCard } from "@/components/CollectionCard";

const INFO = [
  { label: "SUPPLY", value: "3500" },
  { label: "MINT PRICE", value: "TBA" },
  { label: "MINT DATE", value: "TBA" },
  { label: "CHAIN", value: "ROBINHOOD" },
];

export default function CollectionPage() {
  return (
    <main className="collection-page">
      <div className="background-gif" />
      <nav><BrandMark compact /><div className="nav-actions"><BackButton /><HomeButton /></div></nav>
      <header className="collection-hero">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>BUILT PIXEL<br /><span>BY PIXEL</span></h1>
        <p>EVERY HOME HAS A FOUNDATION. EVERY BUILD HAS A STORY.</p>
      </header>
      <section className="collection-grid" aria-label="HouseCraft collection previews">
        {[1, 2, 3, 4, 5, 6].map((index) => <CollectionCard key={index} index={index} />)}
      </section>
      <section className="collection-info">
        {INFO.map((item) => <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong></div>)}
      </section>
      <section className="story-section">
        <p className="eyebrow">THE FOUNDATION</p>
        <h2>HOUSECRAFT — THE STORY</h2>
        <div className="story-copy">
          <p>It began with an empty stretch of land and a simple vision: to create a place where every home could have a character of its own.</p>
          <p>The first house was modest—a roof, a door, a few windows, and a small patch of land. Then came a second. And a third.</p>
          <p>Little by little, the landscape changed. Homes began to rise, streets took shape, and the open land grew into something more than a collection of buildings. It became a neighborhood.</p>
          <p>Each corner developed its own personality. Rooflines, materials, gardens, and surroundings made every house distinct. Some felt timeless and familiar. Others stood in places you would never expect. A few looked unlike anything around them.</p>
          <p>Yet every house belonged to the same story.</p>
          <p>Today, <strong>3,500 homes are under construction</strong>, each waiting for someone to step inside and make it their own.</p>
          <p>HouseCraft is not a finished neighborhood waiting to be discovered. You are arriving while it is still coming to life. The tools are still on the ground, new walls are still going up, and many doors have yet to open.</p>
          <p>Soon, every house will have an owner. Every owner will bring a new story. And together, they will shape the community that began here—with an empty piece of land and an idea.</p>
          <p className="story-manifesto"><strong>3,500 houses. 3,500 owners. One neighborhood.</strong></p>
          <p className="story-welcome"><strong>Welcome to HouseCraft.<br />Your house is waiting.</strong></p>
        </div>
      </section>
      <footer><span>BUILT PIXEL BY PIXEL</span><span>HOUSECRAFT © 2026</span></footer>
    </main>
  );
}
