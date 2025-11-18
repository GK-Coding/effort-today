export interface Task {
  id: string;
  description: string;
  state: number;
  pain: number;
  desire: number;
  salience: number;
  is_stuck: boolean;
  deferred_count: number;
  parent_id?: string | null;
  deadline?: string | null;
  subtasks?: Task[];
}

export type DifficultyMeta = {
  label: string;
  shortLabel: string;
  level: number;
  textClass: string;
  activeClass: string;
  inactiveClass: string;
};

export type FilterMode =
  | "smart"
  | "deadline"
  | "difficulty-hard"
  | "difficulty-easy"
  | "deferred";
