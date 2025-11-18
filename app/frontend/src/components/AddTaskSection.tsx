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

  return (
    <section className={className}>
      <h2 className="text-center text-lg font-semibold tracking-tight">
        Add New Task
      </h2>

      <input
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        placeholder="What needs doing? (e.g., Write VSL hook)"
        className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300 sm:flex-row sm:items-center">
        <label className="sm:w-40">Deadline (optional)</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => onDeadlineChange(e.target.value)}
          className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:w-auto"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-4 text-xs text-slate-300">
        <label className="flex-1">
          Pain if ignored (0–10):{" "}
          <span className="font-semibold text-rose-300">{pain}</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={pain}
          onChange={(e) => onPainChange(+e.target.value)}
          className="w-40 accent-rose-400"
        />
      </div>

      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-300">
        <label className="flex-1">
          Desire to start (0–10):{" "}
          <span className="font-semibold text-sky-300">{desire}</span>
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={desire}
          onChange={(e) => onDesireChange(+e.target.value)}
          className="w-40 accent-sky-400"
        />
      </div>

      <button
        onClick={onSubmit}
        disabled={isDisabled}
        className="mt-4 w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
      >
        Add Task (Estimated effort score: {estimatedScore})
      </button>
    </section>
  );
};

export default AddTaskSection;

