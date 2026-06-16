# DynamicServiceTable - Test Coach with 500 Records

## Overview

This guide provides a complete BAW coach service implementation to test the DynamicServiceTable widget with:
- **500 total records** (generated test data)
- **100 records per page** (5 pages total)
- **Working Prev/Next buttons** with server-side pagination
- **Modern theme** with search enabled
- **Event handlers** for pagination and sorting

---

## BAW Service Structure

### Service Name
`TestDynamicServiceTable500Records`

### Service Type
**Human Service** (for coach-based testing)

---

## Step 1: Create Service Variables

Create the following variables in your BAW Human Service:

| Variable Name | Type | Default Value | Description |
|--------------|------|---------------|-------------|
| `tw.local.tableDataJSON` | String | "" | JSON string for widget binding |
| `tw.local.currentPage` | Integer | 1 | Current page number (1-based) |
| `tw.local.pageSize` | Integer | 100 | Records per page |
| `tw.local.totalRecords` | Integer | 500 | Total number of records |
| `tw.local.allEmployees` | String | "" | Cached all 500 records (JSON array string) |
| `tw.local.sortColumn` | String | "empId" | Current sort column |
| `tw.local.sortDirection` | String | "ASC" | Current sort direction |

---

## Step 2: Create Script Node - "Initialize Data"

**Purpose**: Generate 500 employee records and cache them

**Script Content**:

```javascript
// ============================================================================
// Initialize 500 Employee Records
// ============================================================================

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(array) {
    return array[randomInt(0, array.length - 1)];
}

function randomDate(startDate, endDate) {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    var randomTime = start + Math.random() * (end - start);
    var date = new Date(randomTime);
    return date.toISOString().split('T')[0];
}

function randomAmount(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

function generateEmail(firstName, lastName, domain) {
    return (firstName + "." + lastName + "@" + domain).toLowerCase();
}

function generatePhone() {
    var area = randomInt(200, 999);
    var prefix = randomInt(200, 999);
    var line = randomInt(1000, 9999);
    return "(" + area + ") " + prefix + "-" + line;
}

// ----------------------------------------------------------------------------
// DATA ARRAYS
// ----------------------------------------------------------------------------

var firstNames = [
    "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda",
    "William", "Barbara", "David", "Elizabeth", "Richard", "Susan", "Joseph", "Jessica",
    "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
    "Matthew", "Betty", "Anthony", "Margaret", "Mark", "Sandra", "Donald", "Ashley",
    "Steven", "Kimberly", "Paul", "Emily", "Andrew", "Donna", "Joshua", "Michelle",
    "Kenneth", "Dorothy", "Kevin", "Carol", "Brian", "Amanda", "George", "Melissa",
    "Edward", "Deborah", "Ronald", "Stephanie", "Timothy", "Rebecca", "Jason", "Sharon",
    "Jeffrey", "Laura", "Ryan", "Cynthia", "Jacob", "Kathleen", "Gary", "Amy",
    "Nicholas", "Shirley", "Eric", "Angela", "Jonathan", "Helen", "Stephen", "Anna",
    "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma"
];

var lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell"
];

var departments = [
    "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations",
    "Customer Service", "IT", "Legal", "Product", "Research", "Quality Assurance"
];

var jobTitles = [
    "Software Engineer", "Senior Developer", "Project Manager", "Business Analyst",
    "Sales Representative", "Marketing Manager", "HR Specialist", "Financial Analyst",
    "Operations Manager", "Customer Support", "IT Administrator", "Legal Counsel",
    "Product Manager", "Research Scientist", "QA Engineer", "Data Analyst"
];

var statuses = ["Active", "Inactive", "On Leave", "Pending"];
var emailDomains = ["company.com", "enterprise.com", "business.com", "corp.com"];

var cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle"
];

// ----------------------------------------------------------------------------
// GENERATE 500 RECORDS
// ----------------------------------------------------------------------------

var allEmployees = [];

for (var i = 1; i <= 500; i++) {
    var firstName = randomChoice(firstNames);
    var lastName = randomChoice(lastNames);
    var department = randomChoice(departments);
    var hireYear = randomInt(2015, 2024);
    
    var record = {
        empId: 10000 + i,
        firstName: firstName,
        lastName: lastName,
        fullName: firstName + " " + lastName,
        email: generateEmail(firstName, lastName, randomChoice(emailDomains)),
        phone: generatePhone(),
        department: department,
        jobTitle: randomChoice(jobTitles),
        salary: randomAmount(45000, 150000),
        hireDate: randomDate(hireYear + "-01-01", hireYear + "-12-31"),
        status: randomChoice(statuses),
        city: randomChoice(cities),
        active: randomChoice([true, false, true, true])
    };
    
    allEmployees.push(record);
}

// Cache all employees as JSON string
tw.local.allEmployees = JSON.stringify(allEmployees);

// Initialize pagination variables
tw.local.currentPage = 1;
tw.local.pageSize = 100;
tw.local.totalRecords = 500;
tw.local.sortColumn = "empId";
tw.local.sortDirection = "ASC";

// Log initialization
tw.system.log("Initialized 500 employee records");
tw.system.log("Current page: " + tw.local.currentPage);
tw.system.log("Page size: " + tw.local.pageSize);
```

---

## Step 3: Create Script Node - "Build Table Data"

**Purpose**: Build current page data with pagination

**Script Content**:

```javascript
// ============================================================================
// Build Table Data for Current Page
// ============================================================================

// Parse cached employees
var allEmployees = JSON.parse(tw.local.allEmployees);

// Get pagination parameters
var currentPage = tw.local.currentPage || 1;
var pageSize = tw.local.pageSize || 100;
var sortColumn = tw.local.sortColumn || "empId";
var sortDirection = tw.local.sortDirection || "ASC";

// ----------------------------------------------------------------------------
// SORT DATA
// ----------------------------------------------------------------------------

allEmployees.sort(function(a, b) {
    var aVal = a[sortColumn];
    var bVal = b[sortColumn];
    
    // Handle different data types
    if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
    }
    
    if (sortDirection === "ASC") {
        return aVal < bVal ? -1 : (aVal > bVal ? 1 : 0);
    } else {
        return aVal > bVal ? -1 : (aVal < bVal ? 1 : 0);
    }
});

// ----------------------------------------------------------------------------
// PAGINATE DATA
// ----------------------------------------------------------------------------

var startIndex = (currentPage - 1) * pageSize;
var endIndex = Math.min(startIndex + pageSize, allEmployees.length);

var pageRecords = [];
for (var i = startIndex; i < endIndex; i++) {
    pageRecords.push(allEmployees[i]);
}

// ----------------------------------------------------------------------------
// DEFINE COLUMNS
// ----------------------------------------------------------------------------

var columns = [
    {
        field: "empId",
        header: "Employee ID",
        sortable: true,
        width: "120px",
        align: "center",
        type: "number"
    },
    {
        field: "fullName",
        header: "Name",
        sortable: true,
        type: "text"
    },
    {
        field: "email",
        header: "Email",
        sortable: true,
        type: "text"
    },
    {
        field: "phone",
        header: "Phone",
        sortable: true,
        width: "140px",
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
            "Marketing": { label: "Marketing", color: "yellow" },
            "HR": { label: "HR", color: "gray" },
            "Finance": { label: "Finance", color: "blue" },
            "Operations": { label: "Operations", color: "green" },
            "Customer Service": { label: "Customer Service", color: "yellow" },
            "IT": { label: "IT", color: "blue" },
            "Legal": { label: "Legal", color: "gray" },
            "Product": { label: "Product", color: "green" },
            "Research": { label: "Research", color: "blue" },
            "Quality Assurance": { label: "QA", color: "yellow" }
        })
    },
    {
        field: "jobTitle",
        header: "Job Title",
        sortable: true,
        type: "text"
    },
    {
        field: "salary",
        header: "Salary",
        sortable: true,
        align: "right",
        width: "120px",
        type: "currency"
    },
    {
        field: "hireDate",
        header: "Hire Date",
        sortable: true,
        width: "120px",
        type: "date"
    },
    {
        field: "city",
        header: "City",
        sortable: true,
        type: "text"
    },
    {
        field: "status",
        header: "Status",
        sortable: true,
        width: "120px",
        type: "badge",
        badgeMap: JSON.stringify({
            "Active": { label: "Active", color: "green" },
            "Inactive": { label: "Inactive", color: "gray" },
            "On Leave": { label: "On Leave", color: "yellow" },
            "Pending": { label: "Pending", color: "blue" }
        })
    },
    {
        field: "active",
        header: "Active",
        sortable: true,
        width: "80px",
        align: "center",
        type: "boolean"
    }
];

// ----------------------------------------------------------------------------
// BUILD TABLE DATA
// ----------------------------------------------------------------------------

var tableData = {
    columns: columns,
    data: pageRecords,
    pagination: {
        page: currentPage,
        pageSize: pageSize,
        totalRecords: tw.local.totalRecords
    }
};

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);

// Log current state
tw.system.log("Built table data for page " + currentPage);
tw.system.log("Showing records " + (startIndex + 1) + " to " + endIndex + " of " + tw.local.totalRecords);
tw.system.log("Sort: " + sortColumn + " " + sortDirection);
```

---

## Step 4: Create Coach

### Coach Name
`TestTable500Records`

### Coach Layout

1. **Add DynamicServiceTable Widget**
   - Drag the widget onto the coach
   - Configure as follows:

### Widget Configuration

| Property | Value | Description |
|----------|-------|-------------|
| **Data Binding** | `tw.local.tableDataJSON` | Bind to JSON string variable |
| **title** | "Employee Dashboard - 500 Records" | Table title |
| **styleTheme** | "modern" | Use modern theme |
| **enableSearch** | true | Enable client-side search |
| **showRefresh** | true | Show refresh button |
| **showRecordCount** | true | Show record count |
| **enableRowSelection** | true | Enable row selection |
| **pageSize** | 100 | Rows per page |

---

## Step 5: Create Event Handlers

### Event Handler 1: onPageChange

**Purpose**: Handle Prev/Next button clicks

**Event Configuration**:
- Event: `onPageChange`
- Handler Type: Server Script

**Script Content**:

```javascript
// ============================================================================
// Handle Page Change Event
// ============================================================================

// Get new page from event
var newPage = event.page;
var newPageSize = event.pageSize;

// Update pagination variables
tw.local.currentPage = newPage;
tw.local.pageSize = newPageSize;

// Log page change
tw.system.log("Page changed to: " + newPage);
tw.system.log("Page size: " + newPageSize);

// Rebuild table data will happen in next script node
```

**After Event Handler**: Add a Script Node that calls "Build Table Data" script

---

### Event Handler 2: onSort

**Purpose**: Handle column header clicks for sorting

**Event Configuration**:
- Event: `onSort`
- Handler Type: Server Script

**Script Content**:

```javascript
// ============================================================================
// Handle Sort Event
// ============================================================================

// Get sort parameters from event
var sortColumn = event.column;
var sortDirection = event.direction;

// Update sort variables
tw.local.sortColumn = sortColumn;
tw.local.sortDirection = sortDirection;

// Reset to first page when sorting
tw.local.currentPage = 1;

// Log sort change
tw.system.log("Sort changed to: " + sortColumn + " " + sortDirection);

// Rebuild table data will happen in next script node
```

**After Event Handler**: Add a Script Node that calls "Build Table Data" script

---

### Event Handler 3: onRefresh

**Purpose**: Handle refresh button click

**Event Configuration**:
- Event: `onRefresh`
- Handler Type: Server Script

**Script Content**:

```javascript
// ============================================================================
// Handle Refresh Event
// ============================================================================

// Reset to first page
tw.local.currentPage = 1;

// Log refresh
tw.system.log("Table refreshed");

// Rebuild table data will happen in next script node
```

**After Event Handler**: Add a Script Node that calls "Build Table Data" script

---

### Event Handler 4: onRowSelect

**Purpose**: Handle row selection

**Event Configuration**:
- Event: `onRowSelect`
- Handler Type: Server Script

**Script Content**:

```javascript
// ============================================================================
// Handle Row Select Event
// ============================================================================

// Get selected row data
var selectedRow = event.row;
var rowIndex = event.index;

// Log selection
tw.system.log("Row selected:");
tw.system.log("  Employee ID: " + selectedRow.empId);
tw.system.log("  Name: " + selectedRow.fullName);
tw.system.log("  Department: " + selectedRow.department);
tw.system.log("  Row Index: " + rowIndex);

// You can store selected row for further processing
// tw.local.selectedEmployee = JSON.stringify(selectedRow);
```

---

## Step 6: Service Flow Diagram

```
[Start]
   ↓
[Initialize Data] (Script Node)
   ↓
[Build Table Data] (Script Node)
   ↓
[TestTable500Records] (Coach)
   ↓
[Event Handlers]
   ├─ onPageChange → [Build Table Data]
   ├─ onSort → [Build Table Data]
   ├─ onRefresh → [Build Table Data]
   └─ onRowSelect → [Log Selection]
   ↓
[End]
```

---

## Testing Instructions

### Test 1: Initial Load
1. Run the Human Service
2. **Expected**: Table displays with 100 records (page 1 of 5)
3. **Verify**: Record count shows "1-100 of 500"

### Test 2: Next Button
1. Click "Next" button
2. **Expected**: Table shows records 101-200 (page 2)
3. **Verify**: Record count shows "101-200 of 500"
4. **Verify**: Prev button is now enabled

### Test 3: Prev Button
1. Click "Prev" button
2. **Expected**: Table shows records 1-100 (page 1)
3. **Verify**: Record count shows "1-100 of 500"
4. **Verify**: Prev button is disabled

### Test 4: Last Page
1. Click "Next" button 4 times
2. **Expected**: Table shows records 401-500 (page 5)
3. **Verify**: Record count shows "401-500 of 500"
4. **Verify**: Next button is disabled

### Test 5: Sorting
1. Click "Name" column header
2. **Expected**: Table sorts by name (A-Z)
3. **Expected**: Returns to page 1
4. Click "Name" header again
5. **Expected**: Table sorts by name (Z-A)

### Test 6: Search
1. Type "engineering" in search box
2. **Expected**: Table filters to show only Engineering department
3. **Verify**: Record count shows "X of 500 (filtered)"
4. Press ESC key
5. **Expected**: Search clears, all records shown

### Test 7: Row Selection
1. Click any row
2. **Expected**: Row selection event fires
3. **Verify**: Check BAW logs for selected employee details

---

## Expected Results

### Page 1 (Records 1-100)
- Employee IDs: 10001 - 10100
- Prev button: **Disabled**
- Next button: **Enabled**
- Record count: "1-100 of 500"

### Page 2 (Records 101-200)
- Employee IDs: 10101 - 10200
- Prev button: **Enabled**
- Next button: **Enabled**
- Record count: "101-200 of 500"

### Page 3 (Records 201-300)
- Employee IDs: 10201 - 10300
- Prev button: **Enabled**
- Next button: **Enabled**
- Record count: "201-300 of 500"

### Page 4 (Records 301-400)
- Employee IDs: 10301 - 10400
- Prev button: **Enabled**
- Next button: **Enabled**
- Record count: "301-400 of 500"

### Page 5 (Records 401-500)
- Employee IDs: 10401 - 10500
- Prev button: **Enabled**
- Next button: **Disabled**
- Record count: "401-500 of 500"

---

## Troubleshooting

### Issue: Prev/Next buttons not working

**Solution**: Verify event handler is configured:
1. Check `onPageChange` event is bound
2. Verify script node rebuilds table data after event
3. Check `tw.local.currentPage` is being updated

### Issue: Data not sorting

**Solution**: Verify sort event handler:
1. Check `onSort` event is bound
2. Verify `tw.local.sortColumn` and `tw.local.sortDirection` are updated
3. Check sort logic in "Build Table Data" script

### Issue: Search not working

**Solution**: Verify widget configuration:
1. Check `enableSearch` is set to `true`
2. Verify modern theme is applied (search styling)
3. Check browser console for JavaScript errors

---

## Performance Notes

- **500 records**: Cached in `tw.local.allEmployees` (JSON string)
- **Pagination**: Only 100 records sent to widget per page
- **Sorting**: Performed on full dataset before pagination
- **Search**: Client-side filtering on current page data
- **Memory**: ~150KB for 500 employee records

---

## Summary

This test coach provides:

✅ **500 Total Records** - Generated realistic employee data  
✅ **100 Records Per Page** - 5 pages total  
✅ **Working Prev/Next Buttons** - Server-side pagination  
✅ **Sorting** - Click column headers to sort  
✅ **Search** - Real-time filtering across all columns  
✅ **Modern Theme** - DynamicReportGrid-inspired styling  
✅ **Row Selection** - Click rows to select  
✅ **Event Logging** - All events logged to BAW console  

The coach is ready for testing and demonstrates all widget features with realistic data volume.

---

**Made with Bob** 🤖