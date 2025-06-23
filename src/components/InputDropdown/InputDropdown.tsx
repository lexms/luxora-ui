// ============================================================================
// INPUT DROPDOWN COMPONENT - OPTIMIZED VERSION
// ============================================================================

import type React from "react";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useAnnouncer,
  useBreakpoint,
  useClickOutside,
  useKeyboardNavigation,
  useVirtualScroll,
} from "../../shared/hooks";
import type { BaseComponentProps, Option } from "../../shared/types";
import { cn, filterOptions, getSelectedOptionLabels } from "../../shared/utils";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface InputDropdownProps extends BaseComponentProps {
  /** Array of options to display in the dropdown */
  options: Option[];

  /** Selected value (controlled component) */
  value?: Option | Option[];

  /** Callback when selection changes */
  onChange?: (val: Option | Option[]) => void;

  /** Enable multi-select mode */
  multiple?: boolean;

  /** Placeholder text when no option is selected */
  placeholder?: string;

  /** Disable the input */
  disabled?: boolean;

  /** Enable search functionality */
  searchable?: boolean;

  /** Custom option rendering function */
  renderOption?: (option: Option) => React.ReactNode;

  /** Component size variant */
  size?: "sm" | "md" | "lg";

  /** Error state */
  error?: boolean;

  /** Helper text displayed below the input */
  helperText?: string;

  /** Label for the input */
  label?: string;

  /** Required field indicator */
  required?: boolean;

  /** Enable virtual scrolling for large lists (default: true for >100 items) */
  enableVirtualScroll?: boolean;

  /** Maximum height of dropdown */
  maxHeight?: number;

  /** Loading state */
  loading?: boolean;

  /** Custom empty state message */
  emptyMessage?: string;

  /** Auto-focus on mount */
  autoFocus?: boolean;

  /** Close on select (single mode only) */
  closeOnSelect?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ITEM_HEIGHT = 40;
const DEFAULT_MAX_HEIGHT = 240;
const LARGE_LIST_THRESHOLD = 100;

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface DropdownLabelProps {
  label?: string;
  required?: boolean;
  inputId: string;
}

const DropdownLabel = memo<DropdownLabelProps>(
  ({ label, required, inputId }) => {
    if (!label) return null;

    return (
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
    );
  }
);

DropdownLabel.displayName = "DropdownLabel";

// ============================================================================

interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder: string;
  disabled: boolean;
}

const SearchInput = memo<SearchInputProps>(
  ({ searchQuery, onSearchChange, placeholder, disabled }) => (
    <input
      type="text"
      className="w-full bg-transparent outline-none placeholder-gray-400 dark:placeholder-gray-500 dark:text-gray-100"
      placeholder={placeholder}
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
      disabled={disabled}
      aria-label="Search options"
    />
  )
);

SearchInput.displayName = "SearchInput";

// ============================================================================

interface ClearButtonProps {
  onClear: (e: React.MouseEvent) => void;
  isMobile: boolean;
}

const ClearButton = memo<ClearButtonProps>(({ onClear, isMobile }) => (
  <button
    type="button"
    className={cn(
      "p-1 text-gray-400 hover:text-gray-600 transition-colors",
      "dark:text-gray-500 dark:hover:text-gray-300",
      isMobile && "p-2"
    )}
    onClick={onClear}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClear(e as any);
      }
    }}
    aria-label="Clear selection"
    tabIndex={-1}
  >
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <title>Clear</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
));

ClearButton.displayName = "ClearButton";

// ============================================================================

interface DropdownArrowProps {
  isOpen: boolean;
}

const DropdownArrow = memo<DropdownArrowProps>(({ isOpen }) => (
  <svg
    className={cn(
      "w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200",
      isOpen && "rotate-180"
    )}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <title>Toggle dropdown</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
));

DropdownArrow.displayName = "DropdownArrow";

// ============================================================================

interface LoadingSpinnerProps {
  size?: "sm" | "md";
}

const LoadingSpinner = memo<LoadingSpinnerProps>(({ size = "md" }) => (
  <div
    className={cn(
      "animate-spin border-2 border-luxora-500 border-t-transparent rounded-full",
      size === "sm" ? "w-4 h-4" : "w-5 h-5"
    )}
  />
));

LoadingSpinner.displayName = "LoadingSpinner";

// ============================================================================

interface MultiSelectTagsProps {
  selectedOptions: Option[];
  onRemove: (option: Option) => void;
  disabled: boolean;
  isMobile: boolean;
}

const MultiSelectTags = memo<MultiSelectTagsProps>(
  ({ selectedOptions, onRemove, disabled, isMobile }) => {
    if (selectedOptions.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {selectedOptions.map((option) => (
          <div
            key={option.value}
            className="inline-flex items-center px-2 py-1 text-xs bg-luxora-100 text-luxora-800 rounded-md dark:bg-luxora-900/30 dark:text-luxora-200"
          >
            <span className="truncate max-w-[120px]">{option.label}</span>
            {!disabled && (
              <button
                type="button"
                className={cn(
                  "ml-1 text-luxora-600 hover:text-luxora-800 transition-colors",
                  "dark:text-luxora-400 dark:hover:text-luxora-200",
                  isMobile && "p-1"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(option);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRemove(option);
                  }
                }}
                aria-label={`Remove ${option.label}`}
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>Remove</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    );
  }
);

MultiSelectTags.displayName = "MultiSelectTags";

// ============================================================================

interface OptionItemProps {
  option: Option;
  index: number;
  isHighlighted: boolean;
  isSelected: boolean;
  onSelect: (option: Option) => void;
  renderOption?: (option: Option) => React.ReactNode;
}

const OptionItem = memo<OptionItemProps>(
  ({ option, index, isHighlighted, isSelected, onSelect, renderOption }) => {
    const handleClick = useCallback(() => {
      if (!option.disabled) {
        onSelect(option);
      }
    }, [option, onSelect]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <button
        type="button"
        className={cn(
          "w-full flex items-center justify-between px-3 py-2 text-sm transition-colors text-left",
          "text-gray-900 hover:bg-luxora-50 hover:text-luxora-900",
          "dark:text-gray-100 dark:hover:bg-luxora-900/20 dark:hover:text-luxora-100",
          {
            "bg-luxora-100 text-luxora-900 dark:bg-luxora-900/30 dark:text-luxora-100":
              isHighlighted,
            "bg-luxora-500 text-white dark:bg-luxora-600 dark:text-white":
              isSelected,
            "opacity-50 cursor-not-allowed": option.disabled,
          }
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={option.disabled}
        tabIndex={-1}
        style={{ height: ITEM_HEIGHT }}
      >
        <div className="flex-1 min-w-0">
          {renderOption ? (
            renderOption(option)
          ) : (
            <div>
              <div className="truncate text-gray-900 dark:text-gray-100">
                {option.label}
              </div>
              {option.description && (
                <div className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                  {option.description}
                </div>
              )}
            </div>
          )}
        </div>

        {isSelected && (
          <svg
            className="w-4 h-4 ml-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <title>Selected</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
    );
  }
);

OptionItem.displayName = "OptionItem";

// ============================================================================

interface DropdownMenuProps {
  isOpen: boolean;
  loading: boolean;
  filteredOptions: Option[];
  searchQuery: string;
  emptyMessage?: string;
  highlightedIndex: number;
  isOptionSelected: (option: Option) => boolean;
  onSelect: (option: Option) => void;
  renderOption?: (option: Option) => React.ReactNode;
  shouldUseVirtualScroll: boolean;
  virtualScrollProps: any;
  maxHeight: number;
  isMobile: boolean;
  multiple: boolean;
  listboxId: string;
}

const DropdownMenu = memo<DropdownMenuProps>(
  ({
    isOpen,
    loading,
    filteredOptions,
    searchQuery,
    emptyMessage,
    highlightedIndex,
    isOptionSelected,
    onSelect,
    renderOption,
    shouldUseVirtualScroll,
    virtualScrollProps,
    maxHeight,
    isMobile,
    multiple,
    listboxId,
  }) => {
    const renderVirtualItems = useCallback(() => {
      if (!shouldUseVirtualScroll) {
        return filteredOptions.map((option, index) => (
          <OptionItem
            key={option.value}
            option={option}
            index={index}
            isHighlighted={index === highlightedIndex}
            isSelected={isOptionSelected(option)}
            onSelect={onSelect}
            renderOption={renderOption}
          />
        ));
      }

      const { visibleItems, totalHeight, offsetY } = virtualScrollProps;

      return (
        <div style={{ height: totalHeight, position: "relative" }}>
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map(({ item: option, index }: any) => (
              <OptionItem
                key={option.value}
                option={option}
                index={index}
                isHighlighted={index === highlightedIndex}
                isSelected={isOptionSelected(option)}
                onSelect={onSelect}
                renderOption={renderOption}
              />
            ))}
          </div>
        </div>
      );
    }, [
      shouldUseVirtualScroll,
      filteredOptions,
      highlightedIndex,
      isOptionSelected,
      onSelect,
      renderOption,
      virtualScrollProps,
    ]);

    if (!isOpen) return null;

    return (
      <div
        className={cn(
          "absolute z-50 w-full mt-1 border rounded-lg shadow-lg",
          "bg-white border-gray-200",
          "dark:bg-gray-800 dark:border-gray-600",
          "animate-slide-down",
          isMobile && "max-h-[60vh]",
          !isMobile && "max-h-60"
        )}
        style={{
          maxHeight: isMobile ? "60vh" : maxHeight,
          overflowY: shouldUseVirtualScroll ? "hidden" : "auto",
        }}
        onScroll={
          shouldUseVirtualScroll ? virtualScrollProps.handleScroll : undefined
        }
        role="listbox"
        id={listboxId}
        aria-label="Options"
        aria-multiselectable={multiple}
      >
        {loading ? (
          <div className="flex items-center justify-center px-3 py-8">
            <LoadingSpinner />
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
              Loading...
            </span>
          </div>
        ) : filteredOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            {emptyMessage ||
              (searchQuery ? "No options found" : "No options available")}
          </div>
        ) : (
          renderVirtualItems()
        )}
      </div>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

// ============================================================================

interface HelperTextProps {
  helperText?: string;
  error: boolean;
  helperTextId: string;
}

const HelperText = memo<HelperTextProps>(
  ({ helperText, error, helperTextId }) => {
    if (!helperText) return null;

    return (
      <p
        id={helperTextId}
        className={cn(
          "mt-1 text-xs",
          error
            ? "text-error-600 dark:text-error-400"
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        {helperText}
      </p>
    );
  }
);

HelperText.displayName = "HelperText";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

/**
 * InputDropdown - An optimized, comprehensive dropdown component
 *
 * Features:
 * - Single/multi-select support
 * - Search functionality
 * - Virtual scrolling for large lists
 * - Full accessibility support
 * - Dark mode theming
 * - Responsive design
 * - Performance optimized with memoization
 *
 * @example
 * ```tsx
 * <InputDropdown
 *   options={options}
 *   onChange={handleChange}
 *   placeholder="Select an option..."
 * />
 * ```
 */
export const InputDropdown = memo(
  forwardRef<HTMLDivElement, InputDropdownProps>(
    (
      {
        options,
        value,
        onChange,
        multiple = false,
        placeholder = "Select an option...",
        disabled = false,
        searchable = true,
        renderOption,
        size = "md",
        error = false,
        helperText,
        label,
        required = false,
        enableVirtualScroll,
        maxHeight = DEFAULT_MAX_HEIGHT,
        loading = false,
        emptyMessage,
        autoFocus = false,
        closeOnSelect = true,
        className,
        id: propId,
        "data-testid": dataTestId,
      },
      ref
    ) => {
      // ============================================================================
      // STATE AND REFS
      // ============================================================================

      const [isOpen, setIsOpen] = useState(false);
      const [searchQuery, setSearchQuery] = useState("");
      const [internalValue, setInternalValue] = useState<Option | Option[]>(
        multiple ? [] : ({} as Option)
      );

      const { isMobile } = useBreakpoint();
      const { announce } = useAnnouncer();

      const generatedId = useId();
      const inputId = propId || generatedId;
      const listboxId = `${inputId}-listbox`;
      const helperTextId = `${inputId}-helper`;

      const searchInputRef = useRef<HTMLInputElement>(null);
      const triggerRef = useRef<HTMLDivElement>(null);

      // ============================================================================
      // COMPUTED VALUES
      // ============================================================================

      const currentValue = value !== undefined ? value : internalValue;

      const filteredOptions = useMemo(() => {
        if (loading) return [];
        return searchable ? filterOptions(options, searchQuery) : options;
      }, [options, searchQuery, searchable, loading]);

      const shouldUseVirtualScroll = useMemo(
        () =>
          enableVirtualScroll ?? filteredOptions.length > LARGE_LIST_THRESHOLD,
        [enableVirtualScroll, filteredOptions.length]
      );

      const dropdownHeight = useMemo(
        () => Math.min(maxHeight, filteredOptions.length * ITEM_HEIGHT),
        [maxHeight, filteredOptions.length]
      );

      const selectedLabels = useMemo(
        () => getSelectedOptionLabels(currentValue, multiple),
        [currentValue, multiple]
      );

      const displayValue =
        selectedLabels.length > 0 ? selectedLabels.join(", ") : "";

      const hasValue = useMemo(() => {
        return multiple
          ? Array.isArray(currentValue) && currentValue.length > 0
          : !Array.isArray(currentValue) && currentValue.value;
      }, [currentValue, multiple]);

      const sizeClasses = useMemo(
        () => ({
          sm: cn(
            "px-2 py-1 text-sm",
            isMobile ? "min-h-[44px]" : "min-h-[2rem]"
          ),
          md: cn(
            "px-3 py-2 text-sm",
            isMobile ? "min-h-[44px]" : "min-h-[2.5rem]"
          ),
          lg: cn(
            "px-4 py-3 text-base",
            isMobile ? "min-h-[48px]" : "min-h-[3rem]"
          ),
        }),
        [isMobile]
      );

      // ============================================================================
      // HOOKS
      // ============================================================================

      const virtualScrollProps = useVirtualScroll(
        filteredOptions,
        ITEM_HEIGHT,
        dropdownHeight,
        5
      );

      const { highlightedIndex } = useKeyboardNavigation(
        filteredOptions,
        isOpen,
        handleSelect,
        handleClose,
        handleOpen
      );

      const dropdownRef = useClickOutside<HTMLDivElement>(handleClose);

      // ============================================================================
      // EVENT HANDLERS
      // ============================================================================

      function handleOpen() {
        if (disabled) return;
        setIsOpen(true);

        setTimeout(() => {
          if (searchable && searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 0);

        announce(
          `Dropdown opened. ${filteredOptions.length} options available.`,
          "polite"
        );
      }

      function handleClose() {
        setIsOpen(false);
        setSearchQuery("");

        if (triggerRef.current) {
          triggerRef.current.focus();
        }
      }

      function handleSelect(option: Option) {
        if (option.disabled) return;

        let newValue: Option | Option[];

        if (multiple && Array.isArray(currentValue)) {
          const isSelected = currentValue.some(
            (item) => item.value === option.value
          );
          newValue = isSelected
            ? currentValue.filter((item) => item.value !== option.value)
            : [...currentValue, option];

          announce(
            isSelected
              ? `${option.label} removed from selection`
              : `${option.label} added to selection`,
            "polite"
          );
        } else {
          newValue = option;
          if (closeOnSelect) {
            handleClose();
          }

          announce(`${option.label} selected`, "polite");
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }

        onChange?.(newValue);
      }

      const handleClear = useCallback(
        (e: React.MouseEvent) => {
          e.stopPropagation();
          e.preventDefault();

          const newValue = multiple ? [] : ({} as Option);

          if (value === undefined) {
            setInternalValue(newValue);
          }

          onChange?.(newValue);
          setSearchQuery("");
          announce("Selection cleared", "polite");
        },
        [multiple, value, onChange, announce]
      );

      const isOptionSelected = useCallback(
        (option: Option) => {
          if (multiple && Array.isArray(currentValue)) {
            return currentValue.some((item) => item.value === option.value);
          }
          return (
            !multiple &&
            !Array.isArray(currentValue) &&
            currentValue.value === option.value
          );
        },
        [currentValue, multiple]
      );

      const handleTriggerKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (disabled) return;

          switch (e.key) {
            case "Enter":
            case " ":
            case "ArrowDown":
            case "ArrowUp":
              e.preventDefault();
              handleOpen();
              break;
            case "Escape":
              if (isOpen) {
                e.preventDefault();
                handleClose();
              }
              break;
          }
        },
        [disabled, isOpen]
      );

      // ============================================================================
      // EFFECTS
      // ============================================================================

      useEffect(() => {
        if (autoFocus && triggerRef.current) {
          triggerRef.current.focus();
        }
      }, [autoFocus]);

      // ============================================================================
      // RENDER
      // ============================================================================

      return (
        <div
          ref={ref}
          className={cn("w-full", className)}
          data-testid={dataTestId}
        >
          <DropdownLabel label={label} required={required} inputId={inputId} />

          <div ref={dropdownRef} className="relative">
            {/* Trigger Input */}
            <div
              ref={triggerRef}
              className={cn(
                "flex items-center justify-between w-full",
                "border rounded-lg transition-all duration-200 ease-out",
                sizeClasses[size],
                {
                  "bg-white border-gray-300 hover:border-luxora-400 hover:shadow-luxora-glow":
                    !error && !disabled,
                  "focus-within:border-luxora-500 focus-within:ring-2 focus-within:ring-luxora-200 focus-within:shadow-luxora-glow-lg":
                    !error && !disabled,
                  "dark:bg-gray-800 dark:border-gray-600 dark:hover:border-luxora-400":
                    !error && !disabled,
                  "dark:focus-within:border-luxora-500 dark:focus-within:ring-luxora-500/20":
                    !error && !disabled,
                  "border-error-300 hover:border-error-400": error && !disabled,
                  "focus-within:border-error-500 focus-within:ring-2 focus-within:ring-error-200":
                    error && !disabled,
                  "dark:border-error-400 dark:hover:border-error-300":
                    error && !disabled,
                  "dark:focus-within:border-error-500 dark:focus-within:ring-error-500/20":
                    error && !disabled,
                  "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200":
                    disabled,
                  "dark:bg-gray-900 dark:text-gray-500 dark:border-gray-700":
                    disabled,
                  "border-luxora-500 ring-2 ring-luxora-200 shadow-luxora-glow-lg":
                    isOpen && !disabled && !error,
                  "dark:border-luxora-500 dark:ring-luxora-500/20":
                    isOpen && !disabled && !error,
                  "border-error-500 ring-2 ring-error-200":
                    isOpen && !disabled && error,
                  "dark:border-error-500 dark:ring-error-500/20":
                    isOpen && !disabled && error,
                  "cursor-pointer": !disabled,
                }
              )}
              onClick={handleOpen}
              onKeyDown={handleTriggerKeyDown}
              role="combobox"
              aria-expanded={isOpen}
              aria-haspopup="listbox"
              aria-owns={isOpen ? listboxId : undefined}
              aria-disabled={disabled}
              aria-invalid={error}
              aria-describedby={helperText ? helperTextId : undefined}
              aria-label={label || placeholder}
              tabIndex={disabled ? -1 : 0}
              id={inputId}
            >
              <div className="flex-1 min-w-0">
                {searchable && isOpen ? (
                  <SearchInput
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    placeholder={displayValue || placeholder}
                    disabled={disabled}
                  />
                ) : (
                  <span
                    className={cn(
                      "block truncate",
                      !displayValue && "text-gray-500 dark:text-gray-400",
                      displayValue && "text-gray-900 dark:text-gray-100"
                    )}
                  >
                    {displayValue || placeholder}
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-1 ml-2">
                {loading && <LoadingSpinner size="sm" />}

                {hasValue && !disabled && !loading && (
                  <ClearButton onClear={handleClear} isMobile={isMobile} />
                )}

                <DropdownArrow isOpen={isOpen} />
              </div>
            </div>

            {/* Multi-select Tags */}
            {multiple && Array.isArray(currentValue) && !isOpen && (
              <MultiSelectTags
                selectedOptions={currentValue}
                onRemove={handleSelect}
                disabled={disabled}
                isMobile={isMobile}
              />
            )}

            {/* Dropdown Menu */}
            <DropdownMenu
              isOpen={isOpen}
              loading={loading}
              filteredOptions={filteredOptions}
              searchQuery={searchQuery}
              emptyMessage={emptyMessage}
              highlightedIndex={highlightedIndex}
              isOptionSelected={isOptionSelected}
              onSelect={handleSelect}
              renderOption={renderOption}
              shouldUseVirtualScroll={shouldUseVirtualScroll}
              virtualScrollProps={virtualScrollProps}
              maxHeight={maxHeight}
              isMobile={isMobile}
              multiple={multiple}
              listboxId={listboxId}
            />
          </div>

          <HelperText
            helperText={helperText}
            error={error}
            helperTextId={helperTextId}
          />

          {/* Screen reader live region */}
          <div aria-live="polite" aria-atomic="true" className="sr-only" />
        </div>
      );
    }
  )
);

InputDropdown.displayName = "InputDropdown";
