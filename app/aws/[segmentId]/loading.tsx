export default function SegmentLoading() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14" aria-busy="true" aria-live="polite">
      <div className="comic-border h-40 animate-pulse bg-paper-dim sm:h-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="comic-border-sm h-32 animate-pulse bg-paper-dim" />
        <div className="comic-border-sm h-32 animate-pulse bg-paper-dim" />
      </div>
      <p className="font-comic text-center text-xl tracking-wide text-aws-orange-dark">LOADING THIS WEEK…</p>
    </div>
  );
}
