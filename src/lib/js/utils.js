import { writable } from "svelte/store";

export const isReset = writable(false);

export function getRandomColor() {
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#34D399",
      "#8B5CF6",
      "#EC4899",
      "#F97316",
      "#93C5FD",
      "#6EE7B7",
      "#FBBF24",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }