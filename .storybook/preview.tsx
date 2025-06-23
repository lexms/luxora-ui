import type { Preview } from "@storybook/react";
import React from "react";
import { ThemeProvider } from "../src/shared/context/ThemeContext";
import "../src/styles/index.css";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#1f2937",
        },
        {
          name: "luxora",
          value: "#f0f9ff",
        },
      ],
    },
  },
  // Add global decorator to wrap all stories with ThemeProvider in light mode
  decorators: [
    (Story) => (
      <ThemeProvider defaultMode="light">
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
