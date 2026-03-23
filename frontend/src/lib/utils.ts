import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", month: "short", day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeDate(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-400/10",
    inactive: "text-red-400 bg-red-400/10",
    draft: "text-yellow-400 bg-yellow-400/10",
    pending: "text-yellow-400 bg-yellow-400/10",
    processing: "text-blue-400 bg-blue-400/10",
    shipped: "text-indigo-400 bg-indigo-400/10",
    delivered: "text-emerald-400 bg-emerald-400/10",
    canceled: "text-red-400 bg-red-400/10",
    refunded: "text-orange-400 bg-orange-400/10",
    paid: "text-emerald-400 bg-emerald-400/10",
    failed: "text-red-400 bg-red-400/10",
  };
  return map[status] ?? "text-gray-400 bg-gray-400/10";
}
