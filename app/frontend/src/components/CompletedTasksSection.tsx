import React from "react";
import type { Task } from "../types";
import DifficultyBar from "./DifficultyBar";
import { getDifficultyMeta } from "../utils/difficulty";

interface CompletedTasksSectionProps {
  tasks: Task[];
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
  onViewDetails: (task: Task) => void;
  className?: string;
}

const CompletedTasksSection: React.FC<CompletedTasksSectionProps> = ({
  tasks,
  showCompleted,
  onToggleShowCompleted,
  onViewDetails,
  className,
}) => {
  return (
    <section className={className}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">
          Completed tasks are hidden by default.
        </span>
        <button
          type="button"
          onClick={onToggleShowCompleted}
          className="text-xs rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
        >
          {showCompleted ? "Hide completed" : `Show completed (${tasks.length})`}
        </button>
      </div>

      {showCompleted && (
        <div className="mt-3 space-y-2">
          {tasks.length === 0 ? (
            <p className="text-xs text-slate-500">No completed tasks yet.</p>
          ) : (
            tasks.map((task) => {
              const difficulty = getDifficultyMeta(task.salience);
              return (
                <div
                  key={task.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300"
                >
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-slate-100">
                        {task.description}
                      </p>
                      {task.deadline && (
                        <div className="text-[11px] text-slate-400">
                          Due:{" "}
                          {new Date(task.deadline).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        Completed
                      </span>
                      <DifficultyBar meta={difficulty} size="sm" />
                    </div>
                  </div>
                  {task.deferred_count > 0 && (
                    <div className="mt-1 text-[11px] text-slate-500">
                      Deferred {task.deferred_count}{" "}
                      {task.deferred_count === 1 ? "time" : "times"} before
                      completion.
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => onViewDetails(task)}
                    className="mt-2 inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                  >
                    View details
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </section>
  );
};

export default CompletedTasksSection;

