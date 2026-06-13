// ============================================================================
// DynamicServiceTable - Complete LSW_TASK Integration Example
// Copy this entire script into a BAW Script Node
// ============================================================================

// ----------------------------------------------------------------------------
// STEP 1: Helper Functions for XMLElement Conversion
// ----------------------------------------------------------------------------

/**
 * Convert BAW XMLElement to plain JavaScript value
 */
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

/**
 * Convert BAW XMLElement date to ISO date string (YYYY-MM-DD)
 */
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

/**
 * Convert BAW XMLElement date to ISO datetime string
 */
function xmlDateTimeToISO(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return null;
    }
    
    try {
        var dateValue = new Date(xmlElement.text || xmlElement);
        return dateValue.toISOString(); // Return full ISO datetime
    } catch (e) {
        return xmlElement.text || String(xmlElement);
    }
}

// ----------------------------------------------------------------------------
// STEP 2: Get Pagination Parameters
// ----------------------------------------------------------------------------

var currentPage = tw.local.currentPage || 1;
var pageSize = tw.local.pageSize || 100;
var sortColumn = tw.local.sortColumn || "TASK_ID";
var sortDirection = tw.local.sortDirection || "DESC";

// Calculate offset for pagination
var offset = (currentPage - 1) * pageSize;

// ----------------------------------------------------------------------------
// STEP 3: Execute SQL Query to Fetch Tasks
// ----------------------------------------------------------------------------

var sqlQuery = 
    "SELECT " +
    "    TASK_ID, " +
    "    SUBJECT, " +
    "    STATUS, " +
    "    PRIORITY, " +
    "    ASSIGNED_TO, " +
    "    DUE_DATE, " +
    "    CREATED_DATE, " +
    "    CLOSE_DATE " +
    "FROM LSW_TASK " +
    "WHERE STATUS IN ('Received', 'Started') " +
    "ORDER BY " + sortColumn + " " + sortDirection + " " +
    "LIMIT ? OFFSET ?";

var sqlResult = tw.system.currentProcessInstance.executeSQL(
    sqlQuery,
    [pageSize, offset]
);

// Get total count for pagination
var countQuery = 
    "SELECT COUNT(*) as total " +
    "FROM LSW_TASK " +
    "WHERE STATUS IN ('Received', 'Started')";

var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
var totalRecords = parseInt(xmlToValue(countResult.rows[0].total), 10);

// ----------------------------------------------------------------------------
// STEP 4: Convert SQL Results to JavaScript Objects
// ----------------------------------------------------------------------------

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
        createdDate: xmlDateToISO(row.CREATED_DATE),
        closeDate: xmlDateToISO(row.CLOSE_DATE)
    };
    
    dataRows.push(dataRow);
}

// ----------------------------------------------------------------------------
// STEP 5: Define Table Columns with Formatting
// ----------------------------------------------------------------------------

var columns = [
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
        width: "120px",
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
            "3": { label: "Low", color: "blue" },
            "4": { label: "Very Low", color: "gray" }
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
        width: "120px",
        type: "date"
    },
    {
        field: "createdDate",
        header: "Created",
        sortable: true,
        width: "120px",
        type: "date"
    },
    {
        field: "closeDate",
        header: "Closed",
        sortable: true,
        width: "120px",
        type: "date"
    }
];

// ----------------------------------------------------------------------------
// STEP 6: Build Table Data Structure
// ----------------------------------------------------------------------------

var tableData = {
    columns: columns,
    data: dataRows,
    pagination: {
        page: currentPage,
        pageSize: pageSize,
        totalRecords: totalRecords
    }
};

// ----------------------------------------------------------------------------
// STEP 7: Convert to JSON String and Assign to Variable
// ----------------------------------------------------------------------------

tw.local.tableDataJSON = JSON.stringify(tableData);

// ----------------------------------------------------------------------------
// OPTIONAL: Log for debugging
// ----------------------------------------------------------------------------

// Uncomment these lines for debugging
// tw.system.log("Total records: " + totalRecords);
// tw.system.log("Current page: " + currentPage);
// tw.system.log("Data rows: " + dataRows.length);
// tw.system.log("JSON length: " + tw.local.tableDataJSON.length);

// Made with Bob
