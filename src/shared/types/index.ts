// ============================================================================
// SHARED TYPES FOR LUXORA UI COMPONENT LIBRARY
// ============================================================================

/**
 * Base option type used across dropdown, select, and autocomplete components
 */
export type Option = {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
};

/**
 * Common component props that most components will extend
 */
export interface BaseComponentProps {
  className?: string;
  id?: string;
  "data-testid"?: string;
}

/**
 * Size variants used across components
 */
export type Size = "sm" | "md" | "lg";

/**
 * Color variants for components
 */
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "error"
  | "info";

/**
 * Animation duration presets
 */
export type AnimationDuration = "fast" | "normal" | "slow";

/**
 * Common event handlers
 */
export interface CommonEventHandlers {
  onFocus?: (event: React.FocusEvent) => void;
  onBlur?: (event: React.FocusEvent) => void;
  onClick?: (event: React.MouseEvent) => void;
}
