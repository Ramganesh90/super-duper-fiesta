"use client";

import { CATALOG, CATEGORY_ORDER, ALL_TYPES, AWS_SERVICE, iconUrl } from "@/lib/design/catalog";
import type { Category, ComponentType } from "@/lib/design/types";

export default function Palette({ onAdd }: { onAdd: (t: ComponentType) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-comic text-lg tracking-wide">🧱 COMPONENTS</h3>
      {CATEGORY_ORDER.map((cat) => {
        const types = ALL_TYPES.filter((t) => CATALOG[t].category === cat);
        if (types.length === 0) return null;
        return (
          <div key={cat as Category}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink/50">{cat}</p>
            <div className="flex flex-wrap gap-1.5">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => onAdd(t as ComponentType)}
                  title={`${AWS_SERVICE[t]} — ${CATALOG[t].blurb}`}
                  className="comic-border-sm flex items-center gap-1.5 bg-paper px-2 py-1 text-xs font-semibold transition-transform hover:-translate-y-0.5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={iconUrl(t)} alt="" width={18} height={18} className="shrink-0 rounded-[3px] bg-white" />
                  {CATALOG[t].label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      <p className="text-xs leading-relaxed text-ink/60">
        Click to drop a component on the canvas. Then drag to arrange, and use <strong>Connect</strong> to wire them up.
      </p>
    </div>
  );
}
