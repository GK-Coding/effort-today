import React from "react";

interface AddTaskSectionProps {
  description: string;
  onDescriptionChange: (value: string) => void;
  deadline: string;
  onDeadlineChange: (value: string) => void;
  pain: number;
  onPainChange: (value: number) => void;
  desire: number;
  onDesireChange: (value: number) => void;
  onSubmit: () => void;
  className?: string;
}

const AddTaskSection: React.FC<AddTaskSectionProps> = ({
  description,
  onDescriptionChange,
  deadline,
  onDeadlineChange,
  pain,
  onPainChange,
  desire,
  onDesireChange,
  onSubmit,
  className,
}) => {
  const isDisabled = !description.trim() || (pain === 0 && desire === 0);
  const estimatedScore = pain ** 2 + desire;

  const effortPalette =
    estimatedScore <= 25
      ? {
          label: "Needs a spark",
          badge: "bg-rose-500/20 text-rose-200 border-rose-400/40",
          glow: "from-rose-500/20 via-slate-950 to-slate-950",
        }
      : estimatedScore <= 60
        ? {
            label: "Momentum building",
            badge: "bg-sky-500/20 text-sky-100 border-sky-400/40",
            glow: "from-sky-500/20 via-slate-950 to-slate-950",
          }
        : {
            label: "High-impact",
            badge: "bg-emerald-500/20 text-emerald-100 border-emerald-400/40",
            glow: "from-emerald-500/20 via-slate-950 to-slate-950",
          };

  const sliderTrack =
    "w-full appearance-none rounded-full bg-slate-800/80";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl border border-slate-800/70 bg-gradient-to-br ${effortPalette.glow} p-5 shadow-2xl shadow-slate-950/40 ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute inset-x-8 top-6 h-32 rounded-full bg-gradient-to-r from-indigo-500/20 via-sky-500/10 to-emerald-400/20 blur-3xl" />
      <div className="relative z-10 space-y-4">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <span className="inline-flex items-center gap-2 self-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-indigo-100 sm:self-start">
            New Intent
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </span>
          <h2 className="text-lg font-semibold tracking-tight text-slate-50">
            Capture the next thing you’ll move forward
          </h2>
          <p className="text-sm text-slate-400">
            Describe the task in one line, choose when it matters most, and we’ll
            place it exactly where it deserves to be.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Task summary
          </label>
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 shadow-inner shadow-black/50 focus-within:border-indigo-400/80 focus-within:ring-2 focus-within:ring-indigo-500/40 transition-all">
            <input
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="e.g., Script the opening hook for the VSL"
              className="w-full bg-transparent text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-[160px,1fr]">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-slate-400">
              Deadline
              <span className="ml-2 text-[10px] lowercase text-slate-500">(optional)</span>
            </label>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-2.5 text-sm text-slate-50 focus-within:border-sky-400/70 focus-within:ring-2 focus-within:ring-sky-500/30 transition-all">
              <input
                type="date"
                value={deadline}
                onChange={(e) => onDeadlineChange(e.target.value)}
                className="w-full bg-transparent text-sm text-slate-100 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
              />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <span>Pain if ignored</span>
                <span className="text-rose-200">{pain}/10</span>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={pain}
                  onChange={(e) => onPainChange(+e.target.value)}
                  className={`${sliderTrack} accent-rose-400`}
                  style={{
                    accentColor: "#fb7185",
                  }}
                />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800/80 bg-slate-950/70 p-3">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-400">
                <span>Desire to start</span>
                <span className="text-sky-200">{desire}/10</span>
              </div>
              <div className="mt-2">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={desire}
                  onChange={(e) => onDesireChange(+e.target.value)}
                  className={`${sliderTrack} accent-sky-400`}
                  style={{
                    accentColor: "#38bdf8",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/5 bg-white/5 p-4 backdrop-blur">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Estimated effort score
              </p>
              <div
                className="text-3xl font-semibold text-slate-50"
                aria-live="polite"
              >
                {estimatedScore}
              </div>
            </div>
            <div
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${effortPalette.badge}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {effortPalette.label}
            </div>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            We combine urgency and desire to place this task intelligently inside your
            focus list. Higher scores get surfaced sooner.
          </p>
        </div>

        <button
          onClick={onSubmit}
          disabled={isDisabled}
          className="group relative mt-1 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 transition-all hover:shadow-emerald-500/40 disabled:pointer-events-none disabled:opacity-40"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            Commit this task
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m15 6 6 6-6 6" />
            </svg>
          </span>
          <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.5),transparent)]" />
          </div>
        </button>

        <p className="text-center text-[11px] text-slate-500">
          Every small decision counts—Effort Today, Effort Tomorrow.
        </p>
      </div>
    </section>
  );
};

export default AddTaskSection;

