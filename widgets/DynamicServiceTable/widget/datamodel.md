# DynamicServiceTable - Data Model

## Overview

The DynamicServiceTable widget uses a **single String binding** that contains JSON data. This approach eliminates all BAW type conversion issues by treating the entire payload as text that gets parsed by JavaScript in the browser.

## Binding

### tableDataJSON (String)

**Type**: String  
**Required**: Yes  
**Description**: A JSON string containing the complete table configuration including columns, data, and pagination metadata.

**Example**:
```javascript
tw.local.tableDataJSON = JSON.stringify({
    columns: [...],
    data: [...],
    pagination: {...}
});
```

## JSON Structure

The JSON string must contain three main sections:

### 1. columns (Array)

An array of column definition objects. Each column object can have:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| field | String | Yes | The data field name to display in this column |
| header | String | Yes | The column header text |
| sortable | Boolean | No | Whether the column can be sorted (default: false) |
| width | String | No | CSS width value (e.g., "100px", "20%") |
| align | String | No | Text alignment: "left", "center", "right" |
| type | String | No | Data type for formatting (see Column Types below) |
| badgeMap | String | No | JSON string mapping values to badge configs (for badge type) |
| linkTemplate | String | No | URL template with {value} placeholder (for link type) |

**Example**:
```json
{
  "field": "status",
  "header": "Status",
  "sortable": true,
  "type": "badge",
  "badgeMap": "{\"active\":{\"label\":\"Active\",\"color\":\"green\"}}"
}
```

### 2. data (Array)

An array of data row objects. Each object should have properties matching the column field names.

**Example**:
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "status": "active",
    "amount": 1234.56
  },
  {
    "id": 2,
    "name": "Jane Smith",
    "status": "pending",
    "amount": 2345.67
  }
]
```

### 3. pagination (Object)

Pagination metadata object with:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| page | Number | Yes | Current page number (1-based) |
| pageSize | Number | Yes | Number of rows per page |
| totalRecords | Number | Yes | Total number of records across all pages |

**Example**:
```json
{
  "page": 1,
  "pageSize": 100,
  "totalRecords": 250
}
```

## Column Types

The widget supports the following column types for automatic formatting:

### text (default)
Plain text display with no special formatting.

### number
Formats numbers with locale-specific thousand separators.
- Input: `1234567.89`
- Output: `1,234,567.89`

### currency
Formats as US dollar amounts with $ symbol and 2 decimal places.
- Input: `1234.5`
- Output: `$1,234.50`

### date
Formats date strings using browser's locale settings.
- Input: `"2024-01-15"` or `"2024-01-15T10:30:00Z"`
- Output: `1/15/2024` (US locale)

### boolean
Displays checkmark (✓) for true values, X (✗) for false values.
- Input: `true`, `"true"`, `1`, `"1"`
- Output: ✓ (green)
- Input: `false`, `"false"`, `0`, `"0"`
- Output: ✗ (red)

### badge
Displays colored status badges based on badgeMap configuration.

**badgeMap Format**: Must be a JSON string (not an object)
```json
{
  "field": "status",
  "type": "badge",
  "badgeMap": "{\"active\":{\"label\":\"Active\",\"color\":\"green\"},\"pending\":{\"label\":\"Pending\",\"color\":\"yellow\"},\"rejected\":{\"label\":\"Rejected\",\"color\":\"red\"}}"
}
```

**Available Colors**: green, red, yellow, blue, gray

### link
Displays clickable hyperlinks.

**With linkTemplate**:
```json
{
  "field": "userId",
  "type": "link",
  "linkTemplate": "/users/{value}/profile"
}
```
- Input: `"12345"`
- Output: `<a href="/users/12345/profile">12345</a>`

**Without linkTemplate** (uses value as URL):
```json
{
  "field": "website",
  "type": "link"
}
```
- Input: `"https://example.com"`
- Output: `<a href="https://example.com">https://example.com</a>`

## Complete Example

```javascript
// Build table data in BAW Script Node
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
            header: "Employee Name",
            sortable: true,
            type: "text"
        },
        {
            field: "salary",
            header: "Salary",
            sortable: true,
            align: "right",
            type: "currency"
        },
        {
            field: "hireDate",
            header: "Hire Date",
            sortable: true,
            type: "date"
        },
        {
            field: "active",
            header: "Active",
            sortable: true,
            align: "center",
            type: "boolean"
        },
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
            salary: 75000,
            hireDate: "2020-03-15",
            active: true,
            status: "active"
        },
        {
            id: 2,
            name: "Bob Smith",
            salary: 82000,
            hireDate: "2019-07-22",
            active: true,
            status: "active"
        },
        {
            id: 3,
            name: "Carol White",
            salary: 68000,
            hireDate: "2021-01-10",
            active: false,
            status: "inactive"
        }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 3
    }
};

// Convert to JSON string
tw.local.tableDataJSON = JSON.stringify(tableData);
```

## Data Flow

1. **BAW Script Node** builds JavaScript object with columns, data, and pagination
2. **JSON.stringify()** converts object to JSON string
3. **String variable** (`tw.local.tableDataJSON`) stores the JSON text
4. **Widget binding** receives the String (no type conversion issues)
5. **Widget JavaScript** calls `JSON.parse()` to convert back to object
6. **Rendering functions** build HTML table dynamically from parsed data

## Benefits of String Binding Approach

1. **No Type Conversion Errors**: BAW only sees a String, avoiding "Property X in class ANY is not declared" errors
2. **Maximum Flexibility**: Any JSON structure can be passed without declaring Business Objects
3. **Dynamic Schemas**: Column definitions can change at runtime without BAW Designer changes
4. **Simplified Development**: No need to maintain separate Business Object definitions
5. **Better Performance**: Single binding instead of multiple nested object bindings

## Notes

- The widget does **not** use BAW Table controls or Business Objects
- All table rendering is done in JavaScript using plain HTML elements
- Column definitions and data structure are completely dynamic
- BAW treats the widget as a black box with a single String input