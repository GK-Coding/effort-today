import React from "react";
import { Link } from "react-router-dom";
import ActiveTaskCard from "./components/ActiveTaskCard";
import type { Task } from "./types";

const sampleTopTasks: Task[] = [
  {
    id: "demo-top-1",
    description: "Follow up with the design client",
    state: 1,
    pain: 7,
    desire: 3,
    salience: 18,
    is_stuck: false,
    deferred_count: 3,
    deadline: "2025-11-20",
    parent_id: null,
    subtasks: [],
  },
  {
    id: "demo-top-2",
    description: "Prep 3 talking points for therapy",
    state: 0,
    pain: 5,
    desire: 4,
    salience: 42,
    is_stuck: false,
    deferred_count: 1,
    deadline: "2025-11-19",
    parent_id: null,
    subtasks: [],
  },
  {
    id: "demo-top-3",
    description: "Reset kitchen + desk for tomorrow",
    state: 0,
    pain: 3,
    desire: 6,
    salience: 78,
    is_stuck: false,
    deferred_count: 0,
    deadline: null,
    parent_id: null,
    subtasks: [],
  },
];

const noopAdvanceState = (_id: string, _newState: number) => {};
const noopMarkStuck = (_id: string) => {};
const noopTaskHandler = (_task: Task) => {};
const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-base font-bold shadow-lg shadow-indigo-500/40">
              ET
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold tracking-tight">
                EffortToday
              </span>
              <span className="text-xs text-slate-400">
                Effort Today, Effort Tomorrow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="rounded-full px-4 py-1.5 text-sm font-medium text-slate-100 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/sign-up"
              className="rounded-full bg-indigo-500 px-4 py-1.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/40 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
            >
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:gap-16 lg:py-16">
          {/* Left column */}
          <section className="max-w-xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Built for ADHD brains that struggle to pick what to do next
            </div>

            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Know what to do next,
                <br />
                even on messy days.
              </h1>
              <p className="text-pretty text-sm text-slate-300 sm:text-base">
                EffortToday is a simple task tracker for people with ADHD.
                Instead of a huge to-do list, we help you choose{" "}
                <span className="font-semibold">
                  the next 1–3 things to focus on
                </span>{" "}
                based on how important they are and how doable they feel right
                now.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/sign-up"
                className="flex-1 rounded-full bg-indigo-500 px-5 py-2.5 text-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/40 hover:bg-indigo-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              >
                Start using EffortToday
              </Link>
              <Link
                to="/sign-in"
                className="flex-1 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-2.5 text-center text-sm font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-600 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
              >
                I already have an account
              </Link>
            </div>

            <ul className="mt-4 space-y-2 text-xs text-slate-400 sm:text-sm">
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  For each task, you rate two things:{" "}
                  <span className="font-medium text-slate-200">
                    how bad it feels to ignore it
                  </span>{" "}
                  and{" "}
                  <span className="font-medium text-slate-200">
                    how much you feel like doing it
                  </span>
                  .
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>
                  EffortToday turns those into a{" "}
                  <span className="font-medium text-slate-200">
                    simple priority score
                  </span>{" "}
                  and shows your top 3 “hot tasks” so you always know where to
                  start.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span>
                  Tap once to move a task from{" "}
                  <span className="font-medium text-slate-200">To do</span> →{" "}
                  <span className="font-medium text-slate-200">Doing</span> →{" "}
                  <span className="font-medium text-slate-200">Done</span>.
                  Small steps count.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-400" />
                <span>
                  If you keep putting something off, mark it as{" "}
                  <span className="font-medium text-slate-200">stuck</span>.
                  We track how often it’s deferred, but you still get credit for
                  showing up: Effort Today, Effort Tomorrow.
                </span>
              </li>
            </ul>
          </section>

          {/* Right column: in-app preview */}
          <section className="mt-10 w-full max-w-md lg:mt-0">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-2xl shadow-slate-950/70">
              <div className="pointer-events-none absolute inset-x-6 top-4 h-32 rounded-3xl bg-linear-to-r from-indigo-500/30 via-sky-500/30 to-emerald-400/30 blur-3xl" />
              <div className="relative z-10">
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Inside the real app
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">
                  Your focus list, simplified
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  A peek at two real cards from the signed-in experience. It’s
                  the same component you’ll use every day—just without your own
                  data yet.
                </p>

                <div className="mt-5 space-y-3 rounded-2xl border border-slate-800 bg-slate-950/90 p-4 shadow-lg shadow-slate-950/40">
                  {sampleTopTasks.slice(0, 2).map((task, index) => (
                    <ActiveTaskCard
                      key={task.id}
                      task={task}
                      highlight={index === 0}
                      onAdvanceState={noopAdvanceState}
                      onMarkStuck={noopMarkStuck}
                      onViewDetails={noopTaskHandler}
                      onAddSubtaskFromAlert={noopTaskHandler}
                    />
                  ))}
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Sign up to see your own tasks in this exact workspace.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
