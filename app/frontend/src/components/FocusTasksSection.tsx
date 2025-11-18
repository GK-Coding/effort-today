import React from "react";
import ActiveTaskCard from "./ActiveTaskCard";
import type { FilterMode, Task } from "../types";

interface FocusTasksSectionProps {
  className?: string;
  filterMode: FilterMode;
  isFilterMenuOpen: boolean;
  onToggleFilterMenu: () => void;
  onFilterChange: (mode: FilterMode) => void;
  topTasks: Task[];
  otherTasks: Task[];
  showOtherTasks: boolean;
  onToggleOtherTasks: () => void;
  onAdvanceState: (id: string, newState: number) => void;
  onMarkStuck: (id: string) => void;
  onViewDetails: (task: Task) => void;
  onAddSubtaskFromAlert: (task: Task) => void;
}

const FILTER_OPTIONS: Array<{
  mode: FilterMode;
  label: string;
  description: string;
  dotClass: string;
}> = [
  {
    mode: "smart",
    label: "Smart filter",
    description: "One task from each difficulty, filled with nearest deadlines.",
    dotClass: "bg-emerald-400",
  },
  {
    mode: "deadline",
    label: "Deadline (soonest first)",
    description: "Purely by due date, earliest at the top.",
    dotClass: "bg-sky-400",
  },
  {
    mode: "difficulty-hard",
    label: "Difficulty (hardest first)",
    description: "Tackle your toughest tasks first.",
    dotClass: "bg-rose-400",
  },
  {
    mode: "difficulty-easy",
    label: "Difficulty (easiest first)",
    description: "Warm up with the easier wins.",
    dotClass: "bg-emerald-400",
  },
  {
    mode: "deferred",
    label: "Times deferred (most first)",
    description: "Bring long-avoided tasks back into focus.",
    dotClass: "bg-amber-400",
  },
];

const getFilterLabel = (mode: FilterMode) => {
  switch (mode) {
    case "smart":
      return "Smart filter";
    case "deadline":
      return "Soonest first";
    case "difficulty-hard":
      return "Hardest first";
    case "difficulty-easy":
      return "Easiest first";
    case "deferred":
      return "Most deferred";
    default:
      return "Soonest first";
  }
};

const FocusTasksSection: React.FC<FocusTasksSectionProps> = ({
  className,
  filterMode,
  isFilterMenuOpen,
  onToggleFilterMenu,
  onFilterChange,
  topTasks,
  otherTasks,
  showOtherTasks,
  onToggleOtherTasks,
  onAdvanceState,
  onMarkStuck,
  onViewDetails,
  onAddSubtaskFromAlert,
}) => {
  const filterLabel = getFilterLabel(filterMode);

  return (
    <section className={className}>
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <span className="font-medium text-slate-200">Top 3 focus tasks</span>
        <div className="relative">
          <button
            type="button"
            onClick={onToggleFilterMenu}
            className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300 hover:border-slate-600 hover:bg-slate-800 border border-slate-800"
          >
            {filterLabel}
          </button>
          {isFilterMenuOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-800 bg-slate-900/95 text-xs text-slate-200 shadow-lg shadow-slate-950/60">
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.mode}
                  type="button"
                  onClick={() => onFilterChange(option.mode)}
                  className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                >
                  <span className={`mt-[2px] h-1.5 w-1.5 rounded-full ${option.dotClass}`} />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-[11px] text-slate-400">{option.description}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {topTasks.length === 0 ? (
        <p className="text-sm text-slate-500">
          No tasks yet. Add one below to get started.
        </p>
      ) : (
        topTasks.map((task) => (
          <ActiveTaskCard
            key={task.id}
            task={task}
            highlight
            onAdvanceState={onAdvanceState}
            onMarkStuck={onMarkStuck}
            onViewDetails={onViewDetails}
            onAddSubtaskFromAlert={onAddSubtaskFromAlert}
          />
        ))
      )}

      {otherTasks.length > 0 && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onToggleOtherTasks}
            className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 hover:border-slate-600 hover:bg-slate-900 transition-colors"
          >
            <span>Other active tasks ({otherTasks.length})</span>
            <span className="text-[11px] text-slate-500">
              {showOtherTasks ? "Hide" : "Show"}
            </span>
          </button>

          {showOtherTasks && (
            <div className="mt-2 space-y-2">
              {otherTasks.map((task) => (
                <ActiveTaskCard
                  key={task.id}
                  task={task}
                  onAdvanceState={onAdvanceState}
                  onMarkStuck={onMarkStuck}
                  onViewDetails={onViewDetails}
                  onAddSubtaskFromAlert={onAddSubtaskFromAlert}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default FocusTasksSection;

