import React from "react";
import type { DifficultyMeta } from "../types";

interface DifficultyBarProps {
  meta: DifficultyMeta;
  size?: "sm" | "md";
}

const DifficultyBar: React.FC<DifficultyBarProps> = ({
  meta,
  size = "md",
}) => {
  const totalNotches = 5;
  const notchBase =
    size === "md" ? "h-2 w-4 rounded-full" : "h-1.5 w-3 rounded-full";
  const gapClass = size === "md" ? "gap-1" : "gap-0.5";

  return (
    <div className={`mt-1 flex ${gapClass} justify-end`}>
      {Array.from({ length: totalNotches }).map((_, index) => (
        <span
          key={index}
          className={`${notchBase} ${
            index < meta.level ? meta.activeClass : meta.inactiveClass
          }`}
        />
      ))}
    </div>
  );
};

export default DifficultyBar;
