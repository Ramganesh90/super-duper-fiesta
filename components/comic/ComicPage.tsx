import ComicPanel from "./ComicPanel";
import type { ComicPanelData } from "@/lib/types";

interface ComicPageProps {
  panels: ComicPanelData[];
  accent?: string;
}

export default function ComicPage({ panels, accent }: ComicPageProps) {
  return (
    <div className="comic-border grid grid-cols-1 gap-4 bg-paper-dim p-4 sm:grid-cols-2 sm:gap-6 sm:p-6">
      {panels.map((panel, index) => (
        <ComicPanel key={`${panel.type}-${index}`} panel={panel} index={index} accent={accent} />
      ))}
    </div>
  );
}
