import React, { useEffect, useState } from "react";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import apiClient from "./utils/api";

import type { FilterMode, Task } from "./types";
import TaskDetailsDialog from "./components/TaskDetailsDialog";
import type { SubtaskInput } from "./components/TaskDetailsDialog";
import FocusTasksSection from "./components/FocusTasksSection";
import CompletedTasksSection from "./components/CompletedTasksSection";
import AddTaskSection from "./components/AddTaskSection";

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
            const response = await apiClient.get("/api/tasks", {
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
            await apiClient.post("/api/tasks", payload, {
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
            await apiClient.post(
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
            await apiClient.patch(
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
            await apiClient.patch(
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
            await apiClient.patch(
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
                    apiClient.patch(
                        `/api/tasks/${subtask.id}`,
                        { state: 1 },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                );
            }

            if (parent.state === 0) {
                requests.push(
                    apiClient.patch(
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

                <FocusTasksSection
                    filterMode={filterMode}
                    isFilterMenuOpen={isFilterMenuOpen}
                    onToggleFilterMenu={() =>
                        setIsFilterMenuOpen((prev) => !prev)
                    }
                    onFilterChange={handleFilterChange}
                    topTasks={topHotTasks}
                    otherTasks={otherActiveTasks}
                    showOtherTasks={showOtherActive}
                    onToggleOtherTasks={() =>
                        setShowOtherActive((prev) => !prev)
                    }
                    onAdvanceState={advanceState}
                    onMarkStuck={markTaskStuck}
                    onViewDetails={(t) =>
                        openDetailsDialog(t, { showSubtaskForm: false })
                    }
                    onAddSubtaskFromAlert={(t) =>
                        openDetailsDialog(t, { showSubtaskForm: true })
                    }
                />

                <CompletedTasksSection
                    className="mt-2"
                    tasks={sortedCompletedTasks}
                    showCompleted={showCompleted}
                    onToggleShowCompleted={() =>
                        setShowCompleted((prev) => !prev)
                    }
                    onViewDetails={(task) =>
                        openDetailsDialog(task, { showSubtaskForm: false })
                    }
                />

                <AddTaskSection
                    className="mt-4"
                    description={description}
                    onDescriptionChange={setDescription}
                    deadline={deadline}
                    onDeadlineChange={setDeadline}
                    pain={pain}
                    onPainChange={setPain}
                    desire={desire}
                    onDesireChange={setDesire}
                    onSubmit={createTask}
                />
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
