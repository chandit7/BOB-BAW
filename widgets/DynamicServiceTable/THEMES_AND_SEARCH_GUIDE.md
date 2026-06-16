# DynamicServiceTable - Themes and Search Guide

## Overview

The DynamicServiceTable widget now supports **configurable visual themes** and **client-side search functionality**, providing enhanced user experience and visual customization options.

## Features Added

### 1. Theme System
- **Default Theme**: Clean Carbon Design System styling with gray backgrounds
- **Modern Theme**: DynamicReportGrid-inspired with navy blue headers and enhanced visual hierarchy

### 2. Client-Side Search
- Real-time filtering across all columns
- Search-as-you-type functionality
- Visual feedback for filtered results
- Keyboard shortcuts (ESC to clear)

---

## Theme Configuration

### Available Themes

#### Default Theme (`styleTheme: "default"`)
- **Design System**: IBM Carbon Design System
- **Header Color**: Gray (#f4f4f4)
- **Text Color**: Dark gray (#161616)
- **Accent Color**: IBM Blue (#0f62fe)
- **Use Case**: Professional, corporate applications requiring Carbon consistency

#### Modern Theme (`styleTheme: "modern"`)
- **Design System**: DynamicReportGrid-inspired
- **Header Color**: Deep Navy (#0f3460)
- **Text Color**: Dark blue-gray (#1a1f36)
- **Accent Color**: Bright Blue (#2e86de)
- **Use Case**: Modern dashboards, reports, and data-heavy interfaces

### How to Configure Theme

In your BAW Coach, set the `styleTheme` configuration option:

```javascript
// In BAW Designer - Widget Configuration
styleTheme: "default"  // or "modern"
```

Or dynamically in a Script Node:

```javascript
// Set theme dynamically
tw.local.widgetConfig = {
    styleTheme: "modern",  // Switch to modern theme
    title: "Employee Dashboard",
    showRefresh: true,
    enableSearch: true
};
```

### Theme Comparison

| Feature | Default Theme | Modern Theme |
|---------|--------------|--------------|
| Header Background | Light Gray (#f4f4f4) | Deep Navy (#0f3460) |
| Header Text | Dark Gray (#161616) | White (#ffffff) |
| Row Hover | Light Blue (#e5f6ff) | Light Blue (#eef3fb) |
| Alternating Rows | White / Light Gray | White / Very Light Blue |
| Badges | Carbon colors | Enhanced contrast colors |
| Search Input | Carbon style | Modern with navy accents |
| Overall Feel | Corporate, Clean | Modern, Bold |

---

## Search Functionality

### Enabling Search

Set the `enableSearch` configuration option:

```javascript
// In BAW Designer - Widget Configuration
enableSearch: true  // Default is true
```

### How Search Works

1. **Real-Time Filtering**: As you type, the table filters rows instantly
2. **Multi-Column Search**: Searches across ALL columns in the table
3. **Case-Insensitive**: Search is not case-sensitive
4. **Partial Matching**: Finds partial matches anywhere in the text

### Search Features

#### Visual Feedback
- Record count shows "X of Y (filtered)" when search is active
- Empty state shows "No results found for 'search term'"
- Search input highlights when focused

#### Keyboard Shortcuts
- **ESC**: Clear search and show all data
- **Enter**: No action (search happens as you type)

#### Search Behavior
- Searches across all column types (text, numbers, dates, badges, etc.)
- Converts all values to strings for searching
- Handles null/undefined values gracefully

### Search Examples

#### Example 1: Search by Name
```
User types: "john"
Results: All rows where ANY column contains "john" (case-insensitive)
- John Doe
- Johnny Smith
- johnson@example.com
```

#### Example 2: Search by Status
```
User types: "active"
Results: All rows where ANY column contains "active"
- Status: Active
- Description: "Currently active in system"
```

#### Example 3: Search by Number
```
User types: "1234"
Results: All rows where ANY column contains "1234"
- ID: 1234
- Amount: $1,234.56
- Phone: (123) 456-7890
```

---

## Complete Configuration Example

### BAW Script Node Example

```javascript
// Build table data with theme and search configuration
var tableData = {
    columns: [
        {
            field: "empId",
            header: "Employee ID",
            sortable: true,
            width: "120px",
            align: "center",
            type: "number"
        },
        {
            field: "name",
            header: "Name",
            sortable: true,
            type: "text"
        },
        {
            field: "department",
            header: "Department",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Engineering": { label: "Engineering", color: "blue" },
                "Sales": { label: "Sales", color: "green" },
                "HR": { label: "HR", color: "yellow" }
            })
        },
        {
            field: "salary",
            header: "Salary",
            sortable: true,
            align: "right",
            type: "currency"
        },
        {
            field: "status",
            header: "Status",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Active": { label: "Active", color: "green" },
                "Inactive": { label: "Inactive", color: "gray" }
            })
        }
    ],
    data: [
        {
            empId: 1001,
            name: "John Doe",
            department: "Engineering",
            salary: 85000,
            status: "Active"
        },
        {
            empId: 1002,
            name: "Jane Smith",
            department: "Sales",
            salary: 75000,
            status: "Active"
        },
        {
            empId: 1003,
            name: "Bob Johnson",
            department: "HR",
            salary: 65000,
            status: "Inactive"
        }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 3
    }
};

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);
```

### BAW Coach Configuration

In the widget properties:

```javascript
// Configuration Options
title: "Employee Dashboard"
styleTheme: "modern"           // Use modern theme
enableSearch: true             // Enable search
showRefresh: true              // Show refresh button
showRecordCount: true          // Show record count
enableRowSelection: true       // Enable row selection
pageSize: 100                  // Rows per page
```

---

## Theme Customization

### CSS Variables (Advanced)

Both themes use CSS variables that can be overridden:

#### Default Theme Variables
```css
.theme-default {
    --dt-primary: #0f62fe;
    --dt-surface: #ffffff;
    --dt-background: #f4f4f4;
    --dt-border: #e0e0e0;
    --dt-text: #161616;
    --dt-text-secondary: #525252;
}
```

#### Modern Theme Variables
```css
.theme-modern {
    --dt-primary: #2e86de;
    --dt-surface: #ffffff;
    --dt-background: #f4f6f9;
    --dt-border: #dde3ed;
    --dt-text: #1a1f36;
    --dt-text-secondary: #6b7a99;
    --dt-header-bg: #0f3460;
    --dt-header-text: #ffffff;
}
```

### Custom Theme (Future Enhancement)

To create a custom theme, add a new theme class in InlineCSS.css:

```css
.theme-custom {
    /* Your custom colors */
    --dt-primary: #your-color;
    --dt-header-bg: #your-header-color;
    /* ... other variables */
}
```

Then use it:
```javascript
styleTheme: "custom"
```

---

## Best Practices

### Theme Selection

**Use Default Theme When:**
- Building enterprise applications
- Need Carbon Design System consistency
- Corporate/professional look required
- Integrating with other Carbon components

**Use Modern Theme When:**
- Building dashboards and reports
- Need visual hierarchy and contrast
- Data-heavy interfaces
- Modern, bold aesthetic desired

### Search Optimization

**For Best Search Performance:**
1. Limit data to current page (use server-side pagination)
2. Keep column count reasonable (< 15 columns)
3. Use meaningful column headers
4. Consider adding search hints in placeholder text

**Search UX Tips:**
1. Show record count to indicate filtered results
2. Provide clear "no results" messaging
3. Allow easy search clearing (ESC key)
4. Consider debouncing for very large datasets

---

## Troubleshooting

### Theme Not Applying

**Issue**: Theme doesn't change when configuration is updated

**Solution**: Ensure the `styleTheme` option is set correctly:
```javascript
// Check configuration
console.log("Theme:", this.getOption("styleTheme"));

// Verify it's "default" or "modern"
styleTheme: "modern"  // Not "Modern" or "MODERN"
```

### Search Not Working

**Issue**: Search input doesn't filter data

**Solution**: Verify `enableSearch` is true:
```javascript
enableSearch: true  // Must be explicitly true
```

**Issue**: Search doesn't find expected results

**Solution**: Check data format:
```javascript
// Ensure data is in correct format
data: [
    { field1: "value1", field2: "value2" }  // Object format
]
// NOT: data: "string" or data: null
```

### Search Performance Issues

**Issue**: Search is slow with large datasets

**Solution**: Use server-side pagination:
```javascript
// Only send current page data
pagination: {
    page: 1,
    pageSize: 100,
    totalRecords: 5000  // Total in database
}
// data array should only contain 100 records
```

---

## Migration Guide

### Upgrading from Previous Version

If you're upgrading from a version without themes/search:

1. **No Breaking Changes**: Widget works with existing configurations
2. **Default Behavior**: Uses "default" theme and enables search by default
3. **Optional Configuration**: Add theme/search options as needed

### Example Migration

**Before:**
```javascript
// Old configuration
{
    title: "My Table",
    showRefresh: true,
    pageSize: 100
}
```

**After (with new features):**
```javascript
// New configuration with themes and search
{
    title: "My Table",
    styleTheme: "modern",      // NEW: Add theme
    enableSearch: true,        // NEW: Enable search
    showRefresh: true,
    pageSize: 100
}
```

---

## Examples

### Example 1: Modern Dashboard

```javascript
// Modern theme with search for dashboard
var config = {
    title: "Sales Dashboard",
    styleTheme: "modern",
    enableSearch: true,
    showRefresh: true,
    showRecordCount: true,
    pageSize: 50
};
```

### Example 2: Corporate Report

```javascript
// Default theme for corporate report
var config = {
    title: "Quarterly Report",
    styleTheme: "default",
    enableSearch: false,  // Disable search for reports
    showRefresh: false,
    showRecordCount: true,
    pageSize: 100
};
```

### Example 3: Data Explorer

```javascript
// Modern theme with search for data exploration
var config = {
    title: "Data Explorer",
    styleTheme: "modern",
    enableSearch: true,
    showRefresh: true,
    enableRowSelection: true,
    pageSize: 25
};
```

---

## Visual Comparison

### Default Theme Screenshot Description
- Light gray header (#f4f4f4)
- Dark gray text on white background
- Subtle hover effects
- Carbon-style badges
- Professional, clean appearance

### Modern Theme Screenshot Description
- Deep navy header (#0f3460) with white text
- Enhanced visual hierarchy
- Alternating row colors for better readability
- Bright blue accents (#2e86de)
- Modern, bold appearance

---

## Summary

The DynamicServiceTable widget now provides:

✅ **Two Professional Themes**
- Default: Carbon Design System
- Modern: DynamicReportGrid-inspired

✅ **Powerful Search**
- Real-time filtering
- Multi-column search
- Keyboard shortcuts

✅ **Easy Configuration**
- Simple boolean/string options
- No code changes required
- Backward compatible

✅ **Enhanced UX**
- Visual feedback
- Filtered record counts
- Clear empty states

---

## Related Documentation

- [`README.md`](./README.md) - Main widget documentation
- [`BAW_TEST_DATA.md`](./BAW_TEST_DATA.md) - Data format and examples
- [`SQL_INTEGRATION_GUIDE.md`](./SQL_INTEGRATION_GUIDE.md) - Database integration

---

## Support

For issues or questions:
1. Check this guide for common solutions
2. Review the main README.md
3. Contact your BAW administrator

---

**Made with Bob** 🤖