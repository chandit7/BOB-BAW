# DynamicServiceTable Widget

A reusable, fully dynamic table widget for IBM Business Automation Workflow (BAW) that renders data with server-side pagination, sorting, and filtering capabilities.

## Overview

The DynamicServiceTable widget provides a robust solution for displaying tabular data in BAW without the limitations of standard BAW Table controls. It uses a **single String binding** containing JSON data, which eliminates all type conversion issues and provides maximum flexibility.

## Key Features

- ✅ **Fully Dynamic**: No fixed columns - define any schema at runtime
- ✅ **Type-Safe**: Uses String binding to avoid BAW type conversion errors
- ✅ **Rich Formatting**: Supports currency, dates, numbers, badges, booleans, and links
- ✅ **Server-Side Operations**: Pagination, sorting, and filtering handled by backend
- ✅ **Configurable Themes**: Choose between Default (Carbon) or Modern (DynamicReportGrid-inspired) themes
- ✅ **Client-Side Search**: Real-time filtering across all columns with keyboard shortcuts
- ✅ **Event-Driven**: Fires events for sort, pagination, row selection, and refresh
- ✅ **Responsive**: Adapts to different screen sizes
- ✅ **Accessible**: Keyboard navigation and screen reader support

## Architecture

### The String Binding Approach

Unlike traditional BAW widgets that use Business Objects, this widget uses a single String binding:

```
BAW Script Node → JSON.stringify() → String Variable → Widget → JSON.parse() → Render
```

**Benefits**:
- No "Property X in class ANY is not declared" errors
- Dynamic column definitions without BAW Designer changes
- Any JSON structure can be passed
- Simplified development and maintenance

## Quick Start

### 1. Create String Variable

In your BAW Process/Service, create:
- Variable name: `tw.local.tableDataJSON`
- Type: **String**

### 2. Build JSON Data

Create a Script Node:

```javascript
var tableData = {
    columns: [
        {
            field: "id",
            header: "ID",
            sortable: true,
            width: "80px",
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
            field: "amount",
            header: "Amount",
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
                "active": { label: "Active", color: "green" },
                "pending": { label: "Pending", color: "yellow" },
                "rejected": { label: "Rejected", color: "red" }
            })
        }
    ],
    data: [
        { id: 1, name: "John Doe", amount: 1234.56, status: "active" },
        { id: 2, name: "Jane Smith", amount: 2345.67, status: "pending" }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 2
    }
};

tw.local.tableDataJSON = JSON.stringify(tableData);
```

### 3. Add Widget to Coach

1. Drag **DynamicServiceTable** widget onto your coach
2. Bind **Data** to: `tw.local.tableDataJSON`
3. Configure options as needed

### 4. Run and Test

The table will render with all formatting, sorting, and pagination controls.

## Column Types

### text (default)
Plain text display.

### number
Formatted with thousand separators: `1,234,567.89`

### currency
Dollar amounts: `$1,234.50`

### date
Locale-formatted dates: `1/15/2024`

### boolean
Checkmarks: ✓ (true) or ✗ (false)

### badge
Colored status badges with configurable labels and colors.

**Badge Configuration**:
```javascript
{
    field: "status",
    type: "badge",
    badgeMap: JSON.stringify({
        "active": { label: "Active", color: "green" },
        "pending": { label: "Pending", color: "yellow" },
        "rejected": { label: "Rejected", color: "red" },
        "approved": { label: "Approved", color: "blue" },
        "inactive": { label: "Inactive", color: "gray" }
    })
}
```

**Available Colors**: green, red, yellow, blue, gray

### link
Clickable hyperlinks with optional URL templates.

```javascript
{
    field: "userId",
    type: "link",
    linkTemplate: "/users/{value}/profile"
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| title | String | "Data Table" | Table title displayed in header |
| styleTheme | String | "default" | Visual theme: "default" (Carbon) or "modern" (DynamicReportGrid-inspired) |
| enableSearch | Boolean | true | Enable client-side search functionality |
| showRefresh | Boolean | true | Show refresh button in toolbar |
| showRecordCount | Boolean | true | Show total record count in header |
| enableRowSelection | Boolean | true | Allow users to click rows to select them |
| currentPage | Integer | 1 | Current page number (1-based) |
| pageSize | Integer | 100 | Number of rows per page |
| sortColumn | String | "" | Current sort column field name |
| sortDirection | String | "ASC" | Current sort direction (ASC or DESC) |
| isLoading | Boolean | false | Show loading overlay |

### Theme Options

**Default Theme** (`styleTheme: "default"`):
- IBM Carbon Design System styling
- Light gray header with dark text
- Professional, corporate appearance
- Best for enterprise applications

**Modern Theme** (`styleTheme: "modern"`):
- DynamicReportGrid-inspired design
- Deep navy header (#0f3460) with white text
- Enhanced visual hierarchy
- Best for dashboards and reports

See [`THEMES_AND_SEARCH_GUIDE.md`](./THEMES_AND_SEARCH_GUIDE.md) for detailed theme documentation.

### Search Functionality

When `enableSearch` is enabled:
- Real-time filtering across all columns
- Case-insensitive partial matching
- Visual feedback for filtered results
- Keyboard shortcut: ESC to clear search
- Shows "X of Y (filtered)" in record count

See [`THEMES_AND_SEARCH_GUIDE.md`](./THEMES_AND_SEARCH_GUIDE.md) for detailed search documentation.

## Events

### onSort
Fired when user clicks a sortable column header.

**Event Data**:
```javascript
{
    column: "name",      // Field name
    direction: "ASC"     // "ASC" or "DESC"
}
```

**Handler Example**:
```javascript
// Re-fetch data with new sort order
tw.local.sortColumn = event.column;
tw.local.sortDirection = event.direction;
// ... execute SQL query with ORDER BY
// ... update tw.local.tableDataJSON
```

### onPageChange
Fired when user navigates to a different page.

**Event Data**:
```javascript
{
    page: 2,
    pageSize: 100
}
```

### onPageSizeChange
Fired when user changes rows per page.

**Event Data**:
```javascript
{
    pageSize: 50
}
```

### onRowSelect
Fired when user clicks a row (if enableRowSelection is true).

**Event Data**:
```javascript
{
    row: { id: 1, name: "John Doe", ... },  // Complete row object
    index: 0                                 // Row index in current page
}
```

### onRefresh
Fired when user clicks the refresh button.

**Event Data**:
```javascript
{
    timestamp: "2024-01-15T10:30:00.000Z"
}
```

## Integration with SQL Queries

### Basic SQL Integration

```javascript
// Execute SQL query
var sqlResult = tw.system.currentProcessInstance.executeSQL(
    "SELECT id, name, email, salary, status FROM employees WHERE department = ? ORDER BY ? ?",
    [tw.local.departmentId, tw.local.sortColumn, tw.local.sortDirection]
);

// Build table data
var tableData = {
    columns: [
        { field: "id", header: "ID", sortable: true, type: "number" },
        { field: "name", header: "Name", sortable: true, type: "text" },
        { field: "email", header: "Email", sortable: true, type: "text" },
        { field: "salary", header: "Salary", sortable: true, align: "right", type: "currency" },
        { 
            field: "status", 
            header: "Status", 
            sortable: true, 
            type: "badge",
            badgeMap: JSON.stringify({
                "active": { label: "Active", color: "green" },
                "inactive": { label: "Inactive", color: "gray" }
            })
        }
    ],
    data: sqlResult.rows,
    pagination: {
        page: tw.local.currentPage,
        pageSize: tw.local.pageSize,
        totalRecords: sqlResult.totalCount
    }
};

tw.local.tableDataJSON = JSON.stringify(tableData);
```

### Server-Side Pagination

```javascript
// Calculate offset for SQL query
var offset = (tw.local.currentPage - 1) * tw.local.pageSize;

// Execute paginated query
var sqlResult = tw.system.currentProcessInstance.executeSQL(
    "SELECT id, name, email FROM employees LIMIT ? OFFSET ?",
    [tw.local.pageSize, offset]
);

// Get total count
var countResult = tw.system.currentProcessInstance.executeSQL(
    "SELECT COUNT(*) as total FROM employees",
    []
);

// Build table data with pagination
var tableData = {
    columns: [...],
    data: sqlResult.rows,
    pagination: {
        page: tw.local.currentPage,
        pageSize: tw.local.pageSize,
        totalRecords: countResult.rows[0].total
    }
};

tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Styling and Themes

The widget supports two built-in themes:

### Default Theme
- IBM Carbon Design System colors and components
- Light gray header (#f4f4f4)
- Professional, clean appearance
- Carbon-style badges and controls

### Modern Theme
- DynamicReportGrid-inspired design
- Deep navy header (#0f3460)
- Enhanced visual hierarchy
- Modern, bold appearance

**To switch themes:**
```javascript
// In widget configuration
styleTheme: "modern"  // or "default"
```

**For detailed theme documentation, see:**
- [`THEMES_AND_SEARCH_GUIDE.md`](./THEMES_AND_SEARCH_GUIDE.md) - Complete theme and search guide
- Theme comparison and customization options
- Visual examples and best practices

## Performance Considerations

1. **Limit Data Array Size**: Send only the current page of data, not all records
2. **Use Server-Side Operations**: Let the database handle sorting and filtering
3. **Minimize Column Count**: Only include columns users need to see
4. **Cache Results**: Store query results in BAW variables to avoid repeated queries
5. **Optimize SQL Queries**: Use indexes and efficient WHERE clauses

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Troubleshooting

### Table shows "No data available"

**Cause**: `tw.local.tableDataJSON` is empty or invalid JSON.

**Solution**: 
```javascript
// Debug: Log the JSON string
console.log("tableDataJSON:", tw.local.tableDataJSON);

// Verify it's valid JSON
try {
    JSON.parse(tw.local.tableDataJSON);
} catch (e) {
    console.error("Invalid JSON:", e);
}
```

### Badges not showing colors

**Cause**: `badgeMap` is an object instead of a JSON string.

**Solution**: Use `JSON.stringify()`:
```javascript
// WRONG
badgeMap: { "active": { label: "Active", color: "green" } }

// CORRECT
badgeMap: JSON.stringify({ "active": { label: "Active", color: "green" } })
```

### Currency not formatting

**Cause**: Values are strings instead of numbers.

**Solution**: Ensure numeric values:
```javascript
// WRONG
{ amount: "1234.56" }

// CORRECT
{ amount: 1234.56 }
```

### Events not firing

**Cause**: Event handlers not configured in BAW Designer.

**Solution**: 
1. Select the widget in BAW Designer
2. Go to **Events** tab
3. Add handlers for desired events (onSort, onPageChange, etc.)

## Documentation

### Core Documentation
- **[README.md](./README.md)** (this file) - Main widget documentation
- **[BAW_TEST_DATA.md](./BAW_TEST_DATA.md)** - Data format, column types, and BAW integration examples
- **[THEMES_AND_SEARCH_GUIDE.md](./THEMES_AND_SEARCH_GUIDE.md)** - Theme configuration and search functionality guide

### Integration Guides
- **[SQL_INTEGRATION_GUIDE.md](./SQL_INTEGRATION_GUIDE.md)** - Database integration and SQL query examples
- **[BO_TO_JSON_CONVERTER.js](./BO_TO_JSON_CONVERTER.js)** - Business Object to JSON conversion utilities
- **[GENERIC_SQL_TEMPLATE.js](./GENERIC_SQL_TEMPLATE.js)** - Reusable SQL integration templates

### Examples and Testing
- **[GENERATE_500_RECORDS.js](./GENERATE_500_RECORDS.js)** - Generate test data for performance testing
- **[LSW_TASK_EXAMPLE.js](./LSW_TASK_EXAMPLE.js)** - Complete LSW_TASK table integration example
- **[REDESIGN_SUMMARY.md](./REDESIGN_SUMMARY.md)** - Widget architecture and design decisions

## Examples

See the documentation files above for complete working examples including:
- All column types (text, number, currency, date, boolean, badge, link)
- Badge configurations with color mapping
- SQL integration with BAW system tables
- Event handling for sorting, pagination, and row selection
- Server-side and client-side pagination
- Theme switching and search functionality

## License

This widget is part of the reportUi toolkit for IBM Business Automation Workflow.

## Support

For issues or questions, please refer to the BAW documentation or contact your BAW administrator.