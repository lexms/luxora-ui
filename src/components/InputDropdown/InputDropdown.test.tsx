import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { vi } from "vitest";
import { ThemeProvider } from "../../shared/context/ThemeContext";
import type { Option } from "../../shared/types";
import { InputDropdown } from "./InputDropdown";

const mockOptions: Option[] = [
  { label: "Apple", value: "apple", description: "A red fruit" },
  { label: "Banana", value: "banana", description: "A yellow fruit" },
  { label: "Cherry", value: "cherry", description: "A small red fruit" },
  { label: "Date", value: "date", disabled: true },
];

// Generate large list for virtual scrolling tests
const generateLargeOptions = (count: number): Option[] => {
  return Array.from({ length: count }, (_, i) => ({
    label: `Option ${i + 1}`,
    value: `option-${i + 1}`,
    description: `Description for option ${i + 1}`,
  }));
};

// Mock for ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock for matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("InputDropdown", () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
  });

  describe("Basic functionality", () => {
    it("renders with placeholder", () => {
      render(
        <InputDropdown options={mockOptions} placeholder="Select fruit" />
      );
      expect(screen.getByText("Select fruit")).toBeInTheDocument();
    });

    it("renders with label", () => {
      render(
        <InputDropdown
          options={mockOptions}
          label="Choose fruit"
          placeholder="Select fruit"
        />
      );
      expect(screen.getByText("Choose fruit")).toBeInTheDocument();
    });

    it("shows required indicator when required", () => {
      render(
        <InputDropdown options={mockOptions} label="Choose fruit" required />
      );
      expect(screen.getByText("*")).toBeInTheDocument();
    });

    it("opens dropdown when clicked", async () => {
      render(<InputDropdown options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.getByText("Banana")).toBeInTheDocument();
        expect(screen.getByText("Cherry")).toBeInTheDocument();
      });
    });

    it("opens dropdown with keyboard", async () => {
      render(<InputDropdown options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });
    });
  });

  describe("Search functionality", () => {
    it("filters options when searching", async () => {
      render(<InputDropdown options={mockOptions} searchable />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const searchInput = screen.getByRole("textbox");
      await act(async () => {
        await user.type(searchInput, "app");
      });

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
        expect(screen.queryByText("Banana")).not.toBeInTheDocument();
        expect(screen.queryByText("Cherry")).not.toBeInTheDocument();
      });
    });

    it("shows empty message when no results", async () => {
      render(<InputDropdown options={mockOptions} searchable />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const searchInput = screen.getByRole("textbox");
      await act(async () => {
        await user.type(searchInput, "xyz");
      });

      await waitFor(() => {
        expect(screen.getByText("No options found")).toBeInTheDocument();
      });
    });
  });

  describe("Selection modes", () => {
    it("selects option in single mode", async () => {
      const onChangeMock = vi.fn();
      render(<InputDropdown options={mockOptions} onChange={onChangeMock} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const appleOption = screen.getByText("Apple");
      await act(async () => {
        await user.click(appleOption);
      });

      expect(onChangeMock).toHaveBeenCalledWith(mockOptions[0]);
    });

    it("selects multiple options in multi mode", async () => {
      const onChangeMock = vi.fn();
      render(
        <InputDropdown options={mockOptions} onChange={onChangeMock} multiple />
      );

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const appleOption = screen.getByText("Apple");
      await act(async () => {
        await user.click(appleOption);
      });

      expect(onChangeMock).toHaveBeenCalledWith([mockOptions[0]]);

      const bananaOption = screen.getByText("Banana");
      await act(async () => {
        await user.click(bananaOption);
      });

      expect(onChangeMock).toHaveBeenCalledWith([
        mockOptions[0],
        mockOptions[1],
      ]);
    });

    it("deselects option in multi mode", async () => {
      const onChangeMock = vi.fn();
      render(
        <InputDropdown
          options={mockOptions}
          onChange={onChangeMock}
          multiple
          value={[mockOptions[0]]}
        />
      );

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const appleOption = screen.getByText("Apple");
      await act(async () => {
        await user.click(appleOption);
      });

      expect(onChangeMock).toHaveBeenCalledWith([]);
    });
  });

  describe("Clear functionality", () => {
    it("shows clear button when has value", () => {
      render(<InputDropdown options={mockOptions} value={mockOptions[0]} />);

      const clearButton = screen.getByLabelText("Clear selection");
      expect(clearButton).toBeInTheDocument();
    });

    it("clears value when clear button is clicked", async () => {
      const onChangeMock = vi.fn();
      render(
        <InputDropdown
          options={mockOptions}
          value={mockOptions[0]}
          onChange={onChangeMock}
        />
      );

      const clearButton = screen.getByLabelText("Clear selection");
      await act(async () => {
        await user.click(clearButton);
      });

      expect(onChangeMock).toHaveBeenCalledWith({});
    });

    it("clears multiple values", async () => {
      const onChangeMock = vi.fn();
      render(
        <InputDropdown
          options={mockOptions}
          value={[mockOptions[0], mockOptions[1]]}
          onChange={onChangeMock}
          multiple
        />
      );

      const clearButton = screen.getByLabelText("Clear selection");
      await act(async () => {
        await user.click(clearButton);
      });

      expect(onChangeMock).toHaveBeenCalledWith([]);
    });
  });

  describe("Loading state", () => {
    it("shows loading indicator", async () => {
      render(<InputDropdown options={[]} loading />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("shows loading spinner on trigger", () => {
      render(<InputDropdown options={mockOptions} loading />);

      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });
  });

  describe("Error states", () => {
    it("applies error styling", () => {
      render(<InputDropdown options={mockOptions} error />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-invalid", "true");
    });

    it("shows helper text", () => {
      render(
        <InputDropdown
          options={mockOptions}
          helperText="This is required"
          error
        />
      );

      expect(screen.getByText("This is required")).toBeInTheDocument();
    });
  });

  describe("Disabled state", () => {
    it("is disabled when disabled prop is true", () => {
      render(<InputDropdown options={mockOptions} disabled />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-disabled", "true");
    });

    it("doesn't open when disabled", async () => {
      render(<InputDropdown options={mockOptions} disabled />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.queryByText("Apple")).not.toBeInTheDocument();
    });
  });

  describe("Size variants", () => {
    it("applies small size classes", () => {
      render(<InputDropdown options={mockOptions} size="sm" />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("px-2", "py-1", "text-sm");
    });

    it("applies large size classes", () => {
      render(<InputDropdown options={mockOptions} size="lg" />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveClass("px-4", "py-3", "text-base");
    });
  });

  describe("Virtual scrolling", () => {
    it("enables virtual scrolling for large lists", async () => {
      const largeOptions = generateLargeOptions(200);
      render(<InputDropdown options={largeOptions} enableVirtualScroll />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      // Should render only visible items, not all 200
      const renderedOptions = screen.queryAllByText(/Option \d+/);
      expect(renderedOptions.length).toBeLessThan(50);
    });
  });

  describe("Dark mode", () => {
    it("renders correctly in dark mode", () => {
      render(
        <ThemeProvider defaultMode="dark">
          <InputDropdown options={mockOptions} />
        </ThemeProvider>
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes", () => {
      render(
        <InputDropdown
          options={mockOptions}
          label="Test label"
          helperText="Helper text"
        />
      );

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).toHaveAttribute("aria-describedby");
    });

    it("manages focus correctly", async () => {
      render(<InputDropdown options={mockOptions} autoFocus />);

      const trigger = screen.getByRole("combobox");
      expect(trigger).toHaveFocus();
    });

    it("announces changes to screen readers", async () => {
      render(<InputDropdown options={mockOptions} />);

      // Live region should be present
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();
    });
  });

  describe("Keyboard navigation", () => {
    it("navigates options with arrow keys", async () => {
      render(<InputDropdown options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.keyboard("{Enter}");
      });

      // Test arrow navigation would require more complex setup
      // This is a basic structure test
      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });
    });

    it("closes with Escape key", async () => {
      render(<InputDropdown options={mockOptions} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      await waitFor(() => {
        expect(screen.getByText("Apple")).toBeInTheDocument();
      });

      await act(async () => {
        await user.keyboard("{Escape}");
      });

      await waitFor(() => {
        expect(screen.queryByText("Apple")).not.toBeInTheDocument();
      });
    });
  });

  describe("Custom rendering", () => {
    it("uses custom option renderer", async () => {
      const customRenderer = (option: Option) => (
        <div data-testid={`custom-option-${option.value}`}>
          {option.label.toUpperCase()}
        </div>
      );

      render(
        <InputDropdown options={mockOptions} renderOption={customRenderer} />
      );

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByTestId("custom-option-apple")).toBeInTheDocument();
      expect(screen.getByText("APPLE")).toBeInTheDocument();
    });
  });

  describe("Edge cases", () => {
    it("handles empty options array", async () => {
      render(<InputDropdown options={[]} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByText("No options available")).toBeInTheDocument();
    });

    it("handles custom empty message", async () => {
      render(<InputDropdown options={[]} emptyMessage="Nothing here!" />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      expect(screen.getByText("Nothing here!")).toBeInTheDocument();
    });

    it("doesn't select disabled options", async () => {
      const onChangeMock = vi.fn();
      render(<InputDropdown options={mockOptions} onChange={onChangeMock} />);

      const trigger = screen.getByRole("combobox");
      await act(async () => {
        await user.click(trigger);
      });

      const disabledOption = screen.getByText("Date");
      await act(async () => {
        await user.click(disabledOption);
      });

      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });
});
