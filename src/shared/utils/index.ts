// ============================================================================
// SHARED UTILITIES FOR LUXORA UI COMPONENT LIBRARY
// ============================================================================

import { type ClassValue, clsx } from "clsx";
import type { Option } from "../types";

/**
 * Merge class names using clsx
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Filter options based on search query
 */
export function filterOptions(options: Option[], query: string): Option[] {
  if (!query.trim()) return options;

  const lowercaseQuery = query.toLowerCase();
  return options.filter(
    (option) =>
      option.label.toLowerCase().includes(lowercaseQuery) ||
      option.value.toLowerCase().includes(lowercaseQuery) ||
      option.description?.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get display labels from selected options
 */
export function getSelectedOptionLabels(
  value: Option | Option[] | undefined,
  multiple: boolean
): string[] {
  if (!value) return [];

  if (multiple && Array.isArray(value)) {
    return value.map((option) => option.label);
  }

  if (!multiple && !Array.isArray(value)) {
    return [value.label];
  }

  return [];
}

/**
 * Generate a unique ID for components
 */
export function generateId(prefix = "luxora"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if value is empty (null, undefined, empty string, empty array)
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

/**
 * Focus trap for modal/dropdown components
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const focusableSelectors = [
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "a[href]",
    '[tabindex]:not([tabindex="-1"])',
  ];

  return Array.from(
    container.querySelectorAll(focusableSelectors.join(", "))
  ) as HTMLElement[];
}
