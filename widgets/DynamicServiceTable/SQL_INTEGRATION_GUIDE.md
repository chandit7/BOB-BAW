# DynamicServiceTable - SQL Integration Guide

## Overview

This guide shows how to fetch data from BAW database tables (like `lsw_task`) and convert it to the JSON format expected by the DynamicServiceTable widget.

## BAW SQL Query Results

When you execute SQL queries in BAW, the results come back as TWList objects with XMLElement data. You need to convert this to plain JavaScript objects, then to JSON string.

## Complete Example: LSW_TASK Table

### Step 1: Execute SQL Query

```javascript
// Execute SQL query to fetch tasks
var sqlQuery = "SELECT " +
    "TASK_ID, " +
    "SUBJECT, " +
    "STATUS, " +
    "PRIORITY, " +
    "ASSIGNED_TO, " +
    "DUE_DATE, " +
    "CREATED_DATE " +
    "FROM LSW_TASK " +
    "WHERE STATUS IN ('Received', 'Started') " +
    "ORDER BY PRIORITY DESC, DUE_DATE ASC " +
    "LIMIT ? OFFSET ?";

var pageSize = tw.local.pageSize || 100;
var offset = ((tw.local.currentPage || 1) - 1) * pageSize;

var sqlResult = tw.system.currentProcessInstance.executeSQL(
    sqlQuery,
    [pageSize, offset]
);

// Get total count for pagination
var countQuery = "SELECT COUNT(*) as total FROM LSW_TASK WHERE STATUS IN ('Received', 'Started')";
var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
var totalRecords = countResult.rows[0].total;
```

### Step 2: Convert XMLElement to JavaScript Objects

BAW SQL results contain XMLElement objects. Here's how to convert them:

```javascript
// Helper function to convert XMLElement to plain value
function xmlToValue(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return null;
    }
    
    // XMLElement has a text property that contains the actual value
    if (xmlElement.text !== undefined && xmlElement.text !== null) {
        return xmlElement.text;
    }
    
    // Fallback to string conversion
    return String(xmlElement);
}

// Helper function to convert XMLElement date to ISO string
function xmlDateToISO(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return null;
    }
    
    try {
        // XMLElement date can be converted to JavaScript Date
        var dateValue = new Date(xmlElement.text || xmlElement);
        return dateValue.toISOString().split('T')[0]; // Return YYYY-MM-DD
    } catch (e) {
        return xmlElement.text || String(xmlElement);
    }
}

// Convert SQL result rows to plain JavaScript objects
var dataRows = [];
for (var i = 0; i < sqlResult.rows.length; i++) {
    var row = sqlResult.rows[i];
    
    var dataRow = {
        taskId: xmlToValue(row.TASK_ID),
        subject: xmlToValue(row.SUBJECT),
        status: xmlToValue(row.STATUS),
        priority: xmlToValue(row.PRIORITY),
        assignedTo: xmlToValue(row.ASSIGNED_TO),
        dueDate: xmlDateToISO(row.DUE_DATE),
        createdDate: xmlDateToISO(row.CREATED_DATE)
    };
    
    dataRows.push(dataRow);
}
```

### Step 3: Build Table Data Structure

```javascript
// Define columns with formatting
var tableData = {
    columns: [
        {
            field: "taskId",
            header: "Task ID",
            sortable: true,
            width: "100px",
            align: "center",
            type: "number"
        },
        {
            field: "subject",
            header: "Subject",
            sortable: true,
            type: "text"
        },
        {
            field: "status",
            header: "Status",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Received": { label: "Received", color: "blue" },
                "Started": { label: "In Progress", color: "yellow" },
                "Completed": { label: "Completed", color: "green" },
                "Failed": { label: "Failed", color: "red" },
                "Closed": { label: "Closed", color: "gray" }
            })
        },
        {
            field: "priority",
            header: "Priority",
            sortable: true,
            width: "100px",
            align: "center",
            type: "badge",
            badgeMap: JSON.stringify({
                "1": { label: "High", color: "red" },
                "2": { label: "Medium", color: "yellow" },
                "3": { label: "Low", color: "blue" }
            })
        },
        {
            field: "assignedTo",
            header: "Assigned To",
            sortable: true,
            type: "text"
        },
        {
            field: "dueDate",
            header: "Due Date",
            sortable: true,
            type: "date"
        },
        {
            field: "createdDate",
            header: "Created Date",
            sortable: true,
            type: "date"
        }
    ],
    data: dataRows,
    pagination: {
        page: tw.local.currentPage || 1,
        pageSize: pageSize,
        totalRecords: totalRecords
    }
};

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Complete Reusable Function

Here's a complete reusable function you can use in your BAW Script Node:

```javascript
/**
 * Convert BAW SQL result to DynamicServiceTable JSON format
 * @param {Object} sqlResult - BAW SQL query result
 * @param {Array} columnDefs - Column definitions
 * @param {Object} pagination - Pagination info
 * @returns {String} JSON string for DynamicServiceTable
 */
function convertSQLToTableJSON(sqlResult, columnDefs, pagination) {
    // Helper to convert XMLElement to plain value
    function xmlToValue(xmlElement) {
        if (xmlElement === null || xmlElement === undefined) {
            return null;
        }
        if (xmlElement.text !== undefined && xmlElement.text !== null) {
            return xmlElement.text;
        }
        return String(xmlElement);
    }
    
    // Helper to convert XMLElement date to ISO string
    function xmlDateToISO(xmlElement) {
        if (xmlElement === null || xmlElement === undefined) {
            return null;
        }
        try {
            var dateValue = new Date(xmlElement.text || xmlElement);
            return dateValue.toISOString().split('T')[0];
        } catch (e) {
            return xmlElement.text || String(xmlElement);
        }
    }
    
    // Convert rows
    var dataRows = [];
    for (var i = 0; i < sqlResult.rows.length; i++) {
        var row = sqlResult.rows[i];
        var dataRow = {};
        
        // Convert each column
        for (var j = 0; j < columnDefs.length; j++) {
            var colDef = columnDefs[j];
            var sqlColumnName = colDef.sqlColumn || colDef.field.toUpperCase();
            var value = row[sqlColumnName];
            
            // Convert based on type
            if (colDef.type === "date") {
                dataRow[colDef.field] = xmlDateToISO(value);
            } else {
                dataRow[colDef.field] = xmlToValue(value);
            }
        }
        
        dataRows.push(dataRow);
    }
    
    // Build table data
    var tableData = {
        columns: columnDefs,
        data: dataRows,
        pagination: pagination
    };
    
    return JSON.stringify(tableData);
}

// Usage example
var columnDefs = [
    {
        field: "taskId",
        sqlColumn: "TASK_ID",
        header: "Task ID",
        sortable: true,
        width: "100px",
        align: "center",
        type: "number"
    },
    {
        field: "subject",
        sqlColumn: "SUBJECT",
        header: "Subject",
        sortable: true,
        type: "text"
    },
    {
        field: "status",
        sqlColumn: "STATUS",
        header: "Status",
        sortable: true,
        type: "badge",
        badgeMap: JSON.stringify({
            "Received": { label: "Received", color: "blue" },
            "Started": { label: "In Progress", color: "yellow" },
            "Completed": { label: "Completed", color: "green" }
        })
    }
];

var pagination = {
    page: tw.local.currentPage || 1,
    pageSize: tw.local.pageSize || 100,
    totalRecords: totalRecords
};

tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, pagination);
```

## Handling Different Data Types

### String/Text Fields
```javascript
{
    field: "name",
    sqlColumn: "NAME",
    header: "Name",
    type: "text"
}
// Conversion: xmlToValue(row.NAME)
```

### Number Fields
```javascript
{
    field: "amount",
    sqlColumn: "AMOUNT",
    header: "Amount",
    type: "number"
}
// Conversion: xmlToValue(row.AMOUNT) - will be string, widget converts to number
```

### Currency Fields
```javascript
{
    field: "salary",
    sqlColumn: "SALARY",
    header: "Salary",
    type: "currency"
}
// Conversion: parseFloat(xmlToValue(row.SALARY))
```

### Date Fields
```javascript
{
    field: "hireDate",
    sqlColumn: "HIRE_DATE",
    header: "Hire Date",
    type: "date"
}
// Conversion: xmlDateToISO(row.HIRE_DATE)
```

### Boolean Fields
```javascript
{
    field: "active",
    sqlColumn: "IS_ACTIVE",
    header: "Active",
    type: "boolean"
}
// Conversion: xmlToValue(row.IS_ACTIVE) === "1" or === "true"
```

## Server-Side Pagination Example

```javascript
// Get pagination parameters
var currentPage = tw.local.currentPage || 1;
var pageSize = tw.local.pageSize || 100;
var sortColumn = tw.local.sortColumn || "TASK_ID";
var sortDirection = tw.local.sortDirection || "ASC";

// Calculate offset
var offset = (currentPage - 1) * pageSize;

// Build dynamic SQL with sorting
var sqlQuery = "SELECT " +
    "TASK_ID, SUBJECT, STATUS, PRIORITY, ASSIGNED_TO, DUE_DATE " +
    "FROM LSW_TASK " +
    "WHERE STATUS IN ('Received', 'Started') " +
    "ORDER BY " + sortColumn + " " + sortDirection + " " +
    "LIMIT ? OFFSET ?";

// Execute query
var sqlResult = tw.system.currentProcessInstance.executeSQL(
    sqlQuery,
    [pageSize, offset]
);

// Get total count
var countQuery = "SELECT COUNT(*) as total FROM LSW_TASK WHERE STATUS IN ('Received', 'Started')";
var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
var totalRecords = xmlToValue(countResult.rows[0].total);

// Convert to table JSON
tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, {
    page: currentPage,
    pageSize: pageSize,
    totalRecords: parseInt(totalRecords, 10)
});
```

## Handling Sort Events

When user clicks a column header, the widget fires an `onSort` event. Handle it like this:

```javascript
// In your onSort event handler
tw.local.sortColumn = event.column; // e.g., "taskId"
tw.local.sortDirection = event.direction; // "ASC" or "DESC"

// Map widget field names to SQL column names
var fieldToSqlColumn = {
    "taskId": "TASK_ID",
    "subject": "SUBJECT",
    "status": "STATUS",
    "priority": "PRIORITY",
    "assignedTo": "ASSIGNED_TO",
    "dueDate": "DUE_DATE"
};

var sqlColumn = fieldToSqlColumn[event.column] || "TASK_ID";

// Re-execute query with new sort order
// ... (use sqlColumn in ORDER BY clause)
```

## Handling Page Change Events

```javascript
// In your onPageChange event handler
tw.local.currentPage = event.page;
tw.local.pageSize = event.pageSize;

// Re-execute query with new page
// ... (calculate new offset and re-query)
```

## Common LSW Tables

### LSW_TASK (Tasks)
```javascript
var columnDefs = [
    { field: "taskId", sqlColumn: "TASK_ID", header: "Task ID", type: "number" },
    { field: "subject", sqlColumn: "SUBJECT", header: "Subject", type: "text" },
    { field: "status", sqlColumn: "STATUS", header: "Status", type: "badge" },
    { field: "priority", sqlColumn: "PRIORITY", header: "Priority", type: "badge" },
    { field: "assignedTo", sqlColumn: "ASSIGNED_TO", header: "Assigned To", type: "text" },
    { field: "dueDate", sqlColumn: "DUE_DATE", header: "Due Date", type: "date" }
];
```

### LSW_BPD_INSTANCE (Process Instances)
```javascript
var columnDefs = [
    { field: "instanceId", sqlColumn: "BPD_INSTANCE_ID", header: "Instance ID", type: "number" },
    { field: "processName", sqlColumn: "NAME", header: "Process Name", type: "text" },
    { field: "status", sqlColumn: "EXECUTION_STATUS", header: "Status", type: "badge" },
    { field: "startDate", sqlColumn: "CREATION_TIME", header: "Started", type: "date" },
    { field: "endDate", sqlColumn: "CLOSE_TIME", header: "Completed", type: "date" }
];
```

### LSW_TASK_NARR (Task Comments)
```javascript
var columnDefs = [
    { field: "taskId", sqlColumn: "TASK_ID", header: "Task ID", type: "number" },
    { field: "comment", sqlColumn: "COMMENT_TEXT", header: "Comment", type: "text" },
    { field: "author", sqlColumn: "USER_ID", header: "Author", type: "text" },
    { field: "timestamp", sqlColumn: "CREATE_TIME", header: "Date", type: "date" }
];
```

## Performance Tips

1. **Use LIMIT/OFFSET**: Always paginate at the database level
2. **Index Sort Columns**: Ensure columns used in ORDER BY are indexed
3. **Cache Total Count**: Store total record count to avoid repeated COUNT queries
4. **Minimize Columns**: Only SELECT columns you need to display
5. **Use WHERE Clauses**: Filter data at database level, not in JavaScript

## Troubleshooting

### Issue: XMLElement shows as "[object Object]"

**Solution**: Use `xmlToValue()` helper function to extract text value:
```javascript
var value = xmlToValue(row.COLUMN_NAME);
```

### Issue: Dates not formatting correctly

**Solution**: Use `xmlDateToISO()` helper to convert XMLElement dates:
```javascript
var dateValue = xmlDateToISO(row.DATE_COLUMN);
```

### Issue: Numbers showing as strings

**Solution**: The widget handles this automatically. Just ensure column type is "number" or "currency":
```javascript
{ field: "amount", type: "currency" }
```

### Issue: NULL values causing errors

**Solution**: The `xmlToValue()` function handles nulls. Widget displays "—" for null values.

## Complete Working Example

See the complete working example in the next section that you can copy directly into your BAW Script Node.