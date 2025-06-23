// ============================================================================
// SHARED HOOKS FOR LUXORA UI COMPONENT LIBRARY
// ============================================================================

import { useCallback, useEffect, useRef, useState } from "react";
import type { Option } from "../types";

/**
 * Hook for detecting clicks outside a component
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback]);

  return ref;
};

/**
 * Hook for keyboard navigation in lists/dropdowns with improved accessibility
 */
export const useKeyboardNavigation = (
  options: Option[],
  isOpen: boolean,
  onSelect: (option: Option) => void,
  onClose: () => void,
  onOpen?: () => void
) => {
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Reset highlighted index when dropdown opens/closes or options change
  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Handle keys when dropdown is closed
      if (!isOpen) {
        switch (event.key) {
          case "ArrowDown":
          case "ArrowUp":
          case "Enter":
          case " ":
            event.preventDefault();
            onOpen?.();
            break;
        }
        return;
      }

      // Handle keys when dropdown is open
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev: number) => {
            const availableOptions = options.filter(
              (option) => !option.disabled
            );
            const currentIndex = availableOptions.findIndex(
              (_, index) => options.indexOf(availableOptions[index]) === prev
            );
            const nextIndex =
              currentIndex < availableOptions.length - 1 ? currentIndex + 1 : 0;
            return options.indexOf(availableOptions[nextIndex]);
          });
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev: number) => {
            const availableOptions = options.filter(
              (option) => !option.disabled
            );
            const currentIndex = availableOptions.findIndex(
              (_, index) => options.indexOf(availableOptions[index]) === prev
            );
            const prevIndex =
              currentIndex > 0 ? currentIndex - 1 : availableOptions.length - 1;
            return options.indexOf(availableOptions[prevIndex]);
          });
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const option = options[highlightedIndex];
            if (!option.disabled) {
              onSelect(option);
            }
          }
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "Home": {
          event.preventDefault();
          const firstAvailable = options.findIndex(
            (option) => !option.disabled
          );
          if (firstAvailable !== -1) {
            setHighlightedIndex(firstAvailable);
          }
          break;
        }
        case "End": {
          event.preventDefault();
          const availableOptions = options.filter((option) => !option.disabled);
          if (availableOptions.length > 0) {
            setHighlightedIndex(
              options.indexOf(availableOptions[availableOptions.length - 1])
            );
          }
          break;
        }
      }
    },
    [isOpen, options, highlightedIndex, onSelect, onClose, onOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { highlightedIndex, setHighlightedIndex };
};

/**
 * Hook for managing focus within a component with improved accessibility
 */
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement>(null);

  const focusFirst = useCallback(() => {
    if (focusRef.current) {
      const firstFocusable = focusRef.current.querySelector(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }
  }, []);

  const focusLast = useCallback(() => {
    if (focusRef.current) {
      const focusableElements = focusRef.current.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      const lastFocusable = focusableElements[focusableElements.length - 1];
      lastFocusable?.focus();
    }
  }, []);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    if (!focusRef.current || event.key !== "Tab") return;

    const focusableElements = focusRef.current.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    }
  }, []);

  return { focusRef, focusFirst, focusLast, trapFocus };
};

/**
 * Hook for managing component state with local storage persistence
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value);
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  return [storedValue, setValue];
};

/**
 * Hook for debounced values
 */
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for announcing changes to screen readers
 */
export const useAnnouncer = () => {
  const announcerRef = useRef<HTMLDivElement>(null);

  const announce = useCallback(
    (message: string, priority: "polite" | "assertive" = "polite") => {
      if (!announcerRef.current) return;

      announcerRef.current.setAttribute("aria-live", priority);
      announcerRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = "";
        }
      }, 1000);
    },
    []
  );

  return { announce };
};

/**
 * Hook for virtual scrolling large lists
 */
export const useVirtualScroll = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items
    .slice(startIndex, endIndex + 1)
    .map((item, index) => ({
      item,
      index: startIndex + index,
    }));

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  };
};

/**
 * Hook for responsive breakpoint detection
 */
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<
    "sm" | "md" | "lg" | "xl" | "2xl"
  >("md");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint("2xl");
      else if (width >= 1280) setBreakpoint("xl");
      else if (width >= 1024) setBreakpoint("lg");
      else if (width >= 768) setBreakpoint("md");
      else setBreakpoint("sm");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return {
    breakpoint,
    isMobile: breakpoint === "sm",
    isTablet: breakpoint === "md",
    isDesktop: ["lg", "xl", "2xl"].includes(breakpoint),
  };
};

/**
 * Hook for managing loading states with minimum duration
 */
export const useLoadingState = (minDuration = 500) => {
  const [isLoading, setIsLoading] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const startLoading = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    if (startTimeRef.current) {
      const elapsed = Date.now() - startTimeRef.current;
      const remaining = Math.max(0, minDuration - elapsed);

      setTimeout(() => {
        setIsLoading(false);
        startTimeRef.current = null;
      }, remaining);
    } else {
      setIsLoading(false);
    }
  }, [minDuration]);

  return { isLoading, startLoading, stopLoading };
};
