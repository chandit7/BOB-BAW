// ============================================================================
// DynamicServiceTable - Generic SQL Integration Template
// Works with ANY database table (BAW system tables or custom tables)
// ============================================================================

// ----------------------------------------------------------------------------
// REUSABLE HELPER FUNCTIONS (Copy these to any Script Node)
// ----------------------------------------------------------------------------

/**
 * Convert BAW XMLElement to plain JavaScript value
 * Works for: String, Number, Boolean columns
 */
function xmlToValue(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return null;
    }
    
    if (xmlElement.text !== undefined && xmlElement.text !== null) {
        return xmlElement.text;
    }
    
    return String(xmlElement);
}

/**
 * Convert BAW XMLElement date to ISO date string (YYYY-MM-DD)
 * Works for: DATE, TIMESTAMP columns
 */
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

/**
 * Convert BAW XMLElement to number
 * Works for: INTEGER, DECIMAL, NUMERIC columns
 */
function xmlToNumber(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return null;
    }
    
    var value = xmlElement.text || xmlElement;
    var num = parseFloat(value);
    return isNaN(num) ? null : num;
}

/**
 * Convert BAW XMLElement to boolean
 * Works for: BOOLEAN, BIT columns (0/1, true/false)
 */
function xmlToBoolean(xmlElement) {
    if (xmlElement === null || xmlElement === undefined) {
        return false;
    }
    
    var value = xmlElement.text || xmlElement;
    return value === "1" || value === "true" || value === true;
}

// ----------------------------------------------------------------------------
// GENERIC CONVERSION FUNCTION
// ----------------------------------------------------------------------------

/**
 * Convert BAW SQL result to DynamicServiceTable JSON format
 * @param {Object} sqlResult - BAW SQL query result
 * @param {Array} columnDefs - Column definitions with field mappings
 * @param {Object} pagination - Pagination info {page, pageSize, totalRecords}
 * @returns {String} JSON string for DynamicServiceTable
 */
function convertSQLToTableJSON(sqlResult, columnDefs, pagination) {
    var dataRows = [];
    
    // Convert each row
    for (var i = 0; i < sqlResult.rows.length; i++) {
        var row = sqlResult.rows[i];
        var dataRow = {};
        
        // Convert each column based on its type
        for (var j = 0; j < columnDefs.length; j++) {
            var colDef = columnDefs[j];
            var sqlColumnName = colDef.sqlColumn || colDef.field.toUpperCase();
            var xmlValue = row[sqlColumnName];
            
            // Convert based on column type
            switch (colDef.type) {
                case "date":
                    dataRow[colDef.field] = xmlDateToISO(xmlValue);
                    break;
                case "number":
                case "currency":
                    dataRow[colDef.field] = xmlToNumber(xmlValue);
                    break;
                case "boolean":
                    dataRow[colDef.field] = xmlToBoolean(xmlValue);
                    break;
                default:
                    dataRow[colDef.field] = xmlToValue(xmlValue);
            }
        }
        
        dataRows.push(dataRow);
    }
    
    // Build table data structure
    var tableData = {
        columns: columnDefs,
        data: dataRows,
        pagination: pagination
    };
    
    return JSON.stringify(tableData);
}

// ============================================================================
// EXAMPLE 1: Custom Employee Table
// ============================================================================

function example1_CustomEmployeeTable() {
    // Define your column mappings
    var columnDefs = [
        {
            field: "empId",
            sqlColumn: "EMPLOYEE_ID",  // Actual SQL column name
            header: "Employee ID",
            sortable: true,
            width: "100px",
            align: "center",
            type: "number"
        },
        {
            field: "name",
            sqlColumn: "FULL_NAME",
            header: "Name",
            sortable: true,
            type: "text"
        },
        {
            field: "email",
            sqlColumn: "EMAIL_ADDRESS",
            header: "Email",
            sortable: true,
            type: "text"
        },
        {
            field: "salary",
            sqlColumn: "ANNUAL_SALARY",
            header: "Salary",
            sortable: true,
            align: "right",
            type: "currency"
        },
        {
            field: "hireDate",
            sqlColumn: "HIRE_DATE",
            header: "Hire Date",
            sortable: true,
            type: "date"
        },
        {
            field: "active",
            sqlColumn: "IS_ACTIVE",
            header: "Active",
            sortable: true,
            align: "center",
            type: "boolean"
        },
        {
            field: "department",
            sqlColumn: "DEPT_NAME",
            header: "Department",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Engineering": { label: "Engineering", color: "blue" },
                "Sales": { label: "Sales", color: "green" },
                "HR": { label: "HR", color: "yellow" },
                "Finance": { label: "Finance", color: "gray" }
            })
        }
    ];
    
    // Execute your SQL query
    var sqlQuery = 
        "SELECT " +
        "    EMPLOYEE_ID, FULL_NAME, EMAIL_ADDRESS, ANNUAL_SALARY, " +
        "    HIRE_DATE, IS_ACTIVE, DEPT_NAME " +
        "FROM EMPLOYEES " +
        "WHERE IS_ACTIVE = 1 " +
        "ORDER BY HIRE_DATE DESC " +
        "LIMIT ? OFFSET ?";
    
    var pageSize = tw.local.pageSize || 100;
    var offset = ((tw.local.currentPage || 1) - 1) * pageSize;
    
    var sqlResult = tw.system.currentProcessInstance.executeSQL(
        sqlQuery,
        [pageSize, offset]
    );
    
    // Get total count
    var countQuery = "SELECT COUNT(*) as total FROM EMPLOYEES WHERE IS_ACTIVE = 1";
    var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
    var totalRecords = parseInt(xmlToValue(countResult.rows[0].total), 10);
    
    // Convert to table JSON
    tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, {
        page: tw.local.currentPage || 1,
        pageSize: pageSize,
        totalRecords: totalRecords
    });
}

// ============================================================================
// EXAMPLE 2: Custom Orders Table
// ============================================================================

function example2_CustomOrdersTable() {
    var columnDefs = [
        {
            field: "orderId",
            sqlColumn: "ORDER_ID",
            header: "Order #",
            sortable: true,
            width: "100px",
            type: "number"
        },
        {
            field: "customerName",
            sqlColumn: "CUSTOMER_NAME",
            header: "Customer",
            sortable: true,
            type: "text"
        },
        {
            field: "orderDate",
            sqlColumn: "ORDER_DATE",
            header: "Order Date",
            sortable: true,
            type: "date"
        },
        {
            field: "totalAmount",
            sqlColumn: "TOTAL_AMOUNT",
            header: "Total",
            sortable: true,
            align: "right",
            type: "currency"
        },
        {
            field: "status",
            sqlColumn: "ORDER_STATUS",
            header: "Status",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Pending": { label: "Pending", color: "yellow" },
                "Processing": { label: "Processing", color: "blue" },
                "Shipped": { label: "Shipped", color: "green" },
                "Delivered": { label: "Delivered", color: "green" },
                "Cancelled": { label: "Cancelled", color: "red" }
            })
        },
        {
            field: "isPaid",
            sqlColumn: "IS_PAID",
            header: "Paid",
            sortable: true,
            align: "center",
            type: "boolean"
        }
    ];
    
    var sqlQuery = 
        "SELECT " +
        "    ORDER_ID, CUSTOMER_NAME, ORDER_DATE, TOTAL_AMOUNT, " +
        "    ORDER_STATUS, IS_PAID " +
        "FROM ORDERS " +
        "WHERE ORDER_DATE >= ? " +
        "ORDER BY ORDER_DATE DESC " +
        "LIMIT ? OFFSET ?";
    
    var pageSize = tw.local.pageSize || 100;
    var offset = ((tw.local.currentPage || 1) - 1) * pageSize;
    var startDate = tw.local.filterStartDate || "2024-01-01";
    
    var sqlResult = tw.system.currentProcessInstance.executeSQL(
        sqlQuery,
        [startDate, pageSize, offset]
    );
    
    var countQuery = "SELECT COUNT(*) as total FROM ORDERS WHERE ORDER_DATE >= ?";
    var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, [startDate]);
    var totalRecords = parseInt(xmlToValue(countResult.rows[0].total), 10);
    
    tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, {
        page: tw.local.currentPage || 1,
        pageSize: pageSize,
        totalRecords: totalRecords
    });
}

// ============================================================================
// EXAMPLE 3: BAW System Table - LSW_BPD_INSTANCE (Process Instances)
// ============================================================================

function example3_ProcessInstances() {
    var columnDefs = [
        {
            field: "instanceId",
            sqlColumn: "BPD_INSTANCE_ID",
            header: "Instance ID",
            sortable: true,
            width: "120px",
            type: "number"
        },
        {
            field: "processName",
            sqlColumn: "NAME",
            header: "Process Name",
            sortable: true,
            type: "text"
        },
        {
            field: "status",
            sqlColumn: "EXECUTION_STATUS",
            header: "Status",
            sortable: true,
            type: "badge",
            badgeMap: JSON.stringify({
                "Active": { label: "Active", color: "blue" },
                "Completed": { label: "Completed", color: "green" },
                "Failed": { label: "Failed", color: "red" },
                "Terminated": { label: "Terminated", color: "gray" }
            })
        },
        {
            field: "startDate",
            sqlColumn: "CREATION_TIME",
            header: "Started",
            sortable: true,
            type: "date"
        },
        {
            field: "endDate",
            sqlColumn: "CLOSE_TIME",
            header: "Completed",
            sortable: true,
            type: "date"
        }
    ];
    
    var sqlQuery = 
        "SELECT " +
        "    BPD_INSTANCE_ID, NAME, EXECUTION_STATUS, " +
        "    CREATION_TIME, CLOSE_TIME " +
        "FROM LSW_BPD_INSTANCE " +
        "WHERE EXECUTION_STATUS IN ('Active', 'Completed') " +
        "ORDER BY CREATION_TIME DESC " +
        "LIMIT ? OFFSET ?";
    
    var pageSize = tw.local.pageSize || 100;
    var offset = ((tw.local.currentPage || 1) - 1) * pageSize;
    
    var sqlResult = tw.system.currentProcessInstance.executeSQL(
        sqlQuery,
        [pageSize, offset]
    );
    
    var countQuery = "SELECT COUNT(*) as total FROM LSW_BPD_INSTANCE WHERE EXECUTION_STATUS IN ('Active', 'Completed')";
    var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
    var totalRecords = parseInt(xmlToValue(countResult.rows[0].total), 10);
    
    tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, {
        page: tw.local.currentPage || 1,
        pageSize: pageSize,
        totalRecords: totalRecords
    });
}

// ============================================================================
// QUICK START TEMPLATE - Copy and modify this for your table
// ============================================================================

// STEP 1: Define your columns
var columnDefs = [
    {
        field: "id",              // JavaScript field name (camelCase)
        sqlColumn: "ID",          // SQL column name (UPPERCASE)
        header: "ID",             // Display header
        sortable: true,           // Enable sorting
        width: "100px",           // Optional width
        align: "center",          // Optional alignment: left, center, right
        type: "number"            // Type: text, number, currency, date, boolean, badge, link
    },
    {
        field: "name",
        sqlColumn: "NAME",
        header: "Name",
        sortable: true,
        type: "text"
    },
    {
        field: "amount",
        sqlColumn: "AMOUNT",
        header: "Amount",
        sortable: true,
        align: "right",
        type: "currency"
    },
    {
        field: "status",
        sqlColumn: "STATUS",
        header: "Status",
        sortable: true,
        type: "badge",
        badgeMap: JSON.stringify({
            "active": { label: "Active", color: "green" },
            "inactive": { label: "Inactive", color: "gray" }
        })
    }
];

// STEP 2: Build your SQL query
var sqlQuery = 
    "SELECT ID, NAME, AMOUNT, STATUS " +
    "FROM YOUR_TABLE_NAME " +
    "WHERE YOUR_CONDITION " +
    "ORDER BY YOUR_SORT_COLUMN DESC " +
    "LIMIT ? OFFSET ?";

// STEP 3: Execute query with pagination
var pageSize = tw.local.pageSize || 100;
var offset = ((tw.local.currentPage || 1) - 1) * pageSize;

var sqlResult = tw.system.currentProcessInstance.executeSQL(
    sqlQuery,
    [pageSize, offset]
);

// STEP 4: Get total count
var countQuery = "SELECT COUNT(*) as total FROM YOUR_TABLE_NAME WHERE YOUR_CONDITION";
var countResult = tw.system.currentProcessInstance.executeSQL(countQuery, []);
var totalRecords = parseInt(xmlToValue(countResult.rows[0].total), 10);

// STEP 5: Convert and assign
tw.local.tableDataJSON = convertSQLToTableJSON(sqlResult, columnDefs, {
    page: tw.local.currentPage || 1,
    pageSize: pageSize,
    totalRecords: totalRecords
});

// ============================================================================
// DONE! Your table is ready to display
// ============================================================================

// Made with Bob
