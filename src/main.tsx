import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { InputDropdown } from "./components/InputDropdown";
import type { Option } from "./shared/types";
import "./styles/index.css";

const fruits: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Date", value: "date" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fig", value: "fig" },
  { label: "Grape", value: "grape" },
  { label: "Honeydew", value: "honeydew" },
];

const countries: Option[] = [
  { label: "United States", value: "us" },
  { label: "Canada", value: "ca" },
  { label: "United Kingdom", value: "uk" },
  { label: "Germany", value: "de" },
  { label: "France", value: "fr" },
  { label: "Japan", value: "jp" },
  { label: "Australia", value: "au" },
];

function App() {
  const [singleValue, setSingleValue] = useState<Option | undefined>();
  const [multiValue, setMultiValue] = useState<Option[]>([]);
  const [controlledValue, setControlledValue] = useState<Option | undefined>();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Luxora UI - InputDropdown
          </h1>
          <p className="text-lg text-gray-600">
            Elegant, searchable, and accessible dropdown component
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Single Select */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Single Select
            </h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Choose a fruit:
              </label>
              <InputDropdown
                options={fruits}
                value={singleValue}
                onChange={(val) => setSingleValue(val as Option)}
                placeholder="Select a fruit..."
              />
              {singleValue && (
                <p className="text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">{singleValue.label}</span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Non-searchable:
              </label>
              <InputDropdown
                options={countries.slice(0, 4)}
                searchable={false}
                placeholder="Select a country..."
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Disabled:
              </label>
              <InputDropdown
                options={fruits}
                disabled
                placeholder="This is disabled..."
              />
            </div>
          </div>

          {/* Multi Select */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Multi Select
            </h2>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Choose multiple fruits:
              </label>
              <InputDropdown
                options={fruits}
                value={multiValue}
                onChange={(val) => setMultiValue(val as Option[])}
                multiple
                placeholder="Select fruits..."
              />
              {multiValue.length > 0 && (
                <p className="text-sm text-gray-600">
                  Selected:{" "}
                  <span className="font-medium">
                    {multiValue.map((v) => v.label).join(", ")}
                  </span>
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Custom render option:
              </label>
              <InputDropdown
                options={countries}
                multiple
                placeholder="Select countries..."
                renderOption={(option) => (
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-4 bg-gray-200 rounded flex-shrink-0" />
                    <span>{option.label}</span>
                    <span className="text-xs text-gray-500 ml-auto">
                      ({option.value.toUpperCase()})
                    </span>
                  </div>
                )}
              />
            </div>
          </div>

          {/* Controlled Examples */}
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Controlled Component
            </h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Controlled input:
                </label>
                <InputDropdown
                  options={fruits}
                  value={controlledValue}
                  onChange={(val) => setControlledValue(val as Option)}
                  placeholder="Controlled selection..."
                />
              </div>

              <div className="flex-1 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  External controls:
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setControlledValue(fruits[0])}
                    className="px-3 py-1 text-sm bg-luxora-500 text-white rounded hover:bg-luxora-600 transition-colors mr-2"
                  >
                    Set Apple
                  </button>
                  <button
                    onClick={() => setControlledValue(fruits[2])}
                    className="px-3 py-1 text-sm bg-luxora-500 text-white rounded hover:bg-luxora-600 transition-colors mr-2"
                  >
                    Set Cherry
                  </button>
                  <button
                    onClick={() => setControlledValue(undefined)}
                    className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 border-t pt-8">
          <p>
            Features: Searchable • Keyboard Navigation • Single/Multi Select •
            Clearable • Accessible
          </p>
          <p className="mt-2">
            Try typing to search, use arrow keys to navigate, Enter to select,
            Escape to close
          </p>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
