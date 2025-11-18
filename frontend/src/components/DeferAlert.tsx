import React from "react";
import type { Task } from "../types";

interface DeferAlertProps {
  task: Task;
  onViewDetails: (task: Task) => void;
}

const DeferAlert: React.FC<DeferAlertProps> = ({
  task,
  onViewDetails,
}) => {
  if (task.deferred_count <= 1) return null;

  return (
    <div className="mt-2 rounded-lg border border-amber-500/70 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-100">
      <p className="mb-2">
        This task keeps getting pushed back. Try breaking it into a
        smaller step so it&apos;s easier to start.
      </p>
      <button
        type="button"
        onClick={() => onViewDetails(task)}
        className="inline-flex items-center rounded-full border border-amber-300 bg-amber-500/20 px-3 py-1 text-[11px] font-semibold text-amber-50 hover:bg-amber-400/30 hover:border-amber-200 transition-colors"
      >
        Add a subtask
      </button>
    </div>
  );
};

export default DeferAlert;
