# BillReportsSummary Component

A highly dynamic and reusable summary statistics component that displays key metrics in a beautiful card layout.

## Features

- 🎨 **Fully Customizable**: Configure colors, icons, formatting, and layout
- 📱 **Responsive**: Adapts to different screen sizes with configurable grid layouts
- 🌙 **Dark Mode Support**: Built-in dark mode styling
- 🌍 **Internationalization**: Supports i18n translations
- ♻️ **Reusable**: Use for any type of summary data (bills, customers, projects, etc.)
- 🎯 **Type Safe**: Clear prop structure for easy integration

## Basic Usage

```jsx
import BillReportsSummary from './BillReportsSummary';

// Simple usage with default bill summary
const MyComponent = () => {
  const summaryData = {
    total_bills: 1250,
    total_amount: 15000000,
    total_paid_amount: 12000000,
    total_partial_amount: 2000000,
    total_unpaid_amount: 1000000
  };

  return <BillReportsSummary summary={summaryData} />;
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `summary` | `object` | - | Data object containing the summary values |
| `title` | `string` | `"Bill Summary Statistics"` | Title displayed in the header |
| `showLastUpdated` | `boolean` | `true` | Whether to show the last updated timestamp |
| `customItems` | `array` | `null` | Custom configuration for summary items |
| `gridCols` | `string` | `"grid-cols-2 md:grid-cols-3 lg:grid-cols-5"` | CSS grid classes for responsive layout |
| `className` | `string` | `""` | Additional CSS classes for the grid container |
| `cardClassName` | `string` | `""` | Additional CSS classes for the main card |

## Localization Support

The component fully supports internationalization (i18n) with the following features:

### Translation Keys
All labels in the component are automatically translated using the `useTranslation` hook. The following translation keys are available:

**Default Bill Summary:**
- `"Bill Summary Statistics"` - Main title
- `"Last Updated"` - Last updated timestamp
- `"Total Bills"` - Total bills count
- `"Total Amount"` - Total amount
- `"Total Paid"` - Total paid amount
- `"Total Partial"` - Total partial amount
- `"Total Unpaid"` - Total unpaid amount

**Common Summary Items:**
- `"Total Customers"`, `"Active Customers"`, `"New This Month"`, `"Premium Customers"`
- `"Total Projects"`, `"Completed"`, `"In Progress"`, `"Total Revenue"`
- `"Total Users"`, `"Active Users"`, `"New Users"`
- `"Total Employees"`, `"Active Employees"`, `"On Leave"`
- `"Total Tickets"`, `"Open Tickets"`, `"Closed Tickets"`
- `"Total Services"`, `"Active Services"`, `"Inactive Services"`
- `"Total Units"`, `"Occupied Units"`, `"Vacant Units"`
- `"Total Payments"`, `"Successful Payments"`, `"Failed Payments"`
- `"Total Expenses"`, `"Monthly Expenses"`, `"Annual Expenses"`
- `"Total Income"`, `"Monthly Income"`, `"Annual Income"`

### Adding New Translation Keys

To add new translation keys, update both language files:

**English (`src/locales/translation/en.json`):**
```json
{
  "Your New Label": "Your New Label"
}
```

**Arabic (`src/locales/translation/ar.json`):**
```json
{
  "Your New Label": "التسمية الجديدة"
}
```

### Using the Utility Function

For better localization support, use the `createLocalizedSummaryItems` utility function:

```jsx
import { createLocalizedSummaryItems } from './BillReportsSummary';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  const customItems = createLocalizedSummaryItems([
    {
      key: "total_customers",
      label: "Total Customers", // This will be automatically translated
      value: 450,
      color: "blue",
      icon: <YourIcon />,
      formatValue: (value) => value.toLocaleString(),
      valueColor: "text-slate-900 dark:text-slate-100"
    }
  ], t);
  
  return <BillReportsSummary customItems={customItems} />;
};
```

## Custom Items Configuration

You can create custom summary items by passing a `customItems` array:

```jsx
const customItems = [
  {
    key: "total_customers",           // Unique identifier
    label: "Total Customers",         // Display label (will be translated)
    value: 450,                      // Numeric value
    color: "blue",                   // Color theme (see color options below)
    icon: <YourIconComponent />,     // React component for the icon
    formatValue: (value) => value.toLocaleString(), // Custom formatting function
    valueColor: "text-slate-900 dark:text-slate-100" // Custom text color classes
  }
];
```

### Available Colors

The component supports these predefined color themes:
- `blue` - Blue theme
- `green` - Green theme  
- `emerald` - Emerald theme
- `amber` - Amber theme
- `red` - Red theme
- `purple` - Purple theme
- `indigo` - Indigo theme
- `pink` - Pink theme
- `gray` - Gray theme

## Examples

### 1. Default Bill Summary
```jsx
<BillReportsSummary summary={billData} />
```

### 2. Custom Customer Summary
```jsx
<BillReportsSummary 
  summary={customerData}
  title="Customer Summary Statistics"
  customItems={customerSummaryItems}
  gridCols="grid-cols-2 md:grid-cols-4"
/>
```

### 3. Project Summary with Different Layout
```jsx
<BillReportsSummary 
  summary={projectData}
  title="Project Overview"
  customItems={projectSummaryItems}
  gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
  showLastUpdated={false}
/>
```

### 4. Compact Layout
```jsx
<BillReportsSummary 
  summary={data}
  title="Quick Overview"
  gridCols="grid-cols-2"
  className="max-w-2xl"
  cardClassName="shadow-lg"
/>
```

### 5. Custom Styling
```jsx
<BillReportsSummary 
  summary={data}
  title="Enhanced Dashboard"
  customItems={customItems}
  gridCols="grid-cols-1 md:grid-cols-3"
  className="max-w-4xl mx-auto"
  cardClassName="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
/>
```

## Custom Item Structure

Each custom item should have the following structure:

```jsx
{
  key: string,                    // Unique identifier for the item
  label: string,                  // Display label (will be translated via i18n)
  value: number,                  // Numeric value to display
  color: string,                  // Color theme from available options
  icon: ReactNode,               // SVG or React component for the icon
  formatValue: (value: number) => string, // Function to format the value
  valueColor?: string            // Optional custom text color classes
}
```

## Formatting Functions

You can create custom formatting functions for different data types:

```jsx
// Currency formatting
formatValue: (value) => new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(value)

// Number formatting with commas
formatValue: (value) => value.toLocaleString()

// Percentage formatting
formatValue: (value) => `${value}%`

// Custom formatting
formatValue: (value) => `${value.toLocaleString()} users`
```

## Grid Layout Options

Common grid layout configurations:

```jsx
// 2 columns (mobile), 3 columns (tablet), 5 columns (desktop) - Default
gridCols="grid-cols-2 md:grid-cols-3 lg:grid-cols-5"

// 2 columns (mobile), 4 columns (tablet+)
gridCols="grid-cols-2 md:grid-cols-4"

// 1 column (mobile), 3 columns (tablet+)
gridCols="grid-cols-1 md:grid-cols-3"

// Always 2 columns
gridCols="grid-cols-2"

// Always 4 columns
gridCols="grid-cols-4"
```

## Integration Tips

1. **Data Structure**: Ensure your summary data object has keys that match your custom items or the default bill summary keys.

2. **Translation Keys**: Make sure your translation files include the labels used in your custom items.

3. **Icons**: Use consistent icon styling. The component expects icons to be SVG elements with `className="w-5 h-5"`.

4. **Responsive Design**: Test your grid layouts on different screen sizes to ensure optimal display.

5. **Performance**: For large datasets, consider memoizing the custom items array to prevent unnecessary re-renders.

## Migration from Static Component

If you're migrating from the old static component:

1. Replace the hardcoded summary cards with the new dynamic component
2. Pass your existing summary data as the `summary` prop
3. Optionally customize the appearance using the available props
4. For completely custom layouts, use the `customItems` prop

The new component maintains backward compatibility while providing much more flexibility and reusability. 