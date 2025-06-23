# Component Template for Luxora UI

This document provides a template and guidelines for creating new components in the Luxora UI library.

## Folder Structure

Each component should have its own folder with the following structure:

```
src/components/ComponentName/
├── ComponentName.tsx          # Main component file
├── ComponentName.test.tsx     # Component tests
├── ComponentName.stories.tsx  # Storybook stories
├── index.ts                   # Component exports
└── README.md                  # Component documentation (optional)
```

## Component Template

```tsx
// ============================================================================
// COMPONENT NAME COMPONENT
// ============================================================================

import React, { forwardRef } from 'react';
import { cn } from '../../shared/utils';
import type { BaseComponentProps, Size, ColorVariant } from '../../shared/types';

export interface ComponentNameProps extends BaseComponentProps {
  /** Component size variant */
  size?: Size;
  
  /** Color variant */
  variant?: ColorVariant;
  
  /** Disable the component */
  disabled?: boolean;
  
  /** Children content */
  children?: React.ReactNode;
  
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

/**
 * ComponentName - Brief description of what the component does
 * 
 * @example
 * ```tsx
 * <ComponentName size="md" variant="primary">
 *   Content
 * </ComponentName>
 * ```
 */
export const ComponentName = forwardRef<HTMLElement, ComponentNameProps>(({
  size = 'md',
  variant = 'primary',
  disabled = false,
  children,
  onClick,
  className,
  id,
  'data-testid': dataTestId,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Base styles
        'inline-flex items-center justify-center',
        'font-medium transition-all duration-200',
        
        // Size variants
        {
          'px-2 py-1 text-sm': size === 'sm',
          'px-3 py-2 text-base': size === 'md',
          'px-4 py-3 text-lg': size === 'lg',
        },
        
        // Color variants
        {
          'bg-luxora-500 text-white hover:bg-luxora-600': variant === 'primary' && !disabled,
          'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary' && !disabled,
          // Add more variants...
        },
        
        // States
        {
          'opacity-50 cursor-not-allowed': disabled,
          'cursor-pointer': !disabled && onClick,
        },
        
        className
      )}
      onClick={disabled ? undefined : onClick}
      id={id}
      data-testid={dataTestId}
      {...props}
    >
      {children}
    </div>
  );
});

ComponentName.displayName = 'ComponentName';
```

## Index File Template

```tsx
// ============================================================================
// COMPONENT NAME EXPORTS
// ============================================================================

export { ComponentName } from './ComponentName';
export type { ComponentNameProps } from './ComponentName';
```

## Test Template

```tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName>Test Content</ComponentName>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<ComponentName onClick={handleClick}>Click me</ComponentName>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies size variants correctly', () => {
    render(<ComponentName size="lg" data-testid="component">Content</ComponentName>);
    expect(screen.getByTestId('component')).toHaveClass('px-4', 'py-3', 'text-lg');
  });

  it('handles disabled state', () => {
    const handleClick = vi.fn();
    render(<ComponentName disabled onClick={handleClick}>Disabled</ComponentName>);
    
    fireEvent.click(screen.getByText('Disabled'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

## Storybook Template

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { ComponentName } from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  title: 'Components/ComponentName',
  component: ComponentName,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'error'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

export const Default: Story = {
  args: {
    children: 'Component Name',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <ComponentName variant="primary">Primary</ComponentName>
      <ComponentName variant="secondary">Secondary</ComponentName>
      <ComponentName variant="success">Success</ComponentName>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <ComponentName>Default</ComponentName>
      <ComponentName disabled>Disabled</ComponentName>
    </div>
  ),
};
```

## Guidelines

### 1. Component Design Principles
- **Composable**: Components should be easily composable with other components
- **Accessible**: Follow WCAG guidelines and use proper ARIA attributes
- **Consistent**: Use the design system tokens from `src/theme/`
- **Flexible**: Support customization through props and className overrides

### 2. Props Interface
- Extend `BaseComponentProps` for common props
- Use clear, descriptive prop names
- Provide sensible defaults
- Add JSDoc comments for all props

### 3. Styling
- Use TailwindCSS utility classes
- Leverage the design system from `src/theme/`
- Support size and variant props
- Use the `cn()` utility for conditional classes

### 4. Testing
- Test all props and variants
- Test user interactions
- Test accessibility features
- Aim for high test coverage

### 5. Documentation
- Write clear JSDoc comments
- Create comprehensive Storybook stories
- Provide usage examples
- Document any complex behavior

### 6. Accessibility
- Use semantic HTML elements
- Include proper ARIA attributes
- Support keyboard navigation
- Test with screen readers

### 7. Performance
- Use `React.forwardRef` when needed
- Memoize expensive calculations
- Avoid unnecessary re-renders
- Keep bundle size minimal

## Adding to the Library

1. Create the component folder and files
2. Add the component export to `src/components/index.ts`
3. Update the main library exports if needed
4. Add Storybook stories
5. Write comprehensive tests
6. Update documentation 