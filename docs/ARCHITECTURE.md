# Luxora UI - Architecture & Structure

This document outlines the architecture and file structure of the Luxora UI component library, designed for scalability and maintainability.

## 📁 Project Structure

```
luxora-ui/
├── 📁 src/
│   ├── 📁 components/           # All UI components
│   │   ├── 📁 InputDropdown/    # Individual component folders
│   │   │   ├── InputDropdown.tsx
│   │   │   ├── InputDropdown.test.tsx
│   │   │   └── index.ts
│   │   ├── COMPONENT_TEMPLATE.md # Template for new components
│   │   └── index.ts             # Export all components
│   │
│   ├── 📁 shared/               # Shared utilities across components
│   │   ├── 📁 hooks/           # Reusable React hooks
│   │   │   └── index.ts
│   │   ├── 📁 types/           # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── 📁 utils/           # Utility functions
│   │       └── index.ts
│   │
│   ├── 📁 theme/               # Design system & theme tokens
│   │   └── index.ts
│   │
│   ├── 📁 styles/              # Global styles & CSS
│   │   └── index.css
│   │
│   ├── 📁 test/                # Test configuration
│   │   └── setup.ts
│   │
│   ├── main.tsx                # Demo app entry point
│   └── index.ts                # Main library export
│
├── 📁 stories/                 # Storybook stories
│   └── InputDropdown.stories.tsx
│
├── 📁 examples/                # Usage examples
│   └── basic-usage.tsx
│
├── 📁 .storybook/              # Storybook configuration
│   ├── main.ts
│   └── preview.ts
│
├── 📁 dist/                    # Built library output
│   ├── index.es.js             # ES Module bundle
│   ├── index.cjs.js            # CommonJS bundle
│   ├── index.d.ts              # TypeScript declarations
│   └── style.css               # Compiled CSS
│
├── package.json                # Package configuration
├── vite.config.ts              # Vite build configuration
├── tailwind.config.js          # TailwindCSS configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Testing configuration
└── README.md                   # Project documentation
```

## 🏗️ Architecture Principles

### 1. **Component-First Organization**
- Each component lives in its own folder
- Self-contained with tests, stories, and exports
- Clear separation of concerns

### 2. **Shared Resources**
- Common utilities, hooks, and types in `shared/`
- Centralized theme and design system
- Reusable across all components

### 3. **Design System Foundation**
- Centralized theme tokens in `src/theme/`
- Consistent color palette, spacing, typography
- TailwindCSS integration for utility-first styling

### 4. **Build System**
- Vite for fast development and optimized builds
- Dual format output (ES modules + CommonJS)
- TypeScript declarations auto-generated
- Tree-shakeable exports

## 📦 Component Structure

Each component follows a consistent structure:

```
ComponentName/
├── ComponentName.tsx          # Main component implementation
├── ComponentName.test.tsx     # Comprehensive test suite
├── ComponentName.stories.tsx  # Storybook documentation (optional)
└── index.ts                   # Clean exports
```

### Component Implementation Pattern

```tsx
// 1. Import shared utilities and types
import { cn } from '../../shared/utils';
import type { BaseComponentProps } from '../../shared/types';

// 2. Define component-specific props interface
export interface ComponentProps extends BaseComponentProps {
  // Component-specific props
}

// 3. Component implementation with JSDoc
/**
 * Component description and usage example
 */
export const Component: React.FC<ComponentProps> = ({
  // Props with defaults
}) => {
  // Component logic
  return (
    // JSX with conditional styling
  );
};
```

## 🎨 Design System

### Color Palette
- **Primary**: Luxora blue (`luxora-*`)
- **Semantic**: Success, warning, error colors
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (sans-serif), Fira Code (monospace)
- **Scale**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Weights**: normal, medium, semibold, bold

### Spacing & Sizing
- **Scale**: 4px base unit (0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32)
- **Component Sizes**: sm, md, lg with consistent sizing

### Shadows & Effects
- **Standard**: sm, md, lg, xl shadows
- **Luxora Glow**: Brand-specific glowing effects
- **Animations**: Fade in, slide down transitions

## 🔧 Development Workflow

### Adding New Components

1. **Create Component Folder**
   ```bash
   mkdir src/components/NewComponent
   ```

2. **Use Component Template**
   - Copy from `src/components/COMPONENT_TEMPLATE.md`
   - Implement component logic
   - Add comprehensive tests

3. **Export Component**
   ```tsx
   // src/components/NewComponent/index.ts
   export { NewComponent } from './NewComponent';
   export type { NewComponentProps } from './NewComponent';
   ```

4. **Add to Main Export**
   ```tsx
   // src/components/index.ts
   export * from './NewComponent';
   ```

5. **Create Storybook Stories**
   - Document all variants and states
   - Provide usage examples

### Testing Strategy

- **Unit Tests**: Test component behavior and props
- **Integration Tests**: Test component interactions
- **Accessibility Tests**: Ensure WCAG compliance
- **Visual Tests**: Storybook for visual regression

### Build & Release

```bash
# Development
pnpm dev          # Start demo app
pnpm storybook    # Start Storybook

# Testing
pnpm test         # Run test suite
pnpm test:ui      # Run tests with UI

# Building
pnpm build        # Build library for production
pnpm preview      # Preview built library
```

## 🎯 Benefits of This Structure

### 1. **Scalability**
- Easy to add new components
- Clear separation of concerns
- Consistent patterns across codebase

### 2. **Maintainability**
- Each component is self-contained
- Shared utilities reduce duplication
- Centralized design system

### 3. **Developer Experience**
- TypeScript for full type safety
- Comprehensive documentation
- Hot reloading and fast builds

### 4. **Bundle Optimization**
- Tree-shakeable exports
- Component-level code splitting
- Minimal runtime dependencies

### 5. **Testing & Quality**
- Component-level test files
- Comprehensive coverage
- Automated testing pipeline

## 🚀 Future Enhancements

### Planned Components
- **Form Components**: Button, Input, Select, Checkbox, RadioGroup, Switch
- **Layout Components**: Card, Modal, Drawer, Accordion, Tabs
- **Feedback Components**: Alert, Toast, Progress, Spinner
- **Navigation Components**: Breadcrumb, Pagination, Menu
- **Data Display**: Table, List, Badge, Avatar, Tooltip

### Planned Features
- **Theme Customization**: Runtime theme switching
- **Icon System**: Comprehensive icon library
- **Animation System**: Advanced motion components
- **Accessibility**: Enhanced ARIA support and keyboard navigation
- **Internationalization**: Multi-language support

## 📚 Documentation

- **Component API**: Auto-generated from TypeScript interfaces
- **Storybook**: Interactive component documentation
- **Usage Examples**: Real-world implementation examples
- **Migration Guides**: Version upgrade instructions

This architecture ensures the Luxora UI library can grow from a single component to a comprehensive design system while maintaining code quality, performance, and developer experience. 