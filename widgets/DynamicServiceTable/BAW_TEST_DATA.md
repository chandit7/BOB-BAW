# DynamicServiceTable - BAW Test Data Guide

## Overview

The DynamicServiceTable widget uses a **single String binding** containing JSON data. This approach avoids all BAW type conversion issues by treating the entire payload as text that gets parsed by JavaScript in the browser.

## Key Concept

**BAW sees**: A String variable containing JSON text  
**JavaScript sees**: Parsed JSON object with columns, data, and pagination  
**Result**: Fully dynamic table with no type conversion errors

## JSON Structure

The JSON string must contain three main sections:

```json
{
  "columns": [
    {
      "field": "id",
      "header": "ID",
      "sortable": true,
      "width": "80px",
      "align": "center",
      "type": "number"
    },
    {
      "field": "status",
      "header": "Status",
      "sortable": true,
      "type": "badge",
      "badgeMap": "{\"active\":{\"label\":\"Active\",\"color\":\"green\"},\"inactive\":{\"label\":\"Inactive\",\"color\":\"red\"}}"
    }
  ],
  "data": [
    {
      "id": 1,
      "status": "active",
      "name": "John Doe"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 100,
    "totalRecords": 150
  }
}
```

## Column Types

### Supported Types

1. **text** (default) - Plain text display
2. **number** - Formatted numbers with locale separators
3. **currency** - Dollar amounts with $ symbol and 2 decimals
4. **date** - Formatted date strings
5. **boolean** - Checkmark (✓) or X (✗) icons
6. **badge** - Colored status badges (requires badgeMap)
7. **link** - Clickable hyperlinks

### Badge Configuration

For badge columns, the `badgeMap` must be a **JSON string** (not an object):

```json
{
  "field": "status",
  "type": "badge",
  "badgeMap": "{\"active\":{\"label\":\"Active\",\"color\":\"green\"},\"pending\":{\"label\":\"Pending\",\"color\":\"yellow\"},\"rejected\":{\"label\":\"Rejected\",\"color\":\"red\"}}"
}
```

**Badge Colors**: green, red, yellow, blue, gray

## BAW Setup Instructions

### Step 1: Create String Variable

In your BAW Process/Service:

1. Create a new variable: `tw.local.tableDataJSON`
2. Type: **String**
3. This will hold the entire JSON payload

### Step 2: Build JSON in Script Node

Create a Script Node to build the JSON:

```javascript
// Build the table data structure
var tableData = {
    columns: [
        {
            field: "id",
            header: "Claim ID",
            sortable: true,
            width: "100px",
            align: "center",
            type: "number"
        },
        {
            field: "claimant",
            header: "Claimant Name",
            sortable: true,
            type: "text"
        },
        {
            field: "amount",
            header: "Claim Amount",
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
                "submitted": { label: "Submitted", color: "blue" },
                "approved": { label: "Approved", color: "green" },
                "rejected": { label: "Rejected", color: "red" },
                "pending": { label: "Pending Review", color: "yellow" }
            })
        },
        {
            field: "submittedDate",
            header: "Submitted Date",
            sortable: true,
            type: "date"
        }
    ],
    data: [
        {
            id: 1001,
            claimant: "John Smith",
            amount: 5250.00,
            status: "approved",
            submittedDate: "2024-01-15"
        },
        {
            id: 1002,
            claimant: "Sarah Johnson",
            amount: 12750.50,
            status: "pending",
            submittedDate: "2024-01-16"
        },
        {
            id: 1003,
            claimant: "Michael Brown",
            amount: 3500.00,
            status: "rejected",
            submittedDate: "2024-01-14"
        },
        {
            id: 1004,
            claimant: "Emily Davis",
            amount: 8900.25,
            status: "submitted",
            submittedDate: "2024-01-17"
        },
        {
            id: 1005,
            claimant: "David Wilson",
            amount: 15200.00,
            status: "approved",
            submittedDate: "2024-01-13"
        }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 5
    }
};

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);
```

### Step 3: Add Widget to Coach

1. Drag **DynamicServiceTable** widget onto your coach
2. In the **Data** section, bind to: `tw.local.tableDataJSON`
3. Configure options:
   - **Table Title**: "Claims Dashboard"
   - **Show Refresh Button**: true
   - **Show Record Count**: true
   - **Enable Row Selection**: true
   - **Page Size**: 100

### Step 4: Test the Widget

1. Run the coach
2. Verify the table displays with:
   - Formatted columns
   - Colored status badges
   - Currency formatting
   - Date formatting
   - Pagination controls

## Complete Working Example

Here's a complete Script Node example with all column types:

```javascript
// Sample data with all column types
var tableData = {
    columns: [
        { field: "id", header: "ID", sortable: true, width: "80px", align: "center", type: "number" },
        { field: "name", header: "Name", sortable: true, type: "text" },
        { field: "email", header: "Email", sortable: true, type: "text" },
        { field: "salary", header: "Salary", sortable: true, align: "right", type: "currency" },
        { field: "hireDate", header: "Hire Date", sortable: true, type: "date" },
        { field: "active", header: "Active", sortable: true, align: "center", type: "boolean" },
        { 
            field: "status", 
            header: "Status", 
            sortable: true, 
            type: "badge",
            badgeMap: JSON.stringify({
                "active": { label: "Active", color: "green" },
                "inactive": { label: "Inactive", color: "gray" },
                "pending": { label: "Pending", color: "yellow" }
            })
        }
    ],
    data: [
        {
            id: 1,
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            salary: 75000,
            hireDate: "2020-03-15",
            active: true,
            status: "active"
        },
        {
            id: 2,
            name: "Bob Smith",
            email: "bob.smith@example.com",
            salary: 82000,
            hireDate: "2019-07-22",
            active: true,
            status: "active"
        },
        {
            id: 3,
            name: "Carol White",
            email: "carol.white@example.com",
            salary: 68000,
            hireDate: "2021-01-10",
            active: false,
            status: "inactive"
        },
        {
            id: 4,
            name: "David Brown",
            email: "david.brown@example.com",
            salary: 95000,
            hireDate: "2018-11-05",
            active: true,
            status: "active"
        },
        {
            id: 5,
            name: "Emma Davis",
            email: "emma.davis@example.com",
            salary: 71000,
            hireDate: "2022-02-28",
            active: true,
            status: "pending"
        }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 5
    }
};

// Convert to JSON string and assign to BAW variable
tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Dynamic Data from SQL Query

For real-world scenarios, you'll typically fetch data from a database:

```javascript
// Execute SQL query (example using BAW SQL integration)
var sqlResult = tw.system.currentProcessInstance.executeSQL(
    "SELECT id, name, email, salary, hire_date, active, status FROM employees WHERE department = ?",
    [tw.local.departmentId]
);

// Transform SQL results to table format
var tableData = {
    columns: [
        { field: "id", header: "Employee ID", sortable: true, type: "number" },
        { field: "name", header: "Name", sortable: true, type: "text" },
        { field: "email", header: "Email", sortable: true, type: "text" },
        { field: "salary", header: "Salary", sortable: true, align: "right", type: "currency" },
        { field: "hire_date", header: "Hire Date", sortable: true, type: "date" },
        { field: "active", header: "Active", sortable: true, align: "center", type: "boolean" },
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
    data: [],
    pagination: {
        page: tw.local.currentPage || 1,
        pageSize: tw.local.pageSize || 100,
        totalRecords: sqlResult.totalCount
    }
};

// Map SQL rows to data array
for (var i = 0; i < sqlResult.rows.length; i++) {
    var row = sqlResult.rows[i];
    tableData.data.push({
        id: row.id,
        name: row.name,
        email: row.email,
        salary: row.salary,
        hire_date: row.hire_date,
        active: row.active,
        status: row.status
    });
}

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Event Handling

The widget fires events that you can handle in BAW:

### onSort Event

Fired when user clicks a sortable column header:

```javascript
// In your event handler
var sortColumn = event.column;  // e.g., "name"
var sortDirection = event.direction;  // "ASC" or "DESC"

// Re-fetch data with new sort order
// ... update tw.local.tableDataJSON with sorted data
```

### onPageChange Event

Fired when user navigates pages:

```javascript
// In your event handler
var newPage = event.page;
var pageSize = event.pageSize;

// Fetch data for the new page
// ... update tw.local.tableDataJSON with new page data
```

### onPageSizeChange Event

Fired when user changes rows per page:

```javascript
// In your event handler
var newPageSize = event.pageSize;

// Re-fetch data with new page size
// ... update tw.local.tableDataJSON
```

### onRowSelect Event

Fired when user clicks a row (if enableRowSelection is true):

```javascript
// In your event handler
var selectedRow = event.row;  // The entire row object
var rowIndex = event.index;   // Row index in current page

// Do something with the selected row
tw.local.selectedEmployeeId = selectedRow.id;
```

### onRefresh Event

Fired when user clicks the refresh button:

```javascript
// In your event handler
// Re-fetch data from database
// ... update tw.local.tableDataJSON with fresh data
```

## Troubleshooting

### Issue: Table shows "No data available"

**Solution**: Check that `tw.local.tableDataJSON` contains valid JSON with a `data` array.

```javascript
// Debug: Log the JSON string
console.log("tableDataJSON:", tw.local.tableDataJSON);

// Verify it's not empty
if (!tw.local.tableDataJSON || tw.local.tableDataJSON === "") {
    console.error("tableDataJSON is empty!");
}
```

### Issue: Badges not showing colors

**Solution**: Ensure `badgeMap` is a JSON string, not an object:

```javascript
// WRONG - This won't work
badgeMap: {
    "active": { label: "Active", color: "green" }
}

// CORRECT - Use JSON.stringify()
badgeMap: JSON.stringify({
    "active": { label: "Active", color: "green" }
})
```

### Issue: Currency not formatting

**Solution**: Ensure the column type is "currency" and values are numbers:

```javascript
{
    field: "amount",
    type: "currency",  // Must be "currency"
    align: "right"
}

// Data values must be numbers, not strings
data: [
    { amount: 1234.56 }  // CORRECT
    // { amount: "1234.56" }  // WRONG - string won't format
]
```

### Issue: Dates not formatting

**Solution**: Ensure dates are in ISO format or valid date strings:

```javascript
// Valid date formats
"2024-01-15"           // ISO date
"2024-01-15T10:30:00Z" // ISO datetime
"01/15/2024"           // US format
```

## Performance Tips

1. **Limit data array size**: Send only the current page of data, not all records
2. **Use server-side pagination**: Let the database handle pagination
3. **Minimize column count**: Only include columns users need to see
4. **Cache results**: Store query results in BAW variables to avoid repeated queries

## Summary

The DynamicServiceTable widget provides a robust, type-safe way to display dynamic data in BAW by:

1. Using a single String binding (`tw.local.tableDataJSON`)
2. Building JSON in JavaScript with `JSON.stringify()`
3. Parsing JSON in the widget with `JSON.parse()`
4. Rendering everything dynamically in the browser

This approach eliminates all BAW type conversion issues and provides maximum flexibility for displaying any data structure.