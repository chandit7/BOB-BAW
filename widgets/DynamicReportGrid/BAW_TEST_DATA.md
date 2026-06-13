# DynamicReportGrid - BAW Test Data

This document provides complete test data for the DynamicReportGrid widget in IBM Business Automation Workflow.

## Business Objects Required

Before testing, ensure these business objects are created in your BAW toolkit:
- **GridColumn** - Column definition
- **GridDataResult** - Server response with pagination
- **GridLabels** - UI labels for internationalization

## Test Scenario 1: Employee Directory

### Column Configuration (GridColumn List)
```javascript
[
  {
    "field": "employeeId",
    "label": "Employee ID",
    "dataType": "string",
    "width": "120px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "fullName",
    "label": "Full Name",
    "dataType": "string",
    "width": "200px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "department",
    "label": "Department",
    "dataType": "string",
    "width": "150px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "position",
    "label": "Position",
    "dataType": "string",
    "width": "180px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "hireDate",
    "label": "Hire Date",
    "dataType": "date",
    "formatter": "date",
    "width": "120px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "salary",
    "label": "Annual Salary",
    "dataType": "currency",
    "formatter": "currency",
    "width": "140px",
    "sortable": true,
    "align": "right"
  },
  {
    "field": "status",
    "label": "Status",
    "dataType": "string",
    "width": "100px",
    "sortable": true,
    "align": "center"
  }
]
```

### Sample Data Response (GridDataResult)
```javascript
{
  "rows": [
    {
      "employeeId": "EMP001",
      "fullName": "John Smith",
      "department": "Engineering",
      "position": "Senior Software Engineer",
      "hireDate": "2020-03-15",
      "salary": 95000,
      "status": "success"
    },
    {
      "employeeId": "EMP002",
      "fullName": "Sarah Johnson",
      "department": "Marketing",
      "position": "Marketing Manager",
      "hireDate": "2019-07-22",
      "salary": 87000,
      "status": "success"
    },
    {
      "employeeId": "EMP003",
      "fullName": "Michael Chen",
      "department": "Engineering",
      "position": "DevOps Engineer",
      "hireDate": "2021-01-10",
      "salary": 82000,
      "status": "warning"
    },
    {
      "employeeId": "EMP004",
      "fullName": "Emily Davis",
      "department": "Human Resources",
      "position": "HR Specialist",
      "hireDate": "2018-11-05",
      "salary": 68000,
      "status": "success"
    },
    {
      "employeeId": "EMP005",
      "fullName": "Robert Wilson",
      "department": "Sales",
      "position": "Sales Director",
      "hireDate": "2017-04-18",
      "salary": 105000,
      "status": "success"
    }
  ],
  "totalRows": 247,
  "currentPage": 1,
  "pageSize": 25,
  "sortColumn": "fullName",
  "sortDirection": "ASC",
  "executionTime": 45
}
```

### Widget Configuration
```javascript
{
  "columns": [/* GridColumn array from above */],
  "pageSize": 25,
  "pageSizeOptions": [10, 25, 50, 100],
  "defaultSortColumn": "fullName",
  "defaultSortDirection": "ASC",
  "size": "medium",
  "showStatusColumn": true,
  "statusColumnField": "status",
  "enableKeyboardNav": true,
  "loadingText": "Loading employees...",
  "errorText": "Failed to load employee data",
  "noDataText": "No employees found",
  "autoRefresh": false
}
```

---

## Test Scenario 2: Insurance Claims

### Column Configuration (GridColumn List)
```javascript
[
  {
    "field": "claimId",
    "label": "Claim ID",
    "dataType": "string",
    "width": "130px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "policyNumber",
    "label": "Policy Number",
    "dataType": "string",
    "width": "140px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "claimant",
    "label": "Claimant Name",
    "dataType": "string",
    "width": "180px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "claimType",
    "label": "Claim Type",
    "dataType": "string",
    "width": "150px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "submittedDate",
    "label": "Submitted",
    "dataType": "date",
    "formatter": "date",
    "width": "120px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "claimAmount",
    "label": "Claim Amount",
    "dataType": "currency",
    "formatter": "currency",
    "width": "140px",
    "sortable": true,
    "align": "right"
  },
  {
    "field": "approvedAmount",
    "label": "Approved",
    "dataType": "currency",
    "formatter": "currency",
    "width": "140px",
    "sortable": true,
    "align": "right"
  },
  {
    "field": "status",
    "label": "Status",
    "dataType": "string",
    "width": "120px",
    "sortable": true,
    "align": "center"
  }
]
```

### Sample Data Response (GridDataResult)
```javascript
{
  "rows": [
    {
      "claimId": "CLM-2024-001234",
      "policyNumber": "POL-987654",
      "claimant": "Jennifer Martinez",
      "claimType": "Auto Collision",
      "submittedDate": "2024-01-15",
      "claimAmount": 8500.00,
      "approvedAmount": 7800.00,
      "status": "success"
    },
    {
      "claimId": "CLM-2024-001235",
      "policyNumber": "POL-876543",
      "claimant": "David Thompson",
      "claimType": "Property Damage",
      "submittedDate": "2024-01-16",
      "claimAmount": 15000.00,
      "approvedAmount": 0.00,
      "status": "warning"
    },
    {
      "claimId": "CLM-2024-001236",
      "policyNumber": "POL-765432",
      "claimant": "Lisa Anderson",
      "claimType": "Medical",
      "submittedDate": "2024-01-17",
      "claimAmount": 3200.00,
      "approvedAmount": 3200.00,
      "status": "success"
    },
    {
      "claimId": "CLM-2024-001237",
      "policyNumber": "POL-654321",
      "claimant": "James Wilson",
      "claimType": "Theft",
      "submittedDate": "2024-01-18",
      "claimAmount": 12000.00,
      "approvedAmount": 0.00,
      "status": "error"
    },
    {
      "claimId": "CLM-2024-001238",
      "policyNumber": "POL-543210",
      "claimant": "Maria Garcia",
      "claimType": "Auto Collision",
      "submittedDate": "2024-01-19",
      "claimAmount": 6700.00,
      "approvedAmount": 0.00,
      "status": "info"
    }
  ],
  "totalRows": 1523,
  "currentPage": 1,
  "pageSize": 25,
  "sortColumn": "submittedDate",
  "sortDirection": "DESC",
  "executionTime": 62
}
```

---

## Test Scenario 3: Sales Orders

### Column Configuration (GridColumn List)
```javascript
[
  {
    "field": "orderId",
    "label": "Order ID",
    "dataType": "string",
    "width": "120px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "customerName",
    "label": "Customer",
    "dataType": "string",
    "width": "200px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "orderDate",
    "label": "Order Date",
    "dataType": "date",
    "formatter": "date",
    "width": "120px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "shipDate",
    "label": "Ship Date",
    "dataType": "date",
    "formatter": "date",
    "width": "120px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "totalAmount",
    "label": "Total",
    "dataType": "currency",
    "formatter": "currency",
    "width": "130px",
    "sortable": true,
    "align": "right"
  },
  {
    "field": "itemCount",
    "label": "Items",
    "dataType": "number",
    "width": "80px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "status",
    "label": "Status",
    "dataType": "string",
    "width": "120px",
    "sortable": true,
    "align": "center"
  }
]
```

### Sample Data Response (GridDataResult)
```javascript
{
  "rows": [
    {
      "orderId": "ORD-2024-5001",
      "customerName": "Acme Corporation",
      "orderDate": "2024-01-20",
      "shipDate": "2024-01-22",
      "totalAmount": 45678.90,
      "itemCount": 12,
      "status": "success"
    },
    {
      "orderId": "ORD-2024-5002",
      "customerName": "Global Industries Ltd",
      "orderDate": "2024-01-20",
      "shipDate": null,
      "totalAmount": 23456.78,
      "itemCount": 8,
      "status": "warning"
    },
    {
      "orderId": "ORD-2024-5003",
      "customerName": "Tech Solutions Inc",
      "orderDate": "2024-01-21",
      "shipDate": "2024-01-23",
      "totalAmount": 67890.12,
      "itemCount": 15,
      "status": "success"
    },
    {
      "orderId": "ORD-2024-5004",
      "customerName": "Retail Partners Co",
      "orderDate": "2024-01-21",
      "shipDate": null,
      "totalAmount": 12345.67,
      "itemCount": 5,
      "status": "info"
    },
    {
      "orderId": "ORD-2024-5005",
      "customerName": "Manufacturing Plus",
      "orderDate": "2024-01-22",
      "shipDate": null,
      "totalAmount": 89012.34,
      "itemCount": 20,
      "status": "error"
    }
  ],
  "totalRows": 3847,
  "currentPage": 1,
  "pageSize": 25,
  "sortColumn": "orderDate",
  "sortDirection": "DESC",
  "executionTime": 38
}
```

---

## Test Scenario 4: Project Tasks

### Column Configuration (GridColumn List)
```javascript
[
  {
    "field": "taskId",
    "label": "Task ID",
    "dataType": "string",
    "width": "100px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "taskName",
    "label": "Task Name",
    "dataType": "string",
    "width": "250px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "assignee",
    "label": "Assigned To",
    "dataType": "string",
    "width": "150px",
    "sortable": true,
    "align": "left"
  },
  {
    "field": "priority",
    "label": "Priority",
    "dataType": "string",
    "width": "100px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "dueDate",
    "label": "Due Date",
    "dataType": "date",
    "formatter": "date",
    "width": "120px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "completionPercent",
    "label": "Progress",
    "dataType": "number",
    "formatter": "percentage",
    "width": "100px",
    "sortable": true,
    "align": "center"
  },
  {
    "field": "status",
    "label": "Status",
    "dataType": "string",
    "width": "120px",
    "sortable": true,
    "align": "center"
  }
]
```

### Sample Data Response (GridDataResult)
```javascript
{
  "rows": [
    {
      "taskId": "TASK-101",
      "taskName": "Design database schema",
      "assignee": "Alice Cooper",
      "priority": "High",
      "dueDate": "2024-02-01",
      "completionPercent": 100,
      "status": "success"
    },
    {
      "taskId": "TASK-102",
      "taskName": "Implement user authentication",
      "assignee": "Bob Miller",
      "priority": "High",
      "dueDate": "2024-02-05",
      "completionPercent": 75,
      "status": "warning"
    },
    {
      "taskId": "TASK-103",
      "taskName": "Create API documentation",
      "assignee": "Carol White",
      "priority": "Medium",
      "dueDate": "2024-02-10",
      "completionPercent": 45,
      "status": "info"
    },
    {
      "taskId": "TASK-104",
      "taskName": "Write unit tests",
      "assignee": "David Brown",
      "priority": "High",
      "dueDate": "2024-02-03",
      "completionPercent": 20,
      "status": "error"
    },
    {
      "taskId": "TASK-105",
      "taskName": "Deploy to staging environment",
      "assignee": "Eve Johnson",
      "priority": "Low",
      "dueDate": "2024-02-15",
      "completionPercent": 0,
      "status": "info"
    }
  ],
  "totalRows": 156,
  "currentPage": 1,
  "pageSize": 25,
  "sortColumn": "dueDate",
  "sortDirection": "ASC",
  "executionTime": 28
}
```

---

## UI Labels Configuration (GridLabels)

### Default English Labels
```javascript
{
  "firstPage": "First",
  "previousPage": "Previous",
  "nextPage": "Next",
  "lastPage": "Last",
  "pageInfo": "Page {current} of {total}",
  "rowsInfo": "Showing {start}-{end} of {total} rows",
  "rowsPerPage": "Rows per page:",
  "sortAscending": "Sort ascending",
  "sortDescending": "Sort descending"
}
```

### Spanish Labels (Example)
```javascript
{
  "firstPage": "Primera",
  "previousPage": "Anterior",
  "nextPage": "Siguiente",
  "lastPage": "Última",
  "pageInfo": "Página {current} de {total}",
  "rowsInfo": "Mostrando {start}-{end} de {total} filas",
  "rowsPerPage": "Filas por página:",
  "sortAscending": "Ordenar ascendente",
  "sortDescending": "Ordenar descendente"
}
```

---

## BAW Service Flow Example

### Mock Service for Testing (JavaScript)
```javascript
// Service Input Variables:
// - currentPage (Integer)
// - pageSize (Integer)
// - sortColumn (String)
// - sortDirection (String)

// Service Output Variable: gridData (GridDataResult)

// Mock implementation for testing
var gridData = {
  rows: [],
  totalRows: 247,
  currentPage: tw.local.currentPage || 1,
  pageSize: tw.local.pageSize || 25,
  sortColumn: tw.local.sortColumn || "fullName",
  sortDirection: tw.local.sortDirection || "ASC",
  executionTime: 45
};

// Generate sample rows based on page
var startIndex = (gridData.currentPage - 1) * gridData.pageSize;
for (var i = 0; i < gridData.pageSize && (startIndex + i) < gridData.totalRows; i++) {
  var rowNum = startIndex + i + 1;
  gridData.rows.push({
    employeeId: "EMP" + String(rowNum).padStart(3, '0'),
    fullName: "Employee " + rowNum,
    department: ["Engineering", "Marketing", "Sales", "HR"][rowNum % 4],
    position: "Position " + rowNum,
    hireDate: new Date(2020, rowNum % 12, (rowNum % 28) + 1).toISOString().split('T')[0],
    salary: 50000 + (rowNum * 1000),
    status: ["success", "warning", "info", "error"][rowNum % 4]
  });
}

tw.local.gridData = gridData;
```

---

## Testing Checklist

### Basic Functionality
- [ ] Grid displays with correct columns
- [ ] Data loads on initial render
- [ ] Pagination controls work (First, Previous, Next, Last)
- [ ] Page size selector changes rows per page
- [ ] Column sorting works (click headers)
- [ ] Status column displays color-coded badges
- [ ] Loading indicator appears during data fetch
- [ ] Error message displays on service failure
- [ ] No data message displays when rows array is empty

### Keyboard Navigation
- [ ] Tab key moves between interactive elements
- [ ] Arrow keys navigate grid cells
- [ ] Enter/Space activates sort on column headers
- [ ] Page Up/Down navigate pages

### Edge Cases
- [ ] Empty result set (totalRows = 0)
- [ ] Single page of data (totalRows < pageSize)
- [ ] Large datasets (totalRows > 10000)
- [ ] Null/undefined values in data
- [ ] Very long text in cells
- [ ] Special characters in data

### Performance
- [ ] Grid renders within 2 seconds
- [ ] Pagination response < 500ms
- [ ] No memory leaks on repeated operations
- [ ] Smooth scrolling with large datasets

---

## Common Issues and Solutions

### Issue: Business Objects Not Found
**Solution:** Ensure GridColumn, GridDataResult, and GridLabels are created in your toolkit before using the widget.

### Issue: Data Not Displaying
**Solution:** Verify the service returns a GridDataResult object with the correct structure (rows array, totalRows, currentPage, pageSize).

### Issue: Sorting Not Working
**Solution:** Ensure your service accepts sortColumn and sortDirection parameters and returns sorted data.

### Issue: Status Colors Not Showing
**Solution:** Set `showStatusColumn: true` and ensure your data has a status field with values: "success", "warning", "error", or "info".

---

## Next Steps

1. Import `reportUi_1.0.2.twx` into BAW
2. Create a test coach with DynamicReportGrid widget
3. Create a service flow that returns GridDataResult
4. Configure widget with one of the test scenarios above
5. Bind widget to service flow using fetchData event
6. Test all pagination and sorting features