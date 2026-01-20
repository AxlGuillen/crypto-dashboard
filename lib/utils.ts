/**
 * Utility Functions
 *
 * This module provides common utility functions for formatting and styling.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names using clsx and tailwind-merge
 * Handles conditional classes and resolves Tailwind conflicts
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as USD currency
 *
 * @param value - The number to format
 * @param compact - If true, uses compact notation (e.g., $1.5M instead of $1,500,000)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, compact = false): string {
  if (compact) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value)
  }

  // For small values, show more decimal places
  if (value < 1) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    }).format(value)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

/**
 * Formats a number with locale-specific formatting
 *
 * @param value - The number to format
 * @param compact - If true, uses compact notation (e.g., 1.5M instead of 1,500,000)
 * @returns Formatted number string
 */
export function formatNumber(value: number, compact = false): string {
  if (compact) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value)
  }

  return new Intl.NumberFormat("en-US").format(value)
}

/**
 * Formats a number as a percentage with sign indicator
 *
 * @param value - The percentage value (can be null or undefined)
 * @returns Formatted percentage string with +/- sign (e.g., "+5.25%" or "-3.10%")
 */
export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined) {
    return "0.00%"
  }
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}
