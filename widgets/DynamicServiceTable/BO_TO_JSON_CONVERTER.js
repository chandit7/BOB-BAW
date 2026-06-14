// ============================================================================
// Universal Business Object to DynamicServiceTable JSON Converter
// Converts any BAW Business Object list to the expected JSON format
// ============================================================================

// ----------------------------------------------------------------------------
// CORE CONVERSION FUNCTION
// ----------------------------------------------------------------------------

/**
 * Convert BAW Business Object list to DynamicServiceTable JSON format
 * 
 * @param {TWList} businessObjectList - BAW Business Object list (e.g., tw.local.employees)
 * @param {Array} columnMappings - Array of column mapping objects
 * @param {Object} paginationInfo - Pagination metadata
 * @returns {String} JSON string for DynamicServiceTable widget
 * 
 * Example columnMappings:
 * [
 *   {
 *     boProperty: "employeeId",        // Business Object property name
 *     field: "empId",                  // Widget field name
 *     header: "Employee ID",           // Display header
 *     type: "number",                  // Widget type
 *     sortable: true,                  // Enable sorting
 *     width: "100px",                  // Optional width
 *     align: "center"                  // Optional alignment
 *   }
 * ]
 */
function convertBusinessObjectToTableJSON(businessObjectList, columnMappings, paginationInfo) {
    // Step 1: Convert Business Object list to plain JavaScript array
    var dataArray = convertBOListToArray(businessObjectList, columnMappings);
    
    // Step 2: Build column definitions for widget
    var columns = buildColumnDefinitions(columnMappings);
    
    // Step 3: Build table data structure
    var tableData = {
        columns: columns,
        data: dataArray,
        pagination: paginationInfo || {
            page: 1,
            pageSize: 100,
            totalRecords: dataArray.length
        }
    };
    
    // Step 4: Convert to JSON string
    return JSON.stringify(tableData);
}

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

/**
 * Convert BAW Business Object list to plain JavaScript array
 */
function convertBOListToArray(boList, columnMappings) {
    var result = [];
    
    // Handle null or undefined
    if (!boList || boList.listLength === 0) {
        return result;
    }
    
    // Iterate through Business Object list
    for (var i = 0; i < boList.listLength; i++) {
        var boItem = boList[i];
        var dataRow = {};
        
        // Map each Business Object property to widget field
        for (var j = 0; j < columnMappings.length; j++) {
            var mapping = columnMappings[j];
            var boValue = boItem[mapping.boProperty];
            
            // Convert value based on type
            dataRow[mapping.field] = convertValue(boValue, mapping.type);
        }
        
        result.push(dataRow);
    }
    
    return result;
}

/**
 * Convert Business Object value to appropriate JavaScript type
 */
function convertValue(value, targetType) {
    // Handle null/undefined
    if (value === null || value === undefined) {
        return null;
    }
    
    // Convert based on target type
    switch (targetType) {
        case "number":
        case "currency":
            // Convert to number
            if (typeof value === "number") {
                return value;
            }
            var num = parseFloat(value);
            return isNaN(num) ? null : num;
        
        case "date":
            // Convert to ISO date string (YYYY-MM-DD)
            if (value instanceof Date) {
                return value.toISOString().split('T')[0];
            }
            try {
                var date = new Date(value);
                return date.toISOString().split('T')[0];
            } catch (e) {
                return String(value);
            }
        
        case "boolean":
            // Convert to boolean
            if (typeof value === "boolean") {
                return value;
            }
            return value === "true" || value === 1 || value === "1";
        
        case "text":
        case "badge":
        case "link":
        default:
            // Convert to string
            return String(value);
    }
}

/**
 * Build column definitions for widget
 */
function buildColumnDefinitions(columnMappings) {
    var columns = [];
    
    for (var i = 0; i < columnMappings.length; i++) {
        var mapping = columnMappings[i];
        
        var column = {
            field: mapping.field,
            header: mapping.header,
            sortable: mapping.sortable !== false, // Default to true
            type: mapping.type || "text"
        };
        
        // Add optional properties
        if (mapping.width) {
            column.width = mapping.width;
        }
        if (mapping.align) {
            column.align = mapping.align;
        }
        if (mapping.badgeMap) {
            column.badgeMap = JSON.stringify(mapping.badgeMap);
        }
        if (mapping.linkTemplate) {
            column.linkTemplate = mapping.linkTemplate;
        }
        
        columns.push(column);
    }
    
    return columns;
}

// ============================================================================
// EXAMPLE 1: Employee Business Object
// ============================================================================

/**
 * Assume you have a Business Object "Employee" with properties:
 * - employeeId (Integer)
 * - firstName (String)
 * - lastName (String)
 * - email (String)
 * - department (String)
 * - salary (Decimal)
 * - hireDate (Date)
 * - isActive (Boolean)
 * - status (String)
 */

function example1_ConvertEmployeeBO() {
    // Your Business Object list from BAW
    var employeeList = tw.local.employees; // TWList of Employee BO
    
    // Define column mappings
    var columnMappings = [
        {
            boProperty: "employeeId",
            field: "empId",
            header: "Employee ID",
            type: "number",
            sortable: true,
            width: "100px",
            align: "center"
        },
        {
            boProperty: "firstName",
            field: "firstName",
            header: "First Name",
            type: "text",
            sortable: true
        },
        {
            boProperty: "lastName",
            field: "lastName",
            header: "Last Name",
            type: "text",
            sortable: true
        },
        {
            boProperty: "email",
            field: "email",
            header: "Email",
            type: "text",
            sortable: true
        },
        {
            boProperty: "department",
            field: "department",
            header: "Department",
            type: "badge",
            sortable: true,
            badgeMap: {
                "Engineering": { label: "Engineering", color: "blue" },
                "Sales": { label: "Sales", color: "green" },
                "HR": { label: "HR", color: "yellow" },
                "Finance": { label: "Finance", color: "gray" }
            }
        },
        {
            boProperty: "salary",
            field: "salary",
            header: "Salary",
            type: "currency",
            sortable: true,
            align: "right",
            width: "120px"
        },
        {
            boProperty: "hireDate",
            field: "hireDate",
            header: "Hire Date",
            type: "date",
            sortable: true,
            width: "120px"
        },
        {
            boProperty: "isActive",
            field: "active",
            header: "Active",
            type: "boolean",
            sortable: true,
            align: "center",
            width: "80px"
        },
        {
            boProperty: "status",
            field: "status",
            header: "Status",
            type: "badge",
            sortable: true,
            badgeMap: {
                "Active": { label: "Active", color: "green" },
                "Inactive": { label: "Inactive", color: "gray" },
                "On Leave": { label: "On Leave", color: "yellow" }
            }
        }
    ];
    
    // Define pagination
    var paginationInfo = {
        page: tw.local.currentPage || 1,
        pageSize: tw.local.pageSize || 100,
        totalRecords: employeeList.listLength
    };
    
    // Convert and assign
    tw.local.tableDataJSON = convertBusinessObjectToTableJSON(
        employeeList,
        columnMappings,
        paginationInfo
    );
}

// ============================================================================
// EXAMPLE 2: Order Business Object
// ============================================================================

/**
 * Assume you have a Business Object "Order" with properties:
 * - orderId (Integer)
 * - customerName (String)
 * - orderDate (Date)
 * - totalAmount (Decimal)
 * - orderStatus (String)
 * - isPaid (Boolean)
 */

function example2_ConvertOrderBO() {
    var orderList = tw.local.orders;
    
    var columnMappings = [
        {
            boProperty: "orderId",
            field: "orderId",
            header: "Order #",
            type: "number",
            sortable: true,
            width: "100px",
            align: "center"
        },
        {
            boProperty: "customerName",
            field: "customerName",
            header: "Customer",
            type: "text",
            sortable: true
        },
        {
            boProperty: "orderDate",
            field: "orderDate",
            header: "Order Date",
            type: "date",
            sortable: true,
            width: "120px"
        },
        {
            boProperty: "totalAmount",
            field: "amount",
            header: "Amount",
            type: "currency",
            sortable: true,
            align: "right",
            width: "120px"
        },
        {
            boProperty: "orderStatus",
            field: "status",
            header: "Status",
            type: "badge",
            sortable: true,
            badgeMap: {
                "Pending": { label: "Pending", color: "yellow" },
                "Processing": { label: "Processing", color: "blue" },
                "Shipped": { label: "Shipped", color: "green" },
                "Delivered": { label: "Delivered", color: "green" },
                "Cancelled": { label: "Cancelled", color: "red" }
            }
        },
        {
            boProperty: "isPaid",
            field: "paid",
            header: "Paid",
            type: "boolean",
            sortable: true,
            align: "center",
            width: "80px"
        }
    ];
    
    var paginationInfo = {
        page: tw.local.currentPage || 1,
        pageSize: tw.local.pageSize || 100,
        totalRecords: orderList.listLength
    };
    
    tw.local.tableDataJSON = convertBusinessObjectToTableJSON(
        orderList,
        columnMappings,
        paginationInfo
    );
}

// ============================================================================
// EXAMPLE 3: Task Business Object (from LSW_TASK query result)
// ============================================================================

/**
 * Assume you have a Business Object "TaskInfo" with properties:
 * - taskId (Integer)
 * - subject (String)
 * - assignedTo (String)
 * - taskStatus (String)
 * - priority (Integer)
 * - dueDate (Date)
 * - createdDate (Date)
 */

function example3_ConvertTaskBO() {
    var taskList = tw.local.tasks;
    
    var columnMappings = [
        {
            boProperty: "taskId",
            field: "taskId",
            header: "Task ID",
            type: "number",
            sortable: true,
            width: "100px",
            align: "center"
        },
        {
            boProperty: "subject",
            field: "subject",
            header: "Subject",
            type: "text",
            sortable: true
        },
        {
            boProperty: "assignedTo",
            field: "assignedTo",
            header: "Assigned To",
            type: "text",
            sortable: true
        },
        {
            boProperty: "taskStatus",
            field: "status",
            header: "Status",
            type: "badge",
            sortable: true,
            badgeMap: {
                "Received": { label: "Received", color: "blue" },
                "Started": { label: "In Progress", color: "yellow" },
                "Completed": { label: "Completed", color: "green" },
                "Failed": { label: "Failed", color: "red" }
            }
        },
        {
            boProperty: "priority",
            field: "priority",
            header: "Priority",
            type: "badge",
            sortable: true,
            width: "100px",
            align: "center",
            badgeMap: {
                "1": { label: "High", color: "red" },
                "2": { label: "Medium", color: "yellow" },
                "3": { label: "Low", color: "blue" },
                "4": { label: "Very Low", color: "gray" }
            }
        },
        {
            boProperty: "dueDate",
            field: "dueDate",
            header: "Due Date",
            type: "date",
            sortable: true,
            width: "120px"
        },
        {
            boProperty: "createdDate",
            field: "createdDate",
            header: "Created",
            type: "date",
            sortable: true,
            width: "120px"
        }
    ];
    
    var paginationInfo = {
        page: tw.local.currentPage || 1,
        pageSize: tw.local.pageSize || 100,
        totalRecords: taskList.listLength
    };
    
    tw.local.tableDataJSON = convertBusinessObjectToTableJSON(
        taskList,
        columnMappings,
        paginationInfo
    );
}

// ============================================================================
// EXAMPLE 4: With Server-Side Pagination
// ============================================================================

/**
 * When you fetch paginated data from database, you need to provide total count
 */

function example4_WithServerSidePagination() {
    // Assume you fetched one page of data
    var currentPageEmployees = tw.local.currentPageEmployees; // 100 records
    var totalEmployeeCount = tw.local.totalEmployeeCount;     // 5000 total
    
    var columnMappings = [
        // ... same as example 1
    ];
    
    var paginationInfo = {
        page: tw.local.currentPage || 1,
        pageSize: tw.local.pageSize || 100,
        totalRecords: totalEmployeeCount // Use total count, not current page count
    };
    
    tw.local.tableDataJSON = convertBusinessObjectToTableJSON(
        currentPageEmployees,
        columnMappings,
        paginationInfo
    );
}

// ============================================================================
// QUICK START TEMPLATE
// ============================================================================

// 1. Define your column mappings
var columnMappings = [
    {
        boProperty: "yourBOProperty",  // Business Object property name
        field: "widgetField",          // Widget field name (camelCase)
        header: "Display Header",      // Column header text
        type: "text",                  // Type: text, number, currency, date, boolean, badge, link
        sortable: true,                // Enable sorting
        width: "100px",                // Optional: column width
        align: "left"                  // Optional: left, center, right
    }
    // Add more columns...
];

// 2. Define pagination
var paginationInfo = {
    page: tw.local.currentPage || 1,
    pageSize: tw.local.pageSize || 100,
    totalRecords: tw.local.yourBusinessObjectList.listLength
};

// 3. Convert and assign
tw.local.tableDataJSON = convertBusinessObjectToTableJSON(
    tw.local.yourBusinessObjectList,
    columnMappings,
    paginationInfo
);

// ============================================================================
// DONE! Your Business Object is now converted to table JSON format
// ============================================================================

// Made with Bob
