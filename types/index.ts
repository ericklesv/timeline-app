export type Priority = "normal" | "important" | "urgent";

export type CategoryId =
  | "work"
  | "personal"
  | "finance"
  | "events"
  | "studies"
  | "other";

export interface Category {
  id: CategoryId;
  label: string;
  color: string; // tailwind-friendly hex
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date (yyyy-mm-dd)
  time?: string; // HH:mm
  category: CategoryId;
  priority: Priority;
  location?: string;
  notes?: string;
  done?: boolean;
  createdAt: string;
}

export type ViewMode = "timeline" | "calendar";
