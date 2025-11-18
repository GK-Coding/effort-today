import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* Top nav */}
      <header className="border-b border-slate-800">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 via-sky-500 to-emerald-400 text-base font-bold shadow-lg shadow-indigo-500/40">
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

          {/* Right column: app-style preview */}
          <section className="mt-10 w-full max-w-md lg:mt-0">
            <div className="relative rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl shadow-slate-950/60">
              <div className="mb-3 flex items-center justify-between text-xs text-slate-400">
                <span className="font-medium text-slate-200">
                  Today&apos;s focus
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-wide text-emerald-300">
                  Top 3 hot tasks
                </span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    label: "Send client update email",
                    pain: 4,
                    desire: 2,
                    score: 18,
                    deferred: 2,
                  },
                  {
                    label: "Tidy your desk for 10 minutes",
                    pain: 2,
                    desire: 4,
                    score: 8,
                    deferred: 0,
                  },
                  {
                    label: "Write 3 bullets for tomorrow",
                    pain: 3,
                    desire: 3,
                    score: 12,
                    deferred: 1,
                  },
                ].map((task, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-3 text-xs text-slate-100"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] text-slate-300">
                          {idx + 1}
                        </span>
                        <p className="text-xs font-medium">{task.label}</p>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-300">
                        Priority {task.score}
                      </span>
                    </div>
                    <div className="mb-2 text-[11px] text-slate-400">
                      Importance: {task.pain}/5 · Energy for it: {task.desire}/5
                      {task.deferred > 0 && (
                        <span className="ml-2 text-[11px] text-slate-500">
                          Delayed {task.deferred}x
                        </span>
                      )}
                    </div>
                    <button className="inline-flex items-center rounded-full bg-indigo-500 px-3 py-1 text-[11px] font-semibold text-white shadow shadow-indigo-500/40 hover:bg-indigo-400 transition-colors">
                      {idx === 0 ? "Start this" : "Mark done"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-sky-500/10 to-emerald-500/10 px-3 py-3 text-xs text-slate-200">
                <p className="mb-1 font-medium">How EffortToday works</p>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-300">
                  <li>• Add a task in your own words.</li>
                  <li>
                    • Slide to set how stressful it is to ignore and how ready
                    you feel to do it.
                  </li>
                  <li>
                    • We give each task a simple score and highlight the top
                    few, so you don&apos;t have to think about the rest.
                  </li>
                  <li>• Check them off and see your effort add up over time.</li>
                </ul>
              </div>
            </div>

            <p className="mt-4 text-center text-[11px] text-slate-500">
              Sign up to see your own tasks here, instead of the demo.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
