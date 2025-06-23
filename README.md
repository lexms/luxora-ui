# Luxora UI

[![NPM Version](https://img.shields.io/npm/v/luxora-ui.svg)](https://www.npmjs.com/package/luxora-ui)
[![License](https://img.shields.io/npm/l/luxora-ui.svg)](LICENSE)

A modern React component library designed for elegance and developer experience, built with TypeScript and TailwindCSS.

## Features

- 🎨 **Elegant Design** - Beautiful, minimal components with thoughtful design details
- ♿ **Accessibility First** - Full keyboard navigation and screen reader support
- 🎯 **TypeScript Native** - Complete type safety and IntelliSense support
- 🎨 **TailwindCSS Powered** - Utility-first styling with customizable themes
- 📱 **Responsive by Default** - Mobile-friendly components out of the box
- 🔧 **Highly Customizable** - Override styles and behavior with ease
- ⚡ **Modern Tooling** - Built with React 18, Vite, and modern best practices
- 🌙 **Theme Support** - Built-in dark and light mode support

## Installation

```bash
# Using pnpm (recommended)
pnpm add luxora-ui

# Using npm
npm install luxora-ui

# Using yarn
yarn add luxora-ui
```

## Quick Start

Import components and styles in your app:

```tsx
import { InputDropdown } from 'luxora-ui';
import 'luxora-ui/styles';

function App() {
  return (
    <div className="p-8">
      <InputDropdown
        options={[
          { label: 'React', value: 'react' },
          { label: 'Vue', value: 'vue' },
          { label: 'Angular', value: 'angular' },
        ]}
        placeholder="Choose a framework..."
      />
    </div>
  );
}
```

## Design Principles

### Accessibility First
All components follow WAI-ARIA guidelines and support:
- Full keyboard navigation
- Screen reader compatibility
- Focus management
- ARIA attributes and roles

### Developer Experience
- **TypeScript Support**: Full type definitions included
- **Tree Shaking**: Import only what you need
- **Ref Forwarding**: Access underlying DOM elements
- **Controlled & Uncontrolled**: Flexible state management patterns

### Customization
- **CSS Classes**: Override styles with `className` and component-specific class props
- **Render Props**: Customize complex rendering with `renderOption`, `renderTrigger`, etc.
- **Theme Variables**: Use CSS variables for consistent theming
- **Slot-based Design**: Style individual parts of complex components

## Components

### InputDropdown
A comprehensive dropdown component with search, selection, and accessibility features.

```tsx
<InputDropdown
  options={options}
  multiple
  searchable
  placeholder="Select options..."
  onChange={(value) => console.log(value)}
/>
```

**Key Features:**
- Single and multi-select modes
- Built-in search and filtering
- Keyboard navigation
- Custom option rendering
- Clearable selections

*More components coming soon...*

## Styling & Theming

Luxora UI uses a custom color palette optimized for accessibility and visual appeal:

```css
colors: {
  luxora: {
    50: '#f0f9ff',   // Lightest
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',  // Primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',  // Darkest
  },
}
```

### Custom Styling

Override component styles using Tailwind classes:

```tsx
<InputDropdown
  className="border-purple-300 focus:ring-purple-200"
  options={options}
/>
```

### Dark Mode Support

Components automatically adapt to dark mode when using the `dark` class or `data-theme="dark"`:

```tsx
<div className="dark">
  <InputDropdown options={options} />
</div>
```

## TypeScript Support

Luxora UI is built with TypeScript and provides comprehensive type definitions:

```tsx
import type { Option } from 'luxora-ui';

const options: Option[] = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build library
pnpm build

# Check code quality
pnpm check:fix
```

## Contributing

We welcome contributions! Please see our [contribution guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT © [Your Name](LICENSE)