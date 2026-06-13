# DynamicReportGrid Widget

A production-ready, server-side paginated data grid widget for IBM Business Automation Workflow (BAW) that operates with zero client-side data caching.

## Overview

The DynamicReportGrid widget accepts dynamic configuration and SQL templates at runtime, rendering any arbitrary result set as a sortable and paginated data grid. Every user interaction (pagination, sorting, page size change) triggers exactly one database query—ensuring no full dataset is ever loaded into browser memory.

## Key Features

- **True Server-Side Pagination**: Every interaction triggers a fresh SQL execution
- **Dynamic Configuration**: Accept any column structure without code modification
- **SQL Template Support**: Parameterized queries with runtime substitution
- **Zero Client Caching**: Only current page data maintained in component state
- **Carbon Design System**: Full IBM Carbon styling and components
- **Accessibility**: WCAG 2.1 AA compliant with ARIA attributes and keyboard navigation
- **Status Indicators**: Color-coded badges for success, warning, error, and info states
- **Responsive Design**: Adapts to different screen sizes
- **Internationalization**: Configurable labels for all UI elements

## Configuration

### Required Properties

#### columns (GridColumn[])
Array of column definitions that determine grid structure:

```javascript
{
  field: "customer_id",        // Database column name
  label: "Customer ID",         // Display label
  dataType: "string",          // string, number, date, boolean, currency
  formatter: "none",           // date, currency, percentage, custom
  width: "150px",              // Column width
  sortable: true,              // Enable sorting
  align: "left"                // left, center, right
}
```

#### sqlTemplate (String)
SQL query template with named placeholders:

```sql
SELECT 
  customer_id, 
  customer_name, 
  order_date, 
  total_amount,
  status
FROM orders
WHERE active = 1
ORDER BY {{sortColumn}} {{sortDirection}}
LIMIT {{limit}} OFFSET {{offset}}
```

**Placeholders:**
- `{{offset}}` - Calculated as (currentPage - 1) * pageSize
- `{{limit}}` - Current page size
- `{{sortColumn}}` - Current sort column field name
- `{{sortDirection}}` - ASC or DESC

#### connectionString (String)
Database connection identifier or JNDI name for BAW database access.

### Optional Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| pageSize | Integer | 25 | Initial rows per page |
| pageSizeOptions | Integer[] | [10,25,50,100] | Available page size options |
| defaultSortColumn | String | "" | Initial sort column |
| defaultSortDirection | String | "ASC" | Initial sort direction |
| size | String | "medium" | Grid size: small, medium, large |
| showStatusColumn | Boolean | false | Show status badges |
| statusColumnField | String | "status" | Field containing status values |
| enableKeyboardNav | Boolean | true | Enable keyboard navigation |
| loadingText | String | "Loading data..." | Loading indicator text |
| errorText | String | "Error loading data..." | Error message text |
| noDataText | String | "No data available" | Empty state text |
| queryTimeout | Integer | 30 | Query timeout in seconds |

### Labels Configuration

Customize all UI text for internationalization:

```javascript
{
  firstPage: "First",
  previousPage: "Previous",
  nextPage: "Next",
  lastPage: "Last",
  pageInfo: "Page {current} of {total}",
  rowsPerPage: "Rows per page:",
  showing: "Showing {start}-{end} of {total} rows"
}
```

## Usage Example

### Basic Configuration

```javascript
// Column definitions
var columns = [
  {
    field: "order_id",
    label: "Order ID",
    dataType: "number",
    width: "100px",
    sortable: true,
    align: "right"
  },
  {
    field: "customer_name",
    label: "Customer",
    dataType: "string",
    width: "200px",
    sortable: true,
    align: "left"
  },
  {
    field: "order_date",
    label: "Order Date",
    dataType: "date",
    formatter: "date",
    width: "150px",
    sortable: true,
    align: "center"
  },
  {
    field: "total_amount",
    label: "Total",
    dataType: "currency",
    formatter: "currency",
    width: "120px",
    sortable: true,
    align: "right"
  },
  {
    field: "status",
    label: "Status",
    dataType: "string",
    width: "100px",
    sortable: false,
    align: "center"
  }
];

// SQL template
var sqlTemplate = `
  SELECT 
    order_id,
    customer_name,
    order_date,
    total_amount,
    status
  FROM orders
  WHERE order_date >= CURRENT_DATE - INTERVAL '90 days'
  ORDER BY {{sortColumn}} {{sortDirection}}
  LIMIT {{limit}} OFFSET {{offset}}
`;

// Widget configuration
{
  columns: columns,
  sqlTemplate: sqlTemplate,
  connectionString: "jdbc/OrdersDB",
  pageSize: 25,
  defaultSortColumn: "order_date",
  defaultSortDirection: "DESC",
  showStatusColumn: true,
  statusColumnField: "status"
}
```

### Advanced Configuration with Custom Formatters

```javascript
var columns = [
  {
    field: "revenue",
    label: "Revenue",
    dataType: "currency",
    formatter: "currency",
    width: "150px",
    sortable: true,
    align: "right"
  },
  {
    field: "growth_rate",
    label: "Growth",
    dataType: "number",
    formatter: "percentage",
    width: "100px",
    sortable: true,
    align: "right"
  }
];
```

## Server-Side Implementation

### BAW Service Flow

The widget requires a BAW service that:

1. Receives pagination parameters (offset, limit, sortColumn, sortDirection)
2. Executes the parameterized SQL query
3. Returns GridDataResult object

**Input Parameters:**
- `offset` (Integer): Starting row number
- `limit` (Integer): Number of rows to fetch
- `sortColumn` (String): Column to sort by
- `sortDirection` (String): ASC or DESC
- `sqlTemplate` (String): SQL query template
- `connectionString` (String): Database connection

**Output (GridDataResult):**
```javascript
{
  rows: [/* array of row objects */],
  totalRows: 1250,              // Total rows in complete result set
  currentPage: 1,               // Current page number
  pageSize: 25,                 // Rows per page
  sortColumn: "order_date",     // Current sort column
  sortDirection: "DESC",        // Current sort direction
  error: null,                  // Error message if query failed
  executionTime: 45             // Query execution time in ms
}
```

### SQL Template Parameterization

The widget replaces placeholders before sending to server:

```javascript
// Template
"SELECT * FROM orders ORDER BY {{sortColumn}} {{sortDirection}} LIMIT {{limit}} OFFSET {{offset}}"

// Becomes (for page 2, 25 rows, sorted by order_date DESC)
"SELECT * FROM orders ORDER BY order_date DESC LIMIT 25 OFFSET 25"
```

## Events

The widget fires the following events:

### pageChange
Fired when user navigates to a different page.

**Event Data:**
```javascript
{
  currentPage: 2,
  pageSize: 25,
  sortColumn: "order_date",
  sortDirection: "DESC"
}
```

### sortChange
Fired when user changes sort column or direction.

**Event Data:**
```javascript
{
  sortColumn: "customer_name",
  sortDirection: "ASC",
  previousColumn: "order_date",
  previousDirection: "DESC"
}
```

### pageSizeChange
Fired when user changes page size.

**Event Data:**
```javascript
{
  newPageSize: 50,
  previousPageSize: 25,
  resetToPage: 1
}
```

### dataLoaded
Fired when data fetch completes successfully.

**Event Data:**
```javascript
{
  rowCount: 25,
  totalRows: 1250,
  executionTime: 45
}
```

### dataError
Fired when data fetch fails.

**Event Data:**
```javascript
{
  error: "Connection timeout",
  sqlTemplate: "SELECT...",
  parameters: {offset: 0, limit: 25}
}
```

## Status Indicators

When `showStatusColumn` is enabled, the widget displays color-coded status badges:

- **success**: Green badge (e.g., "Completed", "Approved")
- **warning**: Yellow badge (e.g., "Pending", "Review Required")
- **error**: Red badge (e.g., "Failed", "Rejected")
- **info**: Blue badge (e.g., "In Progress", "Processing")

Status values in data should match these keywords (case-insensitive).

## Accessibility Features

- **ARIA Attributes**: Proper roles and labels for screen readers
- **Keyboard Navigation**: 
  - Tab: Navigate between controls
  - Enter/Space: Activate buttons and sort columns
  - Arrow keys: Navigate table cells (when enabled)
- **Focus Management**: Clear focus indicators
- **Screen Reader Support**: Announces page changes and data updates
- **High Contrast Mode**: Enhanced borders and outlines
- **Reduced Motion**: Respects prefers-reduced-motion setting

## Performance Considerations

### Query Optimization
- Add appropriate indexes on sortable columns
- Use LIMIT/OFFSET efficiently (consider keyset pagination for very large datasets)
- Set reasonable query timeouts
- Monitor execution times via executionTime property

### Network Optimization
- Only current page data transmitted
- Minimal payload size
- Consider caching at database level, not client

### Browser Performance
- Virtual scrolling not needed (only one page in DOM)
- Minimal re-renders
- Efficient event delegation

## Browser Support

- Chrome 85+
- Firefox 90+
- Safari 14+
- Edge 85+

## Dependencies

- IBM Carbon Design System (CSS variables)
- BAW Coach View API
- BAW Database Services

## Troubleshooting

### No Data Displayed
1. Check SQL template syntax
2. Verify connection string
3. Check browser console for errors
4. Verify service flow returns GridDataResult structure

### Sorting Not Working
1. Ensure columns have `sortable: true`
2. Verify SQL template includes `{{sortColumn}}` and `{{sortDirection}}`
3. Check that sort column names match database columns

### Performance Issues
1. Add database indexes on sortable columns
2. Reduce page size
3. Optimize SQL query
4. Check query execution time in dataLoaded event

## License

Licensed under Apache 2.0

## Support

For issues or questions, refer to BAW documentation or IBM support channels.