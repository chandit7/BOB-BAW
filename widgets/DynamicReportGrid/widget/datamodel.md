# DynamicReportGrid - Data Model

## Overview

The DynamicReportGrid widget uses a server-side pagination model where only the current page's data is maintained in the widget state. The widget never caches the full dataset, ensuring minimal memory footprint and fresh data on every interaction.

## Binding Type

**Type**: `GridDataResult`  
**Is List**: No  
**Description**: Server response containing current page data and pagination metadata

## Input Configuration

### columns (GridColumn[])

Array of column definitions that determine the grid structure.

**Type**: `GridColumn[]` (Business Object List)

**GridColumn Properties**:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| field | String | Yes | Database column name or field identifier |
| label | String | Yes | Display label for column header |
| dataType | String | No | Data type: string, number, date, boolean, currency |
| formatter | String | No | Formatter function: date, currency, percentage, custom |
| width | String | No | Column width (e.g., '150px', '20%', 'auto') |
| sortable | Boolean | No | Whether column is sortable (default: true) |
| align | String | No | Text alignment: left, center, right (default: left) |

**Example**:
```javascript
[
  {
    field: "customer_id",
    label: "Customer ID",
    dataType: "number",
    width: "100px",
    sortable: true,
    align: "right"
  },
  {
    field: "customer_name",
    label: "Customer Name",
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
  }
]
```

### sqlTemplate (String)

SQL query template with named placeholders for runtime parameterization.

**Type**: `String`  
**Required**: Yes

**Placeholders**:
- `{{offset}}` - Starting row number (calculated as (currentPage - 1) * pageSize)
- `{{limit}}` - Number of rows to fetch (current page size)
- `{{sortColumn}}` - Column field name to sort by
- `{{sortDirection}}` - Sort direction (ASC or DESC)

**Example**:
```sql
SELECT 
  customer_id,
  customer_name,
  order_date,
  total_amount,
  status
FROM orders
WHERE active = 1
  AND order_date >= CURRENT_DATE - INTERVAL '90 days'
ORDER BY {{sortColumn}} {{sortDirection}}
LIMIT {{limit}} OFFSET {{offset}}
```

**Important Notes**:
- The widget replaces placeholders before sending to server
- SQL must support LIMIT/OFFSET or equivalent pagination syntax
- Sort column names must match database column names exactly
- Always include ORDER BY clause with placeholders for consistent pagination

## Output Data (GridDataResult)

The widget expects the bound data to be a `GridDataResult` object returned from the server.

**Type**: `GridDataResult` (Business Object)

**GridDataResult Properties**:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| rows | ANY[] | Yes | Array of row objects for current page only |
| totalRows | Integer | Yes | Total number of rows in complete result set |
| currentPage | Integer | Yes | Current page number (1-based) |
| pageSize | Integer | Yes | Number of rows per page |
| sortColumn | String | No | Current sort column field name |
| sortDirection | String | No | Current sort direction (ASC or DESC) |
| error | String | No | Error message if query failed |
| executionTime | Integer | No | Query execution time in milliseconds |

**Example Response**:
```javascript
{
  rows: [
    {
      customer_id: 1001,
      customer_name: "Acme Corp",
      order_date: "2024-01-15",
      total_amount: 15000.00,
      status: "success"
    },
    {
      customer_id: 1002,
      customer_name: "TechStart Inc",
      order_date: "2024-01-14",
      total_amount: 8500.00,
      status: "warning"
    }
    // ... 23 more rows for page size of 25
  ],
  totalRows: 1250,
  currentPage: 1,
  pageSize: 25,
  sortColumn: "order_date",
  sortDirection: "DESC",
  error: null,
  executionTime: 45
}
```

## Row Data Structure

Each object in the `rows` array should contain properties matching the column `field` names.

**Dynamic Structure**: The row objects can have any properties as long as they match the configured column field names.

**Example Row**:
```javascript
{
  customer_id: 1001,           // Matches column field "customer_id"
  customer_name: "Acme Corp",  // Matches column field "customer_name"
  order_date: "2024-01-15",    // Matches column field "order_date"
  total_amount: 15000.00,      // Matches column field "total_amount"
  status: "success"            // Matches column field "status"
}
```

## State Management

### Widget State (Internal)

The widget maintains minimal state:

```javascript
{
  currentPage: 1,              // Current page number
  pageSize: 25,                // Rows per page
  sortColumn: "order_date",    // Current sort column
  sortDirection: "DESC",       // Current sort direction
  totalRows: 1250,             // Total rows (from server)
  totalPages: 50,              // Calculated: Math.ceil(totalRows / pageSize)
  isLoading: false,            // Loading state
  hasError: false              // Error state
}
```

**Critical**: The widget does NOT store the rows array. It only renders what's in the current `GridDataResult.rows`.

### Data Flow

1. **User Action** (page change, sort, page size change)
   ↓
2. **Update State** (currentPage, sortColumn, etc.)
   ↓
3. **Parameterize SQL** (replace {{placeholders}})
   ↓
4. **Call Server** (execute SQL with parameters)
   ↓
5. **Receive GridDataResult** (current page data only)
   ↓
6. **Render Table** (replace all rows)
   ↓
7. **Update UI** (pagination controls, info text)

### No Client-Side Caching

**Important**: The widget implements true server-side pagination:

- ✅ Only current page data in memory
- ✅ Every interaction triggers fresh SQL execution
- ✅ No full dataset ever loaded to browser
- ✅ Minimal memory footprint
- ✅ Always fresh data

- ❌ No client-side filtering
- ❌ No client-side sorting
- ❌ No data prefetching
- ❌ No row caching

## Pagination Calculations

### Offset Calculation
```javascript
offset = (currentPage - 1) * pageSize

// Examples:
// Page 1, size 25: offset = 0
// Page 2, size 25: offset = 25
// Page 3, size 50: offset = 100
```

### Total Pages Calculation
```javascript
totalPages = Math.ceil(totalRows / pageSize)

// Examples:
// 1250 rows, 25 per page: 50 pages
// 1250 rows, 50 per page: 25 pages
// 100 rows, 25 per page: 4 pages
```

### Showing Range Calculation
```javascript
start = (currentPage - 1) * pageSize + 1
end = Math.min(currentPage * pageSize, totalRows)

// Examples:
// Page 1 of 1250 rows, 25 per page: "Showing 1-25 of 1250"
// Page 2 of 1250 rows, 25 per page: "Showing 26-50 of 1250"
// Page 50 of 1250 rows, 25 per page: "Showing 1226-1250 of 1250"
```

## Data Type Formatting

The widget supports automatic formatting based on `dataType` and `formatter` properties:

### Date Formatting
```javascript
{
  field: "order_date",
  dataType: "date",
  formatter: "date"
}
// Formats: "2024-01-15" → "Jan 15, 2024"
```

### Currency Formatting
```javascript
{
  field: "total_amount",
  dataType: "currency",
  formatter: "currency"
}
// Formats: 15000.00 → "$15,000.00"
```

### Percentage Formatting
```javascript
{
  field: "growth_rate",
  dataType: "number",
  formatter: "percentage"
}
// Formats: 0.15 → "15%"
```

### Number Formatting
```javascript
{
  field: "quantity",
  dataType: "number"
}
// Formats: 1234567 → "1,234,567"
```

## Status Values

When `showStatusColumn` is enabled, the widget recognizes these status values:

| Status Value | Badge Color | Use Case |
|--------------|-------------|----------|
| success, completed, approved | Green | Successful operations |
| warning, pending, review | Yellow | Items needing attention |
| error, failed, rejected | Red | Failed operations |
| info, processing, in-progress | Blue | Ongoing operations |

**Case Insensitive**: Status matching is case-insensitive.

## Error Handling

### Server Errors

When the server returns an error, populate the `error` property:

```javascript
{
  rows: [],
  totalRows: 0,
  currentPage: 1,
  pageSize: 25,
  error: "Connection timeout after 30 seconds",
  executionTime: 30000
}
```

The widget will:
1. Display error message to user
2. Fire `dataError` event
3. Disable pagination controls
4. Show error icon and message

### Empty Results

When query returns no rows:

```javascript
{
  rows: [],
  totalRows: 0,
  currentPage: 1,
  pageSize: 25,
  error: null,
  executionTime: 12
}
```

The widget will:
1. Display "No data available" message
2. Fire `dataLoaded` event with rowCount: 0
3. Disable pagination controls
4. Show empty state icon

## Performance Considerations

### Optimal Page Sizes

- **Small datasets (<1000 rows)**: 25-50 rows per page
- **Medium datasets (1000-10000 rows)**: 50-100 rows per page
- **Large datasets (>10000 rows)**: 100 rows per page

### Query Optimization

- Add indexes on sortable columns
- Use appropriate LIMIT/OFFSET
- Consider materialized views for complex queries
- Monitor `executionTime` property

### Network Optimization

- Only current page transmitted
- Typical payload: 25 rows × 5 columns = ~2-5 KB
- Compression recommended for large text fields

## Integration with BAW

### Service Flow Input

```javascript
{
  offset: 0,
  limit: 25,
  sortColumn: "order_date",
  sortDirection: "DESC",
  sqlTemplate: "SELECT...",
  connectionString: "jdbc/OrdersDB"
}
```

### Service Flow Output

```javascript
{
  rows: [...],
  totalRows: 1250,
  currentPage: 1,
  pageSize: 25,
  sortColumn: "order_date",
  sortDirection: "DESC",
  error: null,
  executionTime: 45
}
```

### Database Query Execution

1. Receive parameters from widget
2. Validate and sanitize inputs
3. Replace SQL template placeholders
4. Execute query with timeout
5. Count total rows (separate query or window function)
6. Return GridDataResult

## Best Practices

1. **Always validate sort column** against allowed columns to prevent SQL injection
2. **Use parameterized queries** for any user-provided values
3. **Set reasonable timeouts** (30 seconds recommended)
4. **Monitor execution times** via executionTime property
5. **Add database indexes** on frequently sorted columns
6. **Return consistent data types** matching column definitions
7. **Handle errors gracefully** with meaningful error messages
8. **Test with empty results** to ensure proper empty state handling
9. **Test with large datasets** to verify pagination performance
10. **Use connection pooling** for database connections