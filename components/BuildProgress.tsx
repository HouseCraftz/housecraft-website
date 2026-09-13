export function BuildProgress({ complete }: { complete: number }) {
  return (
    <div className="build-progress" aria-label={`${complete} of 4 tasks complete`}>
      <div className={`mini-house stage-${complete}`} aria-hidden="true">
        <span className="foundation" />
        <span className="walls" />
        <span className="roof" />
        <span className="door" />
      </div>
      <div>
        <span>BUILD PROGRESS</span>
        <strong>{complete} / 4 COMPLETE</strong>
      </div>
    </div>
  );
}
