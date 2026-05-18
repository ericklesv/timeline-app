import type { Category } from "@/types";

export const CATEGORIES: Category[] = [
  { id: "work", label: "Trabalho", color: "#6C63FF" },
  { id: "personal", label: "Pessoal", color: "#22c55e" },
  { id: "finance", label: "Financeiro", color: "#f59e0b" },
  { id: "events", label: "Eventos", color: "#ec4899" },
  { id: "studies", label: "Estudos", color: "#06b6d4" },
  { id: "other", label: "Outros", color: "#9BA3AF" },
];

export function getCategory(id: string): Category {
  return CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
}
