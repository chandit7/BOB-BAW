# DynamicServiceTable Widget - Event Handler Documentation

## Overview
The DynamicServiceTable widget provides comprehensive event handling for user interactions including sorting, pagination, row selection, and data refresh. All events are designed to trigger server-side operations through the Heritage Service Flow.

## Event Architecture

All widget events follow this pattern:
1. User performs action (click sort, change page, etc.)
2. Widget fires boundary event with parameters
3. CSHS event listener receives parameters
4. CSHS calls DynamicTable_SF service flow
5. Service flow executes SQL and returns new TableData
6. Widget re-renders with new data

## Events

### onSort

**Description**: Fired when a user clicks on a sortable column header.

**Trigger**: Column header click (only if column.sortable = true)

**Parameters**:
```javascript
{
  page: 1,              // Always reset to page 1 on sort
  pageSize: 100,        // Current page size
  sortColumn: "taskId", // Field name to sort by
  sortDirection: "ASC"  // "ASC" or "DESC"
}
```

**Behavior**:
- First click on column: Sort ASC
- Second click on same column: Sort DESC
- Click on different column: Sort ASC on new column
- Always resets to page 1

**CSHS Handler Example**:
```javascript
me.context.element.addEventListener('onSort', function(evt) {
  var params = evt.detail;
  tw.local.queryParams.pageNumber = params.page;
  tw.local.queryParams.pageSize = params.pageSize;
  tw.local.queryParams.sortColumn = params.sortColumn;
  tw.local.queryParams.sortDirection = params.sortDirection;
  tw.local.queryParams.sqlTemplate = tw.local.reportConfig.sqlTemplate;
  tw.local.queryParams.columns = tw.local.reportConfig.columns;
  
  // Call service flow
  tw.local.callService('DynamicTable_SF');
});
```

---

### onPageChange

**Description**: Fired when user clicks Previous or Next page buttons.

**Trigger**: Previous/Next button click

**Parameters**:
```javascript
{
  page: 2,              // New page number
  pageSize: 100,        // Current page size
  sortColumn: "taskId", // Current sort column
  sortDirection: "ASC", // Current sort direction
  direction: "next"     // "next" or "prev"
}
```

**CSHS Handler Example**:
```javascript
me.context.element.addEventListener('onPageChange', function(evt) {
  var params = evt.detail;
  tw.local.queryParams.pageNumber = params.page;
  tw.local.queryParams.pageSize = params.pageSize;
  tw.local.queryParams.sortColumn = params.sortColumn;
  tw.local.queryParams.sortDirection = params.sortDirection;
  tw.local.queryParams.offset = (params.page - 1) * params.pageSize;
  tw.local.queryParams.sqlTemplate = tw.local.reportConfig.sqlTemplate;
  tw.local.queryParams.columns = tw.local.reportConfig.columns;
  
  tw.local.callService('DynamicTable_SF');
});
```

---

### onPageSizeChange

**Description**: Fired when user changes the "Rows per page" dropdown.

**Trigger**: Page size dropdown change

**Parameters**:
```javascript
{
  page: 1,              // Always reset to page 1
  pageSize: 50,         // New page size (10, 25, 50, 100, 250, 500)
  sortColumn: "taskId", // Current sort column
  sortDirection: "ASC"  // Current sort direction
}
```

**Behavior**:
- Always resets to page 1 when page size changes
- Maintains current sort column and direction

**CSHS Handler Example**:
```javascript
me.context.element.addEventListener('onPageSizeChange', function(evt) {
  var params = evt.detail;
  tw.local.queryParams.pageNumber = 1; // Reset to first page
  tw.local.queryParams.pageSize = params.pageSize;
  tw.local.queryParams.sortColumn = params.sortColumn;
  tw.local.queryParams.sortDirection = params.sortDirection;
  tw.local.queryParams.offset = 0;
  tw.local.queryParams.sqlTemplate = tw.local.reportConfig.sqlTemplate;
  tw.local.queryParams.columns = tw.local.reportConfig.columns;
  
  tw.local.callService('DynamicTable_SF');
});
```

---

### onRowSelect

**Description**: Fired when user clicks on a table row (if enableRowSelection is true).

**Trigger**: Row click or Enter/Space key on focused row

**Parameters**:
```javascript
{
  row: {                // Complete row data object
    taskId: 10001,
    taskName: "Review Claim",
    status: "OPEN"
  },
  index: 0,             // Row index within current page (0-based)
  page: 1               // Current page number
}
```

**Use Cases**:
- Navigate to detail view
- Open modal with row details
- Update selection state
- Trigger workflow action

**CSHS Handler Example**:
```javascript
me.context.element.addEventListener('onRowSelect', function(evt) {
  var params = evt.detail;
  
  // Store selected row
  tw.local.selectedRow = params.row;
  tw.local.selectedRowIndex = params.index;
  
  // Navigate to detail view
  if (params.row.taskId) {
    tw.system.navigateTo("TaskDetailView", {
      taskId: params.row.taskId
    });
  }
});
```

---

### onRefresh

**Description**: Fired when user clicks the refresh button.

**Trigger**: Refresh button click

**Parameters**:
```javascript
{
  page: 1,              // Current page number
  pageSize: 100,        // Current page size
  sortColumn: "taskId", // Current sort column
  sortDirection: "ASC"  // Current sort direction
}
```

**Behavior**:
- Maintains current page, sort, and page size
- Re-executes query to get fresh data

**CSHS Handler Example**:
```javascript
me.context.element.addEventListener('onRefresh', function(evt) {
  var params = evt.detail;
  tw.local.queryParams.pageNumber = params.page;
  tw.local.queryParams.pageSize = params.pageSize;
  tw.local.queryParams.sortColumn = params.sortColumn;
  tw.local.queryParams.sortDirection = params.sortDirection;
  tw.local.queryParams.offset = (params.page - 1) * params.pageSize;
  tw.local.queryParams.sqlTemplate = tw.local.reportConfig.sqlTemplate;
  tw.local.queryParams.columns = tw.local.reportConfig.columns;
  
  tw.local.callService('DynamicTable_SF');
});
```

---

## Complete CSHS Integration Example

### CSHS Variables Setup

```javascript
// In CSHS variable declarations
tw.local.reportConfig = {
  title: "Task Report",
  defaultSortColumn: "taskId",
  defaultSortDirection: "ASC",
  defaultPageSize: 100,
  columns: [ /* column definitions */ ],
  sqlTemplate: "SELECT ... FROM ... ORDER BY :sortColumn :sortDirection ..."
};

tw.local.queryParams = {
  pageNumber: 1,
  pageSize: 100,
  sortColumn: "taskId",
  sortDirection: "ASC",
  offset: 0,
  sqlTemplate: "",
  columns: []
};

tw.local.tableData = null; // Bound to widget
```

### CSHS load() Event

```javascript
function load(params) {
  // Set report configuration
  tw.local.reportConfig = {
    title: "Task Report",
    defaultSortColumn: "taskId",
    defaultSortDirection: "ASC",
    defaultPageSize: 100,
    columns: [
      { field: "taskId", header: "Task ID", sortable: true, width: "100px", type: "number" },
      { field: "taskName", header: "Task Name", sortable: true },
      { field: "status", header: "Status", sortable: false, type: "badge",
        badgeMap: { "OPEN": "blue", "CLOSED": "green", "FAILED": "red" }
      }
    ],
    sqlTemplate:
      "SELECT T.TASK_ID AS taskId, T.TASK_NAME AS taskName, T.STATUS AS status\n" +
      "FROM LSW_TASK T\n" +
      "ORDER BY :sortColumn :sortDirection\n" +
      "OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY"
  };
  
  // Wire all events to same handler
  var element = me.context.element;
  
  function handleTableEvent(evt) {
    var params = evt.detail;
    tw.local.queryParams.pageNumber = params.page;
    tw.local.queryParams.pageSize = params.pageSize;
    tw.local.queryParams.sortColumn = params.sortColumn;
    tw.local.queryParams.sortDirection = params.sortDirection;
    tw.local.queryParams.offset = (params.page - 1) * params.pageSize;
    tw.local.queryParams.sqlTemplate = tw.local.reportConfig.sqlTemplate;
    tw.local.queryParams.columns = tw.local.reportConfig.columns;
    
    tw.local.callService('DynamicTable_SF');
  }
  
  element.addEventListener('onSort', handleTableEvent);
  element.addEventListener('onPageChange', handleTableEvent);
  element.addEventListener('onPageSizeChange', handleTableEvent);
  element.addEventListener('onRefresh', handleTableEvent);
  
  // Row selection handler
  element.addEventListener('onRowSelect', function(evt) {
    tw.local.selectedRow = evt.detail.row;
    // Handle row selection (navigate, open modal, etc.)
  });
  
  // Initial load
  handleTableEvent({
    detail: {
      page: 1,
      pageSize: tw.local.reportConfig.defaultPageSize,
      sortColumn: tw.local.reportConfig.defaultSortColumn,
      sortDirection: tw.local.reportConfig.defaultSortDirection
    }
  });
}
```

## Event Flow Diagram

```
User Action → Widget Event → CSHS Handler → Service Flow → SQL Execution → XML to JSON → tableData Binding → Widget Re-render
```

## Best Practices

1. **Unified Handler**: Use a single handler function for sort, page, and refresh events
2. **Loading State**: Set `isLoading` binding to true before service call
3. **Error Handling**: Wrap service calls in try-catch blocks
4. **Debouncing**: Not needed - events are user-triggered, not automatic
5. **State Management**: Store current page/sort in CSHS variables for consistency
6. **Row Selection**: Use for navigation or detail views, not for bulk operations

## Performance Considerations

- Events trigger server calls - ensure service flow is optimized
- COUNT(*) query can be cached for session to reduce DB load
- Use DB indexes on all sortable columns
- Limit page size to 500 maximum for performance

## Made with Bob