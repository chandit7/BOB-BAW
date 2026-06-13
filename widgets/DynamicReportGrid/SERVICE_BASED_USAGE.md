# DynamicReportGrid - Service-Based Usage Guide

## Overview

The DynamicReportGrid widget uses an **event-driven architecture** where the widget fires a `fetchData` event whenever it needs data. Your coach handles this event by calling a BAW service flow, which then updates the widget's bound data.

This approach is cleaner and more aligned with BAW best practices than SQL configuration.

---

## Quick Start Example

### Step 1: Create Column Definitions

In your coach's **Load** event or as a private variable:

```javascript
// Initialize columns
tw.local.columns = new tw.object.listOf.GridColumn();

var col1 = new tw.object.GridColumn();
col1.field = "order_id";
col1.label = "Order ID";
col1.dataType = "number";
col1.sortable = true;
col1.align = "right";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col1);

var col2 = new tw.object.GridColumn();
col2.field = "customer_name";
col2.label = "Customer";
col2.dataType = "string";
col2.sortable = true;
tw.local.columns.insertIntoList(tw.local.columns.listLength, col2);

// Add more columns as needed...
```

### Step 2: Add Widget to Coach

1. Drag **DynamicReportGrid** widget onto coach
2. Configure properties:
   - **columns**: `${columns}`
   - **pageSize**: `25`
   - **defaultSortColumn**: `"order_id"`
   - **defaultSortDirection**: `"DESC"`
   - **showStatusColumn**: `true` (if you have a status field)
3. Bind to: `${gridData}` (GridDataResult variable)

### Step 3: Handle fetchData Event

In the widget's **fetchData** event handler:

```javascript
// Call your service flow with the event parameters
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",  // Your service flow name
  {
    offset: event.offset,
    limit: event.limit,
    sortColumn: event.sortColumn,
    sortDirection: event.sortDirection
  }
);
```

### Step 4: Create Service Flow

Create a service flow named `FetchGridData` with:

**Input Variables:**
- `offset` (Integer)
- `limit` (Integer)
- `sortColumn` (String)
- `sortDirection` (String)

**Output Variable:**
- `gridData` (GridDataResult)

**Implementation:**
```javascript
// SQL Execute activity
SELECT * FROM orders
ORDER BY ${sortColumn} ${sortDirection}
LIMIT ${limit} OFFSET ${offset}

// Count query
SELECT COUNT(*) as total FROM orders

// Build result
tw.local.gridData = new tw.object.GridDataResult();
tw.local.gridData.rows = tw.local.sqlResults;
tw.local.gridData.totalRows = tw.local.totalCount;
tw.local.gridData.currentPage = Math.floor(tw.local.offset / tw.local.limit) + 1;
tw.local.gridData.pageSize = tw.local.limit;
tw.local.gridData.sortColumn = tw.local.sortColumn;
tw.local.gridData.sortDirection = tw.local.sortDirection;
tw.local.gridData.error = null;
tw.local.gridData.executionTime = 50;
```

---

## Complete Coach Example

### Coach Variables

```javascript
// Private Variables
columns: GridColumn[] (list)
gridData: GridDataResult
```

### Coach Load Event

```javascript
// Initialize columns
tw.local.columns = new tw.object.listOf.GridColumn();

// Column 1: Order ID
var col1 = new tw.object.GridColumn();
col1.field = "order_id";
col1.label = "Order ID";
col1.dataType = "number";
col1.width = "100px";
col1.sortable = true;
col1.align = "right";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col1);

// Column 2: Customer
var col2 = new tw.object.GridColumn();
col2.field = "customer_name";
col2.label = "Customer";
col2.dataType = "string";
col2.width = "200px";
col2.sortable = true;
col2.align = "left";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col2);

// Column 3: Order Date
var col3 = new tw.object.GridColumn();
col3.field = "order_date";
col3.label = "Order Date";
col3.dataType = "date";
col3.formatter = "date";
col3.width = "150px";
col3.sortable = true;
col3.align = "center";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col3);

// Column 4: Amount
var col4 = new tw.object.GridColumn();
col4.field = "total_amount";
col4.label = "Amount";
col4.dataType = "currency";
col4.formatter = "currency";
col4.width = "120px";
col4.sortable = true;
col4.align = "right";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col4);

// Column 5: Status
var col5 = new tw.object.GridColumn();
col5.field = "status";
col5.label = "Status";
col5.dataType = "string";
col5.width = "100px";
col5.sortable = false;
col5.align = "center";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col5);

// Note: Initial data fetch will be triggered automatically by the widget
// via the fetchData event
```

### Widget Configuration

**Properties:**
- columns: `${columns}`
- pageSize: `25`
- pageSizeOptions: `[10, 25, 50, 100]`
- defaultSortColumn: `"order_date"`
- defaultSortDirection: `"DESC"`
- showStatusColumn: `true`
- statusColumnField: `"status"`
- size: `"medium"`
- enableKeyboardNav: `true`

**Data Binding:**
- Bind to: `${gridData}`

### Event Handlers

#### fetchData Event
```javascript
// This is the MAIN event - called whenever grid needs data
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: event.offset,
    limit: event.limit,
    sortColumn: event.sortColumn,
    sortDirection: event.sortDirection
  }
);
```

#### pageChange Event (Optional - for tracking)
```javascript
// Optional: Log or track page changes
log.info("User navigated to page " + event.currentPage);
```

#### sortChange Event (Optional - for tracking)
```javascript
// Optional: Log or track sort changes
log.info("User sorted by " + event.sortColumn + " " + event.sortDirection);
```

#### pageSizeChange Event (Optional - for tracking)
```javascript
// Optional: Log or track page size changes
log.info("User changed page size to " + event.newPageSize);
```

---

## Service Flow Implementation

### FetchGridData Service Flow

**Input:**
```javascript
offset: Integer
limit: Integer
sortColumn: String
sortDirection: String
```

**Output:**
```javascript
gridData: GridDataResult
```

**Steps:**

1. **SQL Execute - Fetch Rows**
   ```sql
   SELECT 
     order_id,
     customer_name,
     order_date,
     total_amount,
     status
   FROM orders
   WHERE active = 1
   ORDER BY ${sortColumn} ${sortDirection}
   LIMIT ${limit} OFFSET ${offset}
   ```
   Store result in: `tw.local.rows`

2. **SQL Execute - Count Total**
   ```sql
   SELECT COUNT(*) as total 
   FROM orders 
   WHERE active = 1
   ```
   Store result in: `tw.local.totalCount`

3. **Script - Build GridDataResult**
   ```javascript
   // Create result object
   tw.local.gridData = new tw.object.GridDataResult();
   
   // Set rows
   tw.local.gridData.rows = tw.local.rows;
   
   // Set metadata
   tw.local.gridData.totalRows = tw.local.totalCount;
   tw.local.gridData.currentPage = Math.floor(tw.local.offset / tw.local.limit) + 1;
   tw.local.gridData.pageSize = tw.local.limit;
   tw.local.gridData.sortColumn = tw.local.sortColumn;
   tw.local.gridData.sortDirection = tw.local.sortDirection;
   tw.local.gridData.error = null;
   tw.local.gridData.executionTime = 50; // Approximate
   ```

---

## How It Works

### Data Flow

```
1. Widget Initialized
   ↓
2. Widget fires "fetchData" event with parameters
   ↓
3. Coach event handler calls service flow
   ↓
4. Service executes SQL query
   ↓
5. Service returns GridDataResult
   ↓
6. Coach updates widget binding (gridData)
   ↓
7. Widget renders the data
```

### User Interaction Flow

```
User clicks "Next Page"
   ↓
Widget fires "fetchData" event (offset=25, limit=25)
   ↓
Coach calls service with new offset
   ↓
Service fetches rows 26-50
   ↓
Widget displays new page
```

---

## Advanced Usage

### Custom Filtering

Add filter parameters to your service:

**Service Input:**
```javascript
offset: Integer
limit: Integer
sortColumn: String
sortDirection: String
filterStatus: String  // NEW
filterDateFrom: Date  // NEW
```

**SQL:**
```sql
SELECT * FROM orders
WHERE status = ${filterStatus}
  AND order_date >= ${filterDateFrom}
ORDER BY ${sortColumn} ${sortDirection}
LIMIT ${limit} OFFSET ${offset}
```

**fetchData Event:**
```javascript
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: event.offset,
    limit: event.limit,
    sortColumn: event.sortColumn,
    sortDirection: event.sortDirection,
    filterStatus: tw.local.selectedStatus,
    filterDateFrom: tw.local.dateFrom
  }
);
```

### Error Handling

In your service flow, catch errors:

```javascript
try {
  // Execute SQL
  tw.local.rows = /* SQL result */;
  tw.local.totalCount = /* Count result */;
  
  // Build success result
  tw.local.gridData = new tw.object.GridDataResult();
  tw.local.gridData.rows = tw.local.rows;
  tw.local.gridData.totalRows = tw.local.totalCount;
  tw.local.gridData.error = null;
  
} catch (error) {
  // Build error result
  tw.local.gridData = new tw.object.GridDataResult();
  tw.local.gridData.rows = [];
  tw.local.gridData.totalRows = 0;
  tw.local.gridData.error = "Database error: " + error.message;
}
```

### Manual Refresh

Add a refresh button to your coach:

**Button Click Event:**
```javascript
// Get the widget reference
var grid = page.ui.get("DynamicReportGrid_1");

// Call the refresh method
if (grid && grid.refreshData) {
  grid.refreshData();
}
```

---

## Comparison: Old vs New Approach

### ❌ Old Approach (SQL Configuration)
```javascript
// Widget configuration
sqlTemplate: "SELECT ... ORDER BY {{sortColumn}} {{sortDirection}} LIMIT {{limit}} OFFSET {{offset}}"
connectionString: "jdbc/DataSource"

// Widget executes SQL directly (not ideal for BAW)
```

### ✅ New Approach (Service-Based)
```javascript
// Widget configuration
columns: [/* column definitions */]
pageSize: 25

// Widget fires event
fetchData event → Coach calls service → Service executes SQL → Returns data

// Benefits:
// - Follows BAW best practices
// - Service can add business logic
// - Better error handling
// - Easier to test
// - More flexible (can call REST APIs, etc.)
```

---

## Benefits of Service-Based Approach

1. **BAW Best Practices**: Uses standard BAW service flows
2. **Business Logic**: Add validation, transformation, security checks
3. **Flexibility**: Service can call databases, REST APIs, or other services
4. **Testability**: Services can be tested independently
5. **Security**: Centralized access control in service
6. **Reusability**: Same service can be used by multiple widgets
7. **Error Handling**: Better error handling and logging
8. **Monitoring**: Track service performance and usage

---

## Troubleshooting

### Widget Shows "No data available"

**Problem**: fetchData event not handled  
**Solution**: Add fetchData event handler that calls your service

### Data Not Updating

**Problem**: Service not updating the binding  
**Solution**: Ensure service returns GridDataResult and coach updates `tw.local.gridData`

### Pagination Not Working

**Problem**: totalRows not set correctly  
**Solution**: Verify count query returns correct total

### Sorting Not Working

**Problem**: SQL doesn't support dynamic ORDER BY  
**Solution**: Use parameterized SQL: `ORDER BY ${sortColumn} ${sortDirection}`

---

## Quick Reference

### Minimum Configuration

```javascript
// Widget properties
{
  columns: [/* GridColumn array */],
  pageSize: 25
}

// fetchData event handler
tw.local.gridData = tw.system.invokeService("FetchGridData", {
  offset: event.offset,
  limit: event.limit,
  sortColumn: event.sortColumn,
  sortDirection: event.sortDirection
});
```

### Service Signature

**Input:** offset, limit, sortColumn, sortDirection  
**Output:** GridDataResult

---

**Ready to use!** The service-based approach is cleaner, more flexible, and follows BAW best practices. 🚀