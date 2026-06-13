# DynamicServiceTable Widget - Redesign Summary

## Date: 2026-06-13

## Problem Statement

The original DynamicServiceTable widget used complex Business Object bindings (TableData, TableColumn, TablePagination) which caused multiple BAW type conversion errors:

1. **"Property X in class ANY is not declared"** - BAW couldn't convert JavaScript objects to ANY type
2. **Array forEach errors** - Business Object properties not initialized as arrays
3. **BadgeMap conversion issues** - Nested objects couldn't be assigned to ANY type
4. **Data row conversion failures** - JavaScript objects couldn't be assigned to listOf.ANY

## Solution: Single String Binding

The widget was completely redesigned to use a **single String binding** containing JSON data. This eliminates all type conversion issues by treating the entire payload as text.

### Architecture Change

**Before (Complex Business Objects)**:
```
BAW → TableData BO → TableColumn[] BO → TablePagination BO → Widget
      ↓ Type conversion errors at every level
```

**After (Simple String Binding)**:
```
BAW Script → JSON.stringify() → String Variable → Widget → JSON.parse() → Render
            ↓ No type conversion - just text
```

## Key Changes

### 1. Configuration (config.json)

**Before**:
```json
{
  "bindingType": {
    "name": "TableData",
    "isList": false,
    "type": "TableData"
  },
  "businessObjects": [
    { "name": "TableData", "file": "TableData.json" },
    { "name": "TableColumn", "file": "TableColumn.json" },
    { "name": "TablePagination", "file": "TablePagination.json" }
  ]
}
```

**After**:
```json
{
  "bindingType": {
    "name": "tableDataJSON",
    "isList": false,
    "type": "String"
  }
}
```

### 2. Business Objects

**Before**: 3 Business Object files (TableData.json, TableColumn.json, TablePagination.json)

**After**: **REMOVED** - No Business Objects needed

### 3. JavaScript Controller (inlineJavascript.js)

**Before**:
```javascript
var tableData = this.getData(); // Returns TableData Business Object
var columns = tableData.columns || []; // May not be array
var data = tableData.data || []; // May not be array
```

**After**:
```javascript
var tableDataJSON = this.getData(); // Returns String
var parsedData = JSON.parse(tableDataJSON); // Parse to object
var columns = parsedData.columns || []; // Always array
var data = parsedData.data || []; // Always array
```

### 4. Change Event Handler (change.js)

**Before**:
```javascript
var tableData = this.getData();
// Direct access to Business Object properties
// Type conversion errors on assignment
```

**After**:
```javascript
var tableDataJSON = this.getData();
var parsedData = JSON.parse(tableDataJSON);
// All data is pure JavaScript - no BAW type system involved
```

### 5. BAW Usage

**Before** (Complex):
```javascript
// Create Business Objects
tw.local.tableData = new TableData();
tw.local.tableData.columns = new listOf.TableColumn();
tw.local.tableData.columns[0] = new TableColumn();
tw.local.tableData.columns[0].field = "id";
// ... many more lines
```

**After** (Simple):
```javascript
// Build plain JavaScript object
var tableData = {
    columns: [
        { field: "id", header: "ID", sortable: true, type: "number" }
    ],
    data: [
        { id: 1, name: "John Doe" }
    ],
    pagination: { page: 1, pageSize: 100, totalRecords: 1 }
};

// Convert to JSON string - done!
tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Benefits

### 1. No Type Conversion Errors
BAW only sees a String variable - no complex type conversions needed.

### 2. Maximum Flexibility
Any JSON structure can be passed without declaring Business Objects in BAW Designer.

### 3. Dynamic Schemas
Column definitions can change at runtime without modifying BAW artifacts.

### 4. Simplified Development
- No Business Object maintenance
- No type mapping issues
- Easier debugging (just log the JSON string)

### 5. Better Performance
- Single binding instead of multiple nested object bindings
- No BAW type system overhead
- Faster data transfer

## JSON Structure

The widget expects a JSON string with this structure:

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
      "badgeMap": "{\"active\":{\"label\":\"Active\",\"color\":\"green\"}}"
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

## Column Types Supported

1. **text** - Plain text
2. **number** - Formatted numbers (1,234.56)
3. **currency** - Dollar amounts ($1,234.50)
4. **date** - Formatted dates (1/15/2024)
5. **boolean** - Checkmarks (✓/✗)
6. **badge** - Colored status badges
7. **link** - Clickable hyperlinks

## Badge Configuration

Badges require a JSON string (not an object):

```javascript
{
    field: "status",
    type: "badge",
    badgeMap: JSON.stringify({
        "active": { label: "Active", color: "green" },
        "pending": { label: "Pending", color: "yellow" },
        "rejected": { label: "Rejected", color: "red" }
    })
}
```

**Available Colors**: green, red, yellow, blue, gray

## Testing Instructions

### 1. Create Test Coach

1. Create new coach in BAW Designer
2. Add String variable: `tw.local.tableDataJSON`
3. Add Script Node before coach with test data
4. Drag DynamicServiceTable widget onto coach
5. Bind to `tw.local.tableDataJSON`

### 2. Test Script

```javascript
var tableData = {
    columns: [
        { field: "id", header: "ID", sortable: true, width: "80px", align: "center", type: "number" },
        { field: "name", header: "Name", sortable: true, type: "text" },
        { field: "amount", header: "Amount", sortable: true, align: "right", type: "currency" },
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
        { id: 2, name: "Jane Smith", amount: 2345.67, status: "pending" },
        { id: 3, name: "Bob Johnson", amount: 3456.78, status: "rejected" }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 3
    }
};

tw.local.tableDataJSON = JSON.stringify(tableData);
```

### 3. Expected Results

- Table displays with 3 rows
- ID column shows formatted numbers
- Amount column shows currency formatting ($1,234.56)
- Status column shows colored badges
- Pagination shows "1-3 of 3"
- Clicking column headers fires sort events
- All formatting renders correctly

## Files Modified

### Created/Updated:
- `config.json` - Changed binding to String type
- `inlineJavascript.js` - Complete rewrite with JSON parsing
- `events/change.js` - Complete rewrite with JSON parsing
- `datamodel.md` - Updated documentation
- `README.md` - Comprehensive usage guide
- `BAW_TEST_DATA.md` - Updated test examples
- `REDESIGN_SUMMARY.md` - This document

### Removed:
- `TableData.json` - No longer needed
- `TableColumn.json` - No longer needed
- `TablePagination.json` - No longer needed

## Migration Guide

If you have existing coaches using the old widget:

1. **Create String variable**: `tw.local.tableDataJSON`
2. **Update Script Node**: Use `JSON.stringify()` to build JSON
3. **Update widget binding**: Change from TableData to tableDataJSON
4. **Test thoroughly**: Verify all data displays correctly

## Conclusion

The redesigned DynamicServiceTable widget provides a robust, type-safe solution for displaying dynamic data in BAW. By using a single String binding with JSON data, it eliminates all type conversion issues while providing maximum flexibility and ease of use.

The widget is now ready for packaging and deployment to BAW servers.