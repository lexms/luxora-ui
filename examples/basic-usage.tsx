import type { Option } from "luxora-ui";
import { InputDropdown } from "luxora-ui";
import { useState } from "react";

// Sample data
const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
];

const countries: Option[] = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
];

export function BasicUsageExample() {
  const [selectedFruit, setSelectedFruit] = useState<Option | undefined>();
  const [selectedCountries, setSelectedCountries] = useState<Option[]>([]);

  return (
    <div className="space-y-6 p-6 max-w-md">
      <h2 className="text-xl font-bold">InputDropdown Examples</h2>

      {/* Single Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select a fruit (Single Select)
        </label>
        <InputDropdown
          options={fruits}
          value={selectedFruit}
          onChange={(value) => setSelectedFruit(value as Option)}
          placeholder="Choose a fruit..."
        />
        {selectedFruit && (
          <p className="text-sm text-gray-600">
            Selected: {selectedFruit.label}
          </p>
        )}
      </div>

      {/* Multi Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select countries (Multi Select)
        </label>
        <InputDropdown
          options={countries}
          value={selectedCountries}
          onChange={(value) => setSelectedCountries(value as Option[])}
          multiple
          placeholder="Choose countries..."
        />
        {selectedCountries.length > 0 && (
          <p className="text-sm text-gray-600">
            Selected: {selectedCountries.map((c) => c.label).join(", ")}
          </p>
        )}
      </div>

      {/* Non-searchable */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Select a country (Non-searchable)
        </label>
        <InputDropdown
          options={countries.slice(0, 3)}
          searchable={false}
          placeholder="Choose a country..."
        />
      </div>

      {/* Custom render */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Countries with custom rendering
        </label>
        <InputDropdown
          options={countries}
          renderOption={(option) => (
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              <span className="text-xs text-gray-500">
                {option.value.toUpperCase()}
              </span>
            </div>
          )}
          placeholder="Choose a country..."
        />
      </div>
    </div>
  );
}
