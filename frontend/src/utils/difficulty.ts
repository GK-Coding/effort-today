import type { DifficultyMeta } from "../types";

// Interpret salience as "inverse" difficulty: lower salience = higher difficulty.
export function getDifficultyMeta(salience?: number): DifficultyMeta {
  const s = typeof salience === "number" ? salience : 0;

  if (s <= 20) {
    return {
      label: "High difficulty (hard task)",
      shortLabel: "High difficulty",
      level: 5,
      textClass: "text-rose-200",
      activeClass: "bg-rose-400",
      inactiveClass: "bg-slate-800",
    };
  }

  if (s <= 60) {
    return {
      label: "Medium difficulty",
      shortLabel: "Medium difficulty",
      level: 3,
      textClass: "text-amber-200",
      activeClass: "bg-amber-400",
      inactiveClass: "bg-slate-800",
    };
  }

  return {
    label: "Lower difficulty",
    shortLabel: "Lower difficulty",
    level: 2,
    textClass: "text-emerald-200",
    activeClass: "bg-emerald-400",
    inactiveClass: "bg-slate-800",
  };
}
