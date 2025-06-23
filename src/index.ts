// ============================================================================
// LUXORA UI - MAIN LIBRARY EXPORT FILE
// ============================================================================

// Export all components
export * from "./components";
export type { ThemeMode } from "./shared/context/ThemeContext";
// Export theme context
export { ThemeProvider, useTheme } from "./shared/context/ThemeContext";

// Export enhanced hooks
export {
  useAnnouncer,
  useBreakpoint,
  useClickOutside,
  useDebounce,
  useFocusManagement,
  useKeyboardNavigation,
  useLoadingState,
  useLocalStorage,
  useVirtualScroll,
} from "./shared/hooks";

// Export shared types
export type {
  AnimationDuration,
  BaseComponentProps,
  ColorVariant,
  CommonEventHandlers,
  Option,
  Size as ComponentSize,
} from "./shared/types";

// Export commonly used shared utilities (avoid conflicts)
export {
  cn,
  debounce,
  filterOptions,
  generateId,
  isEmpty,
} from "./shared/utils";

// Export theme configuration
export type { Theme } from "./theme";
export {
  animations,
  borderRadius,
  colors,
  shadows,
  sizes,
  spacing,
  theme,
  typography,
  zIndex,
} from "./theme";

// CSS styles (consumers should import this separately)
import "./styles/index.css";
