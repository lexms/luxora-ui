import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { InputDropdown } from "../src/components/InputDropdown";
import { ThemeProvider } from "../src/shared/context/ThemeContext";
import type { Option } from "../src/shared/types";
import "../src/styles/index.css";

// ============================================================================
// MOCK DATA
// ============================================================================

const fruits: Option[] = [
  { label: "🍎 Apple", value: "apple", description: "A crisp red fruit" },
  {
    label: "🍌 Banana",
    value: "banana",
    description: "A yellow tropical fruit",
  },
  {
    label: "🍒 Cherry",
    value: "cherry",
    description: "A small red stone fruit",
  },
  { label: "📅 Date", value: "date", description: "A sweet brown fruit" },
  {
    label: "🫐 Elderberry",
    value: "elderberry",
    description: "A dark purple berry",
  },
  { label: "🥝 Fig", value: "fig", description: "A sweet Mediterranean fruit" },
  {
    label: "🍇 Grape",
    value: "grape",
    description: "Small purple or green fruit",
  },
  {
    label: "🍈 Honeydew",
    value: "honeydew",
    description: "A sweet green melon",
  },
  { label: "🥝 Kiwi", value: "kiwi", description: "A small brown fuzzy fruit" },
  {
    label: "🍋 Lemon",
    value: "lemon",
    description: "A sour yellow citrus fruit",
  },
];

const countries: Option[] = [
  { label: "🇺🇸 United States", value: "us", description: "North America" },
  { label: "🇨🇦 Canada", value: "ca", description: "North America" },
  { label: "🇬🇧 United Kingdom", value: "uk", description: "Europe" },
  { label: "🇩🇪 Germany", value: "de", description: "Europe" },
  { label: "🇫🇷 France", value: "fr", description: "Europe" },
  { label: "🇯🇵 Japan", value: "jp", description: "Asia" },
  { label: "🇦🇺 Australia", value: "au", description: "Oceania" },
  { label: "🇧🇷 Brazil", value: "br", description: "South America" },
  { label: "🇮🇳 India", value: "in", description: "Asia" },
  { label: "🇨🇳 China", value: "cn", description: "Asia" },
];

const categories: Option[] = [
  { label: "Technology", value: "tech", description: "Software, Hardware, AI" },
  {
    label: "Science",
    value: "science",
    description: "Physics, Chemistry, Biology",
  },
  { label: "Arts", value: "arts", description: "Music, Painting, Literature" },
  {
    label: "Sports",
    value: "sports",
    description: "Football, Basketball, Soccer",
  },
  {
    label: "Travel",
    value: "travel",
    description: "Destinations, Culture, Adventure",
  },
];

const programmingLanguages: Option[] = [
  { label: "JavaScript", value: "js", description: "Dynamic web programming" },
  { label: "TypeScript", value: "ts", description: "Typed JavaScript" },
  { label: "Python", value: "python", description: "General-purpose language" },
  { label: "React", value: "react", description: "UI library for JavaScript" },
  {
    label: "Vue.js",
    value: "vue",
    description: "Progressive JavaScript framework",
  },
  {
    label: "Angular",
    value: "angular",
    description: "Full-featured framework",
  },
  { label: "Svelte", value: "svelte", description: "Compile-time framework" },
  { label: "Node.js", value: "node", description: "Server-side JavaScript" },
];

// Generate large dataset for performance testing
const generateLargeDataset = (count: number, prefix = "Item"): Option[] => {
  return Array.from({ length: count }, (_, i) => ({
    label: `${prefix} ${i + 1}`,
    value: `${prefix.toLowerCase()}-${i + 1}`,
    description: `This is ${prefix.toLowerCase()} number ${i + 1}`,
    disabled: i % 50 === 0, // Every 50th item is disabled
  }));
};

const largeDataset = generateLargeDataset(1000, "Product");
const veryLargeDataset = generateLargeDataset(5000, "Record");

// ============================================================================
// STORY CONFIGURATION
// ============================================================================

const meta: Meta<typeof InputDropdown> = {
  title: "Components/InputDropdown",
  component: InputDropdown,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
# InputDropdown

A comprehensive, accessible dropdown component with advanced features:

## Key Features
- 🔍 **Search & Filter**: Searchable options with real-time filtering
- 🎯 **Single & Multi-select**: Support for both selection modes
- ♿ **Accessibility**: Full keyboard navigation and screen reader support
- 🎨 **Theming**: Dark/light mode with customizable styling
- ⚡ **Performance**: Virtual scrolling for large datasets (1000+ items)
- 📱 **Responsive**: Mobile-optimized with touch-friendly interactions
- 🎛️ **Customization**: Flexible rendering and styling options

## Accessibility Features
- Full keyboard navigation (Arrow keys, Enter, Escape, Home, End)
- Screen reader announcements for state changes
- Focus management and trapping
- ARIA attributes for proper semantics
- High contrast mode support

## Performance Optimizations
- Memoized components and callbacks
- Virtual scrolling for large lists
- Debounced search filtering
- Efficient re-render prevention
        `,
      },
    },
  },
  argTypes: {
    options: {
      description: "Array of options to display",
      control: "object",
    },
    value: {
      description: "Selected value (controlled mode)",
      control: "object",
    },
    multiple: {
      description: "Enable multi-select mode",
      control: "boolean",
    },
    searchable: {
      description: "Enable search functionality",
      control: "boolean",
    },
    disabled: {
      description: "Disable the input",
      control: "boolean",
    },
    loading: {
      description: "Show loading state",
      control: "boolean",
    },
    error: {
      description: "Show error state",
      control: "boolean",
    },
    size: {
      description: "Component size variant",
      control: "select",
      options: ["sm", "md", "lg"],
    },
    placeholder: {
      description: "Placeholder text when no selection",
      control: "text",
    },
    label: {
      description: "Input label",
      control: "text",
    },
    helperText: {
      description: "Helper text below input",
      control: "text",
    },
    required: {
      description: "Required field indicator",
      control: "boolean",
    },
    enableVirtualScroll: {
      description: "Enable virtual scrolling (auto for 100+ items)",
      control: "boolean",
    },
    maxHeight: {
      description: "Maximum dropdown height in pixels",
      control: "number",
    },
    emptyMessage: {
      description: "Custom empty state message",
      control: "text",
    },
    closeOnSelect: {
      description: "Close dropdown after selection (single mode)",
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "400px", padding: "24px", minHeight: "500px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof InputDropdown>;

// ============================================================================
// BASIC EXAMPLES
// ============================================================================

export const Default: Story = {
  args: {
    options: fruits.slice(0, 5),
    placeholder: "Select a fruit...",
    label: "Favorite Fruit",
    helperText: "Choose your favorite fruit from the list",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Basic dropdown with default settings. Features search, single selection, and clean styling.",
      },
    },
  },
};

export const WithPreselection: Story = {
  args: {
    options: fruits.slice(0, 5),
    value: fruits[1],
    placeholder: "Select a fruit...",
    label: "Pre-selected Fruit",
    helperText: "This dropdown has a pre-selected value",
  },
  parameters: {
    docs: {
      description: {
        story: "Dropdown with a pre-selected value in controlled mode.",
      },
    },
  },
};

export const MultiSelect: Story = {
  args: {
    options: fruits,
    multiple: true,
    placeholder: "Select multiple fruits...",
    label: "Favorite Fruits",
    helperText: "You can select multiple options",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Multi-select mode with tag display. Selected items appear as removable tags below the input.",
      },
    },
  },
};

export const MultiSelectPreselected: Story = {
  args: {
    options: fruits,
    multiple: true,
    value: [fruits[1], fruits[3], fruits[5]],
    placeholder: "Select fruits...",
    label: "Pre-selected Multiple",
    helperText: "Multiple items pre-selected",
  },
  parameters: {
    docs: {
      description: {
        story: "Multi-select with pre-selected values showing tag display.",
      },
    },
  },
};

// ============================================================================
// SEARCH & FILTERING
// ============================================================================

export const WithSearch: Story = {
  args: {
    options: countries,
    searchable: true,
    placeholder: "Search countries...",
    label: "Select Country",
    helperText: "Type to filter countries",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Searchable dropdown with real-time filtering. Type to see matching options.",
      },
    },
  },
};

export const NonSearchable: Story = {
  args: {
    options: categories,
    searchable: false,
    placeholder: "Select a category...",
    label: "Category (No Search)",
    helperText: "Simple dropdown without search functionality",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown without search functionality for simple selection scenarios.",
      },
    },
  },
};

// ============================================================================
// SIZES & STYLING
// ============================================================================

export const SmallSize: Story = {
  args: {
    options: categories,
    size: "sm",
    placeholder: "Small dropdown...",
    label: "Small Size",
    helperText: "Compact size for tight layouts",
  },
  parameters: {
    docs: {
      description: {
        story: "Small size variant for compact interfaces and forms.",
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    options: categories,
    size: "lg",
    placeholder: "Large dropdown...",
    label: "Large Size",
    helperText: "Larger size for prominent selections",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Large size variant for prominent form elements and better accessibility.",
      },
    },
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-6">
      <InputDropdown
        options={categories}
        size="sm"
        placeholder="Small size..."
        label="Small"
      />
      <InputDropdown
        options={categories}
        size="md"
        placeholder="Medium size..."
        label="Medium (Default)"
      />
      <InputDropdown
        options={categories}
        size="lg"
        placeholder="Large size..."
        label="Large"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all available size variants side by side.",
      },
    },
  },
};

// ============================================================================
// STATES & VALIDATION
// ============================================================================

export const DisabledState: Story = {
  args: {
    options: fruits,
    disabled: true,
    value: fruits[0],
    placeholder: "This is disabled...",
    label: "Disabled Dropdown",
    helperText: "This field is disabled",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Disabled state with proper visual feedback and accessibility attributes.",
      },
    },
  },
};

export const ErrorState: Story = {
  args: {
    options: fruits,
    error: true,
    placeholder: "Select with error...",
    label: "Required Field",
    helperText: "Please select a valid option",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state with visual indicators and helpful error messaging.",
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    options: [],
    loading: true,
    placeholder: "Loading options...",
    label: "Loading State",
    helperText: "Please wait while options are being loaded",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Loading state with spinner animation while data is being fetched.",
      },
    },
  },
};

export const RequiredField: Story = {
  args: {
    options: categories,
    required: true,
    placeholder: "This field is required...",
    label: "Required Selection",
    helperText: "You must select an option to continue",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Required field with asterisk indicator and appropriate messaging.",
      },
    },
  },
};

// ============================================================================
// PERFORMANCE & LARGE DATASETS
// ============================================================================

export const LargeDataset: Story = {
  args: {
    options: largeDataset,
    placeholder: "Search from 1000 items...",
    label: "Large Dataset (1000 items)",
    helperText: "Virtual scrolling automatically enabled for performance",
    enableVirtualScroll: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Performance test with 1000 items. Virtual scrolling is automatically enabled for smooth performance.",
      },
    },
  },
};

export const VeryLargeDataset: Story = {
  args: {
    options: veryLargeDataset,
    placeholder: "Search from 5000 items...",
    label: "Very Large Dataset (5000 items)",
    helperText: "Optimized for extreme performance with virtual scrolling",
    enableVirtualScroll: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Extreme performance test with 5000 items demonstrating virtual scrolling capabilities.",
      },
    },
  },
};

export const VirtualScrollingDisabled: Story = {
  args: {
    options: largeDataset.slice(0, 50),
    placeholder: "50 items without virtual scrolling...",
    label: "Virtual Scrolling Disabled",
    helperText: "Regular scrolling for smaller lists",
    enableVirtualScroll: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Regular scrolling behavior for smaller datasets or when virtual scrolling is explicitly disabled.",
      },
    },
  },
};

// ============================================================================
// CUSTOM RENDERING
// ============================================================================

export const CustomOptionRendering: Story = {
  args: {
    options: programmingLanguages,
    multiple: true,
    placeholder: "Select technologies...",
    label: "Technologies",
    helperText: "Custom rendering with icons and descriptions",
    renderOption: (option: Option) => (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">
              {option.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {option.description}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500 uppercase font-mono">
          {option.value}
        </span>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Custom option rendering with icons, descriptions, and custom layouts. Demonstrates the flexibility of the renderOption prop.",
      },
    },
  },
};

export const CountryFlagsExample: Story = {
  args: {
    options: countries,
    placeholder: "Select country...",
    label: "Country Selection",
    helperText: "Countries with flag emojis and regions",
    renderOption: (option: Option) => (
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <div className="font-medium text-gray-900 dark:text-gray-100">
            {option.label}
          </div>
          {option.description && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Region: {option.description}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 uppercase font-mono">
          {option.value}
        </div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Country selection with flag emojis and regional information in custom rendering.",
      },
    },
  },
};

// ============================================================================
// INTERACTIVE EXAMPLES
// ============================================================================

export const ControlledExample: Story = {
  render: () => {
    const [selectedFruit, setSelectedFruit] = useState<Option | undefined>(
      fruits[0]
    );
    const [selectedCountries, setSelectedCountries] = useState<Option[]>([
      countries[0],
      countries[2],
    ]);

    return (
      <div className="space-y-6">
        <div>
          <InputDropdown
            options={fruits}
            value={selectedFruit}
            onChange={(value) => setSelectedFruit(value as Option)}
            placeholder="Select a fruit..."
            label="Single Selection (Controlled)"
            helperText={`Selected: ${selectedFruit?.label || "None"}`}
          />
        </div>

        <div>
          <InputDropdown
            options={countries}
            value={selectedCountries}
            onChange={(value) => setSelectedCountries(value as Option[])}
            multiple
            placeholder="Select countries..."
            label="Multi Selection (Controlled)"
            helperText={`Selected: ${selectedCountries.length} countries`}
          />
        </div>

        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-medium mb-2 text-gray-900 dark:text-gray-100">
            Current Values:
          </h4>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>Fruit:</strong> {selectedFruit?.label || "None"}
            </p>
            <p>
              <strong>Countries:</strong>{" "}
              {selectedCountries.map((c) => c.label).join(", ") || "None"}
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Fully controlled components with state management. Shows how to handle both single and multi-select in controlled mode.",
      },
    },
  },
};

export const DynamicOptionsExample: Story = {
  render: () => {
    const [selectedCategory, setSelectedCategory] = useState<
      Option | undefined
    >();
    const [availableOptions, setAvailableOptions] =
      useState<Option[]>(categories);

    const addRandomOption = () => {
      const newOption: Option = {
        label: `Dynamic Option ${availableOptions.length + 1}`,
        value: `dynamic-${availableOptions.length + 1}`,
        description: "Dynamically added option",
      };
      setAvailableOptions([...availableOptions, newOption]);
    };

    const removeLastOption = () => {
      if (availableOptions.length > categories.length) {
        setAvailableOptions(availableOptions.slice(0, -1));
      }
    };

    return (
      <div className="space-y-4">
        <InputDropdown
          options={availableOptions}
          value={selectedCategory}
          onChange={(value) => setSelectedCategory(value as Option)}
          placeholder="Select category..."
          label="Dynamic Options"
          helperText={`${availableOptions.length} options available`}
        />

        <div className="flex space-x-2">
          <button
            type="button"
            onClick={addRandomOption}
            className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            Add Option
          </button>
          <button
            type="button"
            onClick={removeLastOption}
            disabled={availableOptions.length <= categories.length}
            className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Remove Option
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dynamic options that can be added or removed at runtime. Demonstrates how the component handles changing option lists.",
      },
    },
  },
};

// ============================================================================
// THEME EXAMPLES
// ============================================================================

export const DarkMode: Story = {
  args: {
    options: fruits,
    placeholder: "Select in dark mode...",
    label: "Dark Mode Example",
    helperText: "Optimized for dark theme with proper contrast",
  },
  decorators: [
    (Story) => (
      <div
        className="bg-gray-900 p-6 rounded-lg dark"
        data-theme="dark"
        style={{ width: "400px", minHeight: "500px" }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Dark mode variant with proper contrast ratios and themed styling.",
      },
    },
  },
};

export const DarkModeMultiSelect: Story = {
  render: () => {
    const [selectedCountries, setSelectedCountries] = useState<Option[]>([
      countries[1], // Canada
      countries[3], // Germany
    ]);

    return (
      <div
        className="bg-gray-900 p-6 rounded-lg dark"
        data-theme="dark"
        style={{ width: "400px", minHeight: "500px" }}
      >
        <InputDropdown
          options={countries}
          multiple={true}
          value={selectedCountries}
          onChange={(value) => setSelectedCountries(value as Option[])}
          placeholder="Multi-select in dark mode..."
          label="Dark Mode Multi-Select"
          helperText="Multi-select with dark theme styling"
        />
      </div>
    );
  },
  parameters: {
    backgrounds: { default: "dark" },
    docs: {
      description: {
        story:
          "Multi-select in dark mode showing tag styling and interactions.",
      },
    },
  },
};

export const ThemeComparison: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Light Theme Container - No ThemeProvider needed */}
      <div className="bg-white p-6 rounded-lg border" data-theme="light">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Light Mode</h3>
        <InputDropdown
          options={categories}
          placeholder="Light theme..."
          label="Light Mode Dropdown"
          helperText="Default light theme styling"
        />
      </div>

      {/* Dark Theme Container - No ThemeProvider needed */}
      <div
        className="bg-gray-900 p-6 rounded-lg border border-gray-700 dark"
        data-theme="dark"
      >
        <h3 className="text-lg font-semibold mb-4 text-gray-100">Dark Mode</h3>
        <InputDropdown
          options={categories}
          placeholder="Dark theme..."
          label="Dark Mode Dropdown"
          helperText="Dark theme with proper contrast"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Side-by-side comparison of light and dark theme variants with isolated styling.",
      },
    },
  },
};

// ============================================================================
// EDGE CASES & SPECIAL SCENARIOS
// ============================================================================

export const EmptyOptions: Story = {
  args: {
    options: [],
    placeholder: "No options available...",
    label: "Empty Options",
    helperText: "Dropdown with no available options",
    emptyMessage: "No options to display",
  },
  parameters: {
    docs: {
      description: {
        story: "Handling empty option lists with custom empty state messaging.",
      },
    },
  },
};

export const DisabledOptions: Story = {
  args: {
    options: [
      { label: "Available Option 1", value: "opt1" },
      { label: "Disabled Option", value: "opt2", disabled: true },
      { label: "Available Option 2", value: "opt3" },
      { label: "Another Disabled", value: "opt4", disabled: true },
      { label: "Available Option 3", value: "opt5" },
    ],
    placeholder: "Some options are disabled...",
    label: "Mixed Availability",
    helperText: "Some options are disabled and cannot be selected",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Dropdown with a mix of enabled and disabled options showing proper visual feedback.",
      },
    },
  },
};

export const LongLabels: Story = {
  args: {
    options: [
      {
        label:
          "This is a very long option label that might overflow in some layouts and needs proper handling",
        value: "long1",
        description:
          "This is also a very long description that provides additional context about this particular option",
      },
      {
        label:
          "Another extremely long option that tests text truncation and wrapping behavior",
        value: "long2",
        description:
          "Extended description to test how the component handles lengthy descriptive text",
      },
      {
        label: "Short",
        value: "short",
        description: "Brief description",
      },
      {
        label:
          "Medium length option that falls between short and very long labels",
        value: "medium",
      },
    ],
    placeholder: "Options with varying label lengths...",
    label: "Long Labels Test",
    helperText: "Testing text overflow and truncation behavior",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Testing how the component handles options with varying label lengths and text overflow scenarios.",
      },
    },
  },
};

// ============================================================================
// ACCESSIBILITY TESTING
// ============================================================================

export const AccessibilityShowcase: Story = {
  args: {
    options: categories,
    placeholder: "Use keyboard to navigate...",
    label: "Accessibility Test",
    helperText: "Try using Tab, Arrow keys, Enter, Escape, Home, End",
    required: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
**Keyboard Navigation Test:**
- **Tab**: Focus the dropdown
- **Enter/Space/Arrow Keys**: Open dropdown
- **Up/Down Arrows**: Navigate options
- **Home/End**: Jump to first/last option
- **Enter/Space**: Select highlighted option
- **Escape**: Close dropdown
- **Tab**: Navigate away from component

The component also provides screen reader announcements and proper ARIA attributes.
        `,
      },
    },
  },
};
