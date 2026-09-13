export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup ${compact ? "brand-lockup--compact" : ""}`} aria-label="HouseCraft">
      <span className="tool-mark" aria-hidden="true">
        <span className="tool-mark__hammer" />
        <span className="tool-mark__saw" />
      </span>
      <span>HOUSECRAFT</span>
    </div>
  );
}
