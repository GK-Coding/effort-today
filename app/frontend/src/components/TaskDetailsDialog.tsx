import React, { useEffect, useState } from "react";
import type { Task } from "../types";
import { getDifficultyMeta } from "../utils/difficulty";
import DifficultyBar from "./DifficultyBar";

export interface SubtaskInput {
    description: string;
    pain: number;
    desire: number;
    deadline?: string | null;
}

interface TaskDetailsDialogProps {
    task: Task | null;
    isOpen: boolean;
    showSubtaskFormInitially: boolean;
    onClose: () => void;
    onAdvanceState: (id: string, newState: number) => void;
    onMarkStuck: (id: string) => void;
    onCreateSubtask: (parent: Task, values: SubtaskInput) => Promise<void>;
    onStartSubtask: (subtask: Task, parent: Task) => void;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
    task,
    isOpen,
    showSubtaskFormInitially,
    onClose,
    onAdvanceState,
    onMarkStuck,
    onCreateSubtask,
    onStartSubtask,
}) => {
    const [subDescription, setSubDescription] = useState("");
    const [subPain, setSubPain] = useState(0);
    const [subDesire, setSubDesire] = useState(0);
    const [subDeadline, setSubDeadline] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubtaskFormOpen, setIsSubtaskFormOpen] = useState(false);

    useEffect(() => {
        if (!task || !isOpen) return;
        // Seed subtask form from parent task
        setIsSubtaskFormOpen(showSubtaskFormInitially);
        setSubDescription("");
        setSubPain(task.pain);
        setSubDesire(task.desire);
        setSubDeadline(task.deadline ?? "");
    }, [task, isOpen, showSubtaskFormInitially]);

    if (!isOpen || !task) return null;

    const difficulty = getDifficultyMeta(task.salience);
    const subtasks = task.subtasks ?? [];

    const sortByDeadline = (a: Task, b: Task) => {
        const aHas = !!a.deadline;
        const bHas = !!b.deadline;
        if (!aHas && !bHas) return 0;
        if (!aHas && bHas) return 1;
        if (aHas && !bHas) return -1;
        const aTime = new Date(a.deadline as string).getTime();
        const bTime = new Date(b.deadline as string).getTime();
        return aTime - bTime;
    };

    const sortedSubtasks = [...subtasks].sort(sortByDeadline);
    const isCompleted = (t: Task) => t.state >= 2;

    const handleCreateSubtask = async () => {
        if (!subDescription.trim() || !task) return;
        setIsSubmitting(true);
        try {
            await onCreateSubtask(task, {
                description: subDescription.trim(),
                pain: subPain,
                desire: subDesire,
                deadline: subDeadline || null,
            });

            // Keep form open, but clear description so user can add more
            setSubDescription("");
        } catch (error) {
            console.error("Create subtask error (dialog):", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sliderTrack = "w-full appearance-none rounded-full bg-slate-800/80";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 shadow-xl shadow-black/60">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold text-slate-100">
                            Task details
                        </h3>
                        <p className="mt-1 text-xs text-slate-300">
                            {task.description}
                        </p>
                        {task.deadline && (
                            <p className="mt-1 text-[11px] text-slate-400">
                                Due: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                        )}
                    </div>
                    <div className="text-right">
                        <div
                            className={`text-[10px] font-semibold ${difficulty.textClass}`}
                        >
                            {difficulty.label}
                        </div>
                        <DifficultyBar meta={difficulty} size="md" />
                    </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                    Importance: {task.pain}/10 · Desire to start: {task.desire}/10
                </p>

                {task.is_stuck && (
                    <p className="mt-1 text-[11px] font-semibold text-rose-300">
                        Marked as stuck
                    </p>
                )}

                {/* Subtasks list */}
                <div className="mt-4">
                    <h4 className="text-xs font-semibold text-slate-200">
                        Subtasks
                    </h4>

                    {sortedSubtasks.length === 0 ? (
                        <p className="mt-1 text-[11px] text-slate-500">
                            No subtasks yet. Add one below.
                        </p>
                    ) : (
                        <div className="mt-2 space-y-2">
                            {sortedSubtasks.map((sub) => {
                                const subDifficulty = getDifficultyMeta(sub.salience);
                                const completed = isCompleted(sub);
                                const isStarted = sub.state === 1;
                                const isNotStarted = sub.state === 0;

                                return (
                                    <div
                                        key={sub.id}
                                        className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-[11px] text-slate-100"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                                                        Subtask
                                                    </span>
                                                    <p className="font-medium">
                                                        {sub.description}
                                                    </p>
                                                </div>
                                                {sub.deadline && (
                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        Due:{" "}
                                                        {new Date(
                                                            sub.deadline
                                                        ).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                {completed ? (
                                                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                                                        Completed
                                                    </span>
                                                ) : (
                                                    <>
                                                        <div
                                                            className={`text-[10px] font-semibold ${subDifficulty.textClass}`}
                                                        >
                                                            {subDifficulty.shortLabel}
                                                        </div>
                                                        <DifficultyBar
                                                            meta={subDifficulty}
                                                            size="sm"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {!completed && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {isNotStarted && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            onStartSubtask(sub, task)
                                                        }
                                                        className="inline-flex items-center rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-indigo-400 transition-colors"
                                                    >
                                                        Start
                                                    </button>
                                                )}
                                                {isStarted && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                onAdvanceState(sub.id, sub.state + 1)
                                                            }
                                                            className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-400 transition-colors"
                                                        >
                                                            Finish
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => onMarkStuck(sub.id)}
                                                            className="inline-flex items-center rounded-full border border-amber-400/70 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-500/20 hover:border-amber-300 transition-colors"
                                                        >
                                                            I&apos;m stuck
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Add subtask section */}
                <div className="mt-5 border-t border-slate-800 pt-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-200">
                            Add a subtask
                        </h4>
                        <button
                            type="button"
                            onClick={() =>
                                setIsSubtaskFormOpen((prev) => !prev)
                            }
                            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                        >
                            {isSubtaskFormOpen ? "Hide form" : "Add subtask"}
                        </button>
                    </div>

                    {isSubtaskFormOpen && (
                        <div className="mt-3 space-y-3 rounded-2xl border border-slate-800/60 bg-slate-950/80 p-4 shadow-inner shadow-black/40">
                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                    Subtask summary
                                </span>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2.5 focus-within:border-indigo-400/80 focus-within:ring-2 focus-within:ring-indigo-500/30 transition-all">
                                    <input
                                        value={subDescription}
                                        onChange={(e) =>
                                            setSubDescription(e.target.value)
                                        }
                                        placeholder="e.g., Outline bullet points"
                                        className="w-full bg-transparent text-xs text-slate-50 placeholder:text-slate-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                        <span>Pain</span>
                                        <span className="text-rose-200">
                                            {subPain}/10
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={subPain}
                                        onChange={(e) =>
                                            setSubPain(+e.target.value)
                                        }
                                        className={`${sliderTrack} accent-rose-400 mt-2`}
                                        style={{ accentColor: "#fb7185" }}
                                    />
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 p-3">
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                        <span>Desire</span>
                                        <span className="text-sky-200">
                                            {subDesire}/10
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        value={subDesire}
                                        onChange={(e) =>
                                            setSubDesire(+e.target.value)
                                        }
                                        className={`${sliderTrack} accent-sky-400 mt-2`}
                                        style={{ accentColor: "#38bdf8" }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                                    Deadline
                                    <span className="ml-2 lowercase text-slate-600">
                                        optional
                                    </span>
                                </span>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2 focus-within:border-sky-400/80 focus-within:ring-2 focus-within:ring-sky-500/30 transition-all">
                                    <input
                                        type="date"
                                        value={subDeadline}
                                        onChange={(e) =>
                                            setSubDeadline(e.target.value)
                                        }
                                        className="w-full bg-transparent text-xs text-slate-100 focus:outline-none [&::-webkit-calendar-picker-indicator]:invert"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-1">
                                <button
                                    type="button"
                                    onClick={() => setIsSubtaskFormOpen(false)}
                                    className="rounded-full border border-slate-700/80 px-3 py-1.5 text-[11px] font-medium text-slate-300 hover:border-slate-500 hover:bg-slate-900 transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCreateSubtask}
                                    disabled={
                                        isSubmitting || !subDescription.trim()
                                    }
                                    className="rounded-full bg-linear-to-r from-indigo-500 to-sky-400 px-4 py-1.5 text-[11px] font-semibold text-white shadow shadow-indigo-500/40 transition-all hover:shadow-sky-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isSubmitting ? "Adding..." : "Add subtask"}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-3 flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsDialog;
