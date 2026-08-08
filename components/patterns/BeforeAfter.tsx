import type { BeforeAfterData } from "@/lib/types";

interface BeforeAfterProps {
  data: BeforeAfterData;
}

export default function BeforeAfter({ data }: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="comic-border-sm bg-action-red/10 p-5">
        <h3 className="font-comic text-xl tracking-wide text-action-red">BEFORE</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm sm:text-base">
          {data.before.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">❌</span>
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="comic-border-sm bg-emerald-500/10 p-5">
        <h3 className="font-comic text-xl tracking-wide text-emerald-700">AFTER</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm sm:text-base">
          {data.after.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">✅</span>
              <span className="min-w-0 break-words">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
