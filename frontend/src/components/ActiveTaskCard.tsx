import React from "react";
import type { Task } from "../types";
import { getDifficultyMeta } from "../utils/difficulty";
import DifficultyBar from "./DifficultyBar";
import DeferAlert from "./DeferAlert";

interface ActiveTaskCardProps {
    task: Task;
    highlight?: boolean; // true for top 3 section
    onAdvanceState: (id: string, newState: number) => void;
    onMarkStuck: (id: string) => void;
    onViewDetails: (task: Task) => void;
    onAddSubtaskFromAlert: (task: Task) => void;
}

const ActiveTaskCard: React.FC<ActiveTaskCardProps> = ({
    task,
    highlight = false,
    onAdvanceState,
    onMarkStuck,
    onViewDetails,
    onAddSubtaskFromAlert,
}) => {
    const isStarted = task.state === 1;
    const isNotStarted = task.state === 0;
    const difficulty = getDifficultyMeta(task.salience);

    const containerClass = highlight
        ? "mb-3 rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/40"
        : "rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-xs text-slate-100";

    const titleClass = highlight
        ? "text-sm font-semibold text-slate-50 sm:text-base"
        : "text-xs font-semibold text-slate-50 sm:text-sm";

    const difficultySize = highlight ? "md" : "sm";

    return (
        <div className={containerClass}>
            <div className="flex items-start justify-between gap-2">
                <div>
                    <div className={titleClass}>{task.description}</div>
                    {task.deadline && (
                        <div className="mt-1 text-[11px] text-slate-400">
                            Due: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                    )}
                    {task.is_stuck && (
                        <div className="mt-1 inline-flex items-center rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-200">
                            Stuck
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <div
                        className={`text-[10px] font-semibold ${difficulty.textClass}`}
                    >
                        {highlight ? difficulty.label : difficulty.shortLabel}
                    </div>
                    <DifficultyBar meta={difficulty} size={difficultySize} />
                </div>
            </div>

            <DeferAlert task={task} onViewDetails={onAddSubtaskFromAlert} />

            <div className="mt-3 flex flex-wrap gap-2">
                {isNotStarted && (
                    <button
                        onClick={() => onAdvanceState(task.id, task.state + 1)}
                        className="inline-flex items-center rounded-full bg-indigo-500 px-4 py-1.5 text-xs font-semibold text-white shadow shadow-indigo-500/40 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                    >
                        Start
                    </button>
                )}

                {isStarted && (
                    <>
                        <button
                            onClick={() =>
                                onAdvanceState(task.id, task.state + 1)
                            }
                            className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white shadow shadow-emerald-500/40 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                        >
                            Finish
                        </button>
                        <button
                            onClick={() => onMarkStuck(task.id)}
                            className="inline-flex items-center rounded-full border border-amber-400/70 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-200 shadow-sm shadow-amber-500/20 hover:bg-amber-500/20 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                        >
                            I&apos;m stuck
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={() => onViewDetails(task)}
                    className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                >
                    View details
                </button>
            </div>
        </div>
    );
};

export default ActiveTaskCard;
