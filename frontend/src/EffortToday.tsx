import React, { useEffect, useState } from "react";
import {
    useAuth,
    useUser,
    SignOutButton,
} from "@clerk/clerk-react";
import axios from "axios";

import type { Task } from "./types";
import ActiveTaskCard from "./components/ActiveTaskCard";
import TaskDetailsDialog from "./components/TaskDetailsDialog";
import type { SubtaskInput } from "./components/TaskDetailsDialog";
import { getDifficultyMeta } from "./utils/difficulty";
import DifficultyBar from "./components/DifficultyBar";

type FilterMode =
    | "smart"
    | "deadline"
    | "difficulty-hard"
    | "difficulty-easy"
    | "deferred";

const EffortToday: React.FC = () => {
    const { getToken } = useAuth();
    const { user } = useUser();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [description, setDescription] = useState("");
    const [pain, setPain] = useState(0);
    const [desire, setDesire] = useState(0);
    const [deadline, setDeadline] = useState("");

    const [loading, setLoading] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showOtherActive, setShowOtherActive] = useState(false);

    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [detailsTask, setDetailsTask] = useState<Task | null>(null);
    const [detailsShowSubtaskForm, setDetailsShowSubtaskForm] =
        useState(false);

    const [filterMode, setFilterMode] =
        useState<FilterMode>("deadline");
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        fetchTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const token = await getToken({ template: "jwt-default" });
            const response = await axios.get("/api/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedTasks: Task[] = response.data;
            setTasks(fetchedTasks);

            // Keep details dialog data synced if open
            setDetailsTask((prev) =>
                prev ? fetchedTasks.find((t) => t.id === prev.id) ?? prev : null
            );
        } catch (error) {
            console.error("Fetch tasks error:", error);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async () => {
        if (!description.trim()) return;
        try {
            const token = await getToken({ template: "jwt-default" });
            const payload = {
                description: description.trim(),
                pain: Number(pain),
                desire: Number(desire),
                deadline: deadline || null,
            };
            await axios.post("/api/tasks", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            setDescription("");
            setPain(0);
            setDesire(0);
            setDeadline("");
            fetchTasks();
        } catch (error) {
            console.error("Create task error:", error);
        }
    };

    const handleCreateSubtask = async (
        parent: Task,
        values: SubtaskInput
    ) => {
        try {
            const token = await getToken({ template: "jwt-default" });

            // 1) Create subtask
            await axios.post(
                "/api/tasks",
                {
                    ...values,
                    parent_id: parent.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // 2) Reset parent deferred_count and is_stuck
            await axios.patch(
                `/api/tasks/${parent.id}`,
                {
                    deferred_count: 0,
                    is_stuck: false,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await fetchTasks();
        } catch (error) {
            console.error("Create subtask error:", error);
            throw error;
        }
    };

    const advanceState = async (id: string, newState: number) => {
        try {
            const token = await getToken({ template: "jwt-default" });
            await axios.patch(
                `/api/tasks/${id}`,
                { state: newState },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            console.error("Update task error:", error);
        }
    };

    const markTaskStuck = async (id: string) => {
        try {
            const token = await getToken({ template: "jwt-default" });
            await axios.patch(
                `/api/tasks/${id}`,
                { is_stuck: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (error) {
            console.error("Mark task stuck error:", error);
        }
    };

    // Starting a subtask should also start its parent (if parent not started).
    const startSubtask = async (subtask: Task, parent: Task) => {
        try {
            const token = await getToken({ template: "jwt-default" });
            const requests: Promise<unknown>[] = [];

            if (subtask.state === 0) {
                requests.push(
                    axios.patch(
                        `/api/tasks/${subtask.id}`,
                        { state: 1 },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
            }

            if (parent.state === 0) {
                requests.push(
                    axios.patch(
                        `/api/tasks/${parent.id}`,
                        { state: 1 },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
            }

            if (requests.length > 0) {
                await Promise.all(requests);
                await fetchTasks();
            }
        } catch (error) {
            console.error("Start subtask error:", error);
        }
    };

    const openDetailsDialog = (
        task: Task,
        options?: { showSubtaskForm?: boolean }
    ) => {
        setDetailsTask(task);
        setIsDetailsOpen(true);
        setDetailsShowSubtaskForm(!!options?.showSubtaskForm);
    };

    const closeDetailsDialog = () => {
        setIsDetailsOpen(false);
        setDetailsTask(null);
        setDetailsShowSubtaskForm(false);
    };

    const handleFilterChange = (mode: FilterMode) => {
        setFilterMode(mode);
        setIsFilterMenuOpen(false);
        setShowOtherActive(false);
    };

    const isCompleted = (task: Task) => task.state >= 2;

    const activeTasks = tasks.filter((t) => !isCompleted(t));
    const completedTasks = tasks.filter(isCompleted);

    // Sort by deadline (soonest first). Tasks without deadlines go last.
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

    const sortByDifficultyHard = (a: Task, b: Task) => {
        const sa = typeof a.salience === "number" ? a.salience : 0;
        const sb = typeof b.salience === "number" ? b.salience : 0;
        // Lower salience = harder
        if (sa !== sb) return sa - sb;
        return sortByDeadline(a, b);
    };

    const sortByDifficultyEasy = (a: Task, b: Task) => {
        const sa = typeof a.salience === "number" ? a.salience : 0;
        const sb = typeof b.salience === "number" ? b.salience : 0;
        if (sa !== sb) return sb - sa; // higher salience first
        return sortByDeadline(a, b);
    };

    const sortByDeferredDesc = (a: Task, b: Task) => {
        if (a.deferred_count !== b.deferred_count) {
            return b.deferred_count - a.deferred_count; // most deferred first
        }
        return sortByDeadline(a, b);
    };

    const getDifficultyBucket = (
        salience?: number
    ): "high" | "medium" | "low" => {
        const s = typeof salience === "number" ? salience : 0;
        if (s <= 20) return "high";
        if (s <= 60) return "medium";
        return "low";
    };

    // Base sorted list by deadline for reuse
    const activeByDeadline = [...activeTasks].sort(sortByDeadline);

    let topHotTasks: Task[] = [];
    let otherActiveTasks: Task[] = [];

    if (filterMode === "smart") {
        // Smart filter:
        // - pick soonest-deadline task from each difficulty bucket (high, medium, low)
        // - if fewer than 3 tasks selected, fill the rest with earliest by deadline
        const buckets: Record<"high" | "medium" | "low", Task[]> = {
            high: [],
            medium: [],
            low: [],
        };

        for (const task of activeByDeadline) {
            const bucket = getDifficultyBucket(task.salience);
            buckets[bucket].push(task);
        }

        const picked: Task[] = [];
        const bucketOrder: Array<"high" | "medium" | "low"> = [
            "high",
            "medium",
            "low",
        ];

        for (const bucket of bucketOrder) {
            const first = buckets[bucket][0];
            if (first) picked.push(first);
        }

        if (picked.length < 3) {
            const pickedIds = new Set(picked.map((t) => t.id));
            for (const task of activeByDeadline) {
                if (picked.length >= 3) break;
                if (!pickedIds.has(task.id)) {
                    picked.push(task);
                }
            }
        }

        const pickedIds = new Set(picked.map((t) => t.id));
        topHotTasks = picked;
        otherActiveTasks = activeByDeadline.filter(
            (t) => !pickedIds.has(t.id)
        );
    } else if (filterMode === "deadline") {
        const sorted = [...activeByDeadline];
        topHotTasks = sorted.slice(0, 3);
        otherActiveTasks = sorted.slice(3);
    } else if (filterMode === "difficulty-hard") {
        const sorted = [...activeTasks].sort(sortByDifficultyHard);
        topHotTasks = sorted.slice(0, 3);
        otherActiveTasks = sorted.slice(3);
    } else if (filterMode === "difficulty-easy") {
        const sorted = [...activeTasks].sort(sortByDifficultyEasy);
        topHotTasks = sorted.slice(0, 3);
        otherActiveTasks = sorted.slice(3);
    } else {
        // "deferred"
        const sorted = [...activeTasks].sort(sortByDeferredDesc);
        topHotTasks = sorted.slice(0, 3);
        otherActiveTasks = sorted.slice(3);
    }

    const sortedCompletedTasks = [...completedTasks].sort(sortByDeadline);

    const filterLabel: string = (() => {
        switch (filterMode) {
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
    })();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-sm">
                    Loading tasks...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 px-4 py-8 font-sans text-slate-50 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
                {/* Header */}
                <header className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
                            Hi {user?.firstName ?? "there"}
                        </h1>
                        <p className="mt-2 text-sm text-slate-300">
                            Ready to get things done?
                        </p>
                    </div>
                    <SignOutButton>
                        <button className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-200 shadow-sm shadow-slate-950/40 hover:border-slate-500 hover:bg-slate-800 hover:text-white transition-colors">
                            Sign out
                        </button>
                    </SignOutButton>
                </header>

                {/* Top 3 tasks */}
                <section>
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                        <span className="font-medium text-slate-200">
                            Top 3 focus tasks
                        </span>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsFilterMenuOpen((prev) => !prev)
                                }
                                className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300 hover:border-slate-600 hover:bg-slate-800 border border-slate-800"
                            >
                                {filterLabel}
                            </button>
                            {isFilterMenuOpen && (
                                <div className="absolute right-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-800 bg-slate-900/95 text-xs text-slate-200 shadow-lg shadow-slate-950/60">
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange("smart")}
                                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                                    >
                                        <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <div>
                                            <div className="font-medium">Smart filter</div>
                                            <div className="text-[11px] text-slate-400">
                                                One task from each difficulty, filled with
                                                nearest deadlines.
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange("deadline")}
                                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                                    >
                                        <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-sky-400" />
                                        <div>
                                            <div className="font-medium">
                                                Deadline (soonest first)
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Purely by due date, earliest at the top.
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterChange("difficulty-hard")
                                        }
                                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                                    >
                                        <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-rose-400" />
                                        <div>
                                            <div className="font-medium">
                                                Difficulty (hardest first)
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Tackle your toughest tasks first.
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleFilterChange("difficulty-easy")
                                        }
                                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                                    >
                                        <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <div>
                                            <div className="font-medium">
                                                Difficulty (easiest first)
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Warm up with the easier wins.
                                            </div>
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange("deferred")}
                                        className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-slate-800/80"
                                    >
                                        <span className="mt-[2px] h-1.5 w-1.5 rounded-full bg-amber-400" />
                                        <div>
                                            <div className="font-medium">
                                                Times deferred (most first)
                                            </div>
                                            <div className="text-[11px] text-slate-400">
                                                Bring long-avoided tasks back into focus.
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {topHotTasks.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No tasks yet. Add one below to get started.
                        </p>
                    ) : (
                        topHotTasks.map((task) => (
                            <ActiveTaskCard
                                key={task.id}
                                task={task}
                                highlight
                                onAdvanceState={advanceState}
                                onMarkStuck={markTaskStuck}
                                onViewDetails={(t) =>
                                    openDetailsDialog(t, { showSubtaskForm: false })
                                }
                                onAddSubtaskFromAlert={(t) =>
                                    openDetailsDialog(t, { showSubtaskForm: true })
                                }
                            />
                        ))
                    )}

                    {/* Other active tasks (collapsible) */}
                    {otherActiveTasks.length > 0 && (
                        <div className="mt-4">
                            <button
                                type="button"
                                onClick={() => setShowOtherActive((prev) => !prev)}
                                className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-300 hover:border-slate-600 hover:bg-slate-900 transition-colors"
                            >
                                <span>
                                    Other active tasks ({otherActiveTasks.length})
                                </span>
                                <span className="text-[11px] text-slate-500">
                                    {showOtherActive ? "Hide" : "Show"}
                                </span>
                            </button>

                            {showOtherActive && (
                                <div className="mt-2 space-y-2">
                                    {otherActiveTasks.map((task) => (
                                        <ActiveTaskCard
                                            key={task.id}
                                            task={task}
                                            highlight={false}
                                            onAdvanceState={advanceState}
                                            onMarkStuck={markTaskStuck}
                                            onViewDetails={(t) =>
                                                openDetailsDialog(t, {
                                                    showSubtaskForm: false,
                                                })
                                            }
                                            onAddSubtaskFromAlert={(t) =>
                                                openDetailsDialog(t, {
                                                    showSubtaskForm: true,
                                                })
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Completed tasks toggle */}
                <section className="mt-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                            Completed tasks are hidden by default.
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowCompleted((prev) => !prev)}
                            className="text-xs rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-200 hover:border-slate-500 hover:bg-slate-800 transition-colors"
                        >
                            {showCompleted
                                ? "Hide completed"
                                : `Show completed (${completedTasks.length})`}
                        </button>
                    </div>

                    {showCompleted && (
                        <div className="mt-3 space-y-2">
                            {sortedCompletedTasks.length === 0 ? (
                                <p className="text-xs text-slate-500">
                                    No completed tasks yet.
                                </p>
                            ) : (
                                sortedCompletedTasks.map((task) => {
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
                                                            {new Date(
                                                                task.deadline
                                                            ).toLocaleDateString()}
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
                                                onClick={() =>
                                                    openDetailsDialog(task, {
                                                        showSubtaskForm: false,
                                                    })
                                                }
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

                {/* Add new task */}
                <section className="mt-4">
                    <h2 className="text-center text-lg font-semibold tracking-tight">
                        Add New Task
                    </h2>

                    <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What needs doing? (e.g., Write VSL hook)"
                        className="mt-3 w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />

                    <div className="mt-3 flex flex-col gap-2 text-xs text-slate-300 sm:flex-row sm:items-center">
                        <label className="sm:w-40">Deadline (optional)</label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2 text-xs text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:w-auto"
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4 text-xs text-slate-300">
                        <label className="flex-1">
                            Pain if ignored (0–10):{" "}
                            <span className="font-semibold text-rose-300">
                                {pain}
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={pain}
                            onChange={(e) => setPain(+e.target.value)}
                            className="w-40 accent-rose-400"
                        />
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-300">
                        <label className="flex-1">
                            Desire to start (0–10):{" "}
                            <span className="font-semibold text-sky-300">
                                {desire}
                            </span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="10"
                            value={desire}
                            onChange={(e) => setDesire(+e.target.value)}
                            className="w-40 accent-sky-400"
                        />
                    </div>

                    <button
                        onClick={createTask}
                        disabled={!description.trim() || (pain === 0 && desire === 0)}
                        className="mt-4 w-full rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
                    >
                        Add Task (Estimated effort score: {pain ** 2 + desire})
                    </button>
                </section>
            </div>

            <TaskDetailsDialog
                task={detailsTask}
                isOpen={isDetailsOpen}
                showSubtaskFormInitially={detailsShowSubtaskForm}
                onClose={closeDetailsDialog}
                onAdvanceState={advanceState}
                onMarkStuck={markTaskStuck}
                onCreateSubtask={handleCreateSubtask}
                onStartSubtask={startSubtask}
            />
        </div>
    );
};

export default EffortToday;
