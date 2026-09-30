import type { Diagram } from "@/lib/ai/types";

// Renders a data-driven concept/flow diagram in the app's comic style.
// Static (no client JS): rows of bordered boxes, optional group boundaries, and
// a downward arrow between rows. Violet accent to match the AI Academy.
export default function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="comic-border-sm bg-halftone flex flex-col items-center gap-1 bg-paper-dim p-5 sm:p-6">
      <div className="flex w-full flex-col items-center gap-1">
        {diagram.rows.map((row, r) => (
          <div key={r} className="flex w-full flex-col items-center">
            {row.group ? (
              <div className="w-full max-w-2xl rounded-md border-2 border-dashed border-ai-violet/50 p-3">
                <p className="mb-2 text-center font-comic text-xs tracking-wide text-ai-violet-dark sm:text-sm">
                  {row.group}
                </p>
                <RowNodes nodes={row.nodes} />
              </div>
            ) : (
              <RowNodes nodes={row.nodes} />
            )}

            {r < diagram.rows.length - 1 && (
              <span className="my-1 select-none text-2xl leading-none text-ai-violet/60" aria-hidden="true">
                ↓
              </span>
            )}
          </div>
        ))}
      </div>

      <figcaption className="mt-3 text-center text-sm font-semibold text-ink/80 sm:text-base">
        {diagram.caption}
      </figcaption>
      {diagram.note && (
        <p className="mt-1 max-w-2xl text-center text-xs leading-relaxed text-ink/60 sm:text-sm">
          💡 {diagram.note}
        </p>
      )}
    </figure>
  );
}

function RowNodes({ nodes }: { nodes: { label: string; emoji?: string; sub?: string }[] }) {
  return (
    <div className="flex flex-wrap items-stretch justify-center gap-3">
      {nodes.map((node, i) => (
        <div
          key={i}
          className="comic-border-sm flex min-w-[8rem] max-w-[14rem] flex-col items-center gap-0.5 bg-paper px-3 py-2 text-center"
        >
          <span className="font-comic text-sm tracking-wide sm:text-base">
            {node.emoji ? <span className="mr-1" aria-hidden="true">{node.emoji}</span> : null}
            {node.label}
          </span>
          {node.sub && <span className="text-xs leading-tight text-ink/60">{node.sub}</span>}
        </div>
      ))}
    </div>
  );
}
