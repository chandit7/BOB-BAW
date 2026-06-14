// ============================================================================
// DynamicServiceTable - Generate 500 Test Records
// Copy this entire script into a BAW Script Node for testing
// ============================================================================

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS FOR GENERATING REALISTIC TEST DATA
// ----------------------------------------------------------------------------

/**
 * Generate random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Pick random item from array
 */
function randomChoice(array) {
    return array[randomInt(0, array.length - 1)];
}

/**
 * Generate random date between start and end dates
 */
function randomDate(startDate, endDate) {
    var start = new Date(startDate).getTime();
    var end = new Date(endDate).getTime();
    var randomTime = start + Math.random() * (end - start);
    var date = new Date(randomTime);
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD
}

/**
 * Generate random amount between min and max
 */
function randomAmount(min, max) {
    return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

/**
 * Generate random email from name
 */
function generateEmail(firstName, lastName, domain) {
    return (firstName + "." + lastName + "@" + domain).toLowerCase();
}

/**
 * Generate random phone number
 */
function generatePhone() {
    var area = randomInt(200, 999);
    var prefix = randomInt(200, 999);
    var line = randomInt(1000, 9999);
    return "(" + area + ") " + prefix + "-" + line;
}

// ----------------------------------------------------------------------------
// DATA ARRAYS FOR REALISTIC GENERATION
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
    "Larry", "Brenda", "Justin", "Pamela", "Scott", "Nicole", "Brandon", "Emma",
    "Benjamin", "Samantha", "Samuel", "Katherine", "Raymond", "Christine", "Gregory", "Debra",
    "Frank", "Rachel", "Alexander", "Catherine", "Patrick", "Carolyn", "Raymond", "Janet",
    "Jack", "Ruth", "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane",
    "Aaron", "Virginia", "Jose", "Julie", "Adam", "Joyce", "Henry", "Victoria",
    "Nathan", "Olivia", "Douglas", "Kelly", "Zachary", "Christina", "Peter", "Lauren"
];

var lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
    "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas",
    "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White",
    "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker", "Young",
    "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill", "Flores",
    "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell", "Mitchell",
    "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz", "Parker",
    "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales", "Murphy",
    "Cook", "Rogers", "Gutierrez", "Ortiz", "Morgan", "Cooper", "Peterson", "Bailey",
    "Reed", "Kelly", "Howard", "Ramos", "Kim", "Cox", "Ward", "Richardson",
    "Watson", "Brooks", "Chavez", "Wood", "James", "Bennett", "Gray", "Mendoza",
    "Ruiz", "Hughes", "Price", "Alvarez", "Castillo", "Sanders", "Patel", "Myers",
    "Long", "Ross", "Foster", "Jimenez", "Powell", "Jenkins", "Perry", "Russell"
];

var departments = [
    "Engineering", "Sales", "Marketing", "HR", "Finance", "Operations",
    "Customer Service", "IT", "Legal", "Product", "Research", "Quality Assurance"
];

var jobTitles = [
    "Software Engineer", "Senior Developer", "Project Manager", "Business Analyst",
    "Sales Representative", "Marketing Manager", "HR Specialist", "Financial Analyst",
    "Operations Manager", "Customer Support", "IT Administrator", "Legal Counsel",
    "Product Manager", "Research Scientist", "QA Engineer", "Data Analyst",
    "Account Executive", "Content Writer", "UX Designer", "DevOps Engineer"
];

var statuses = ["Active", "Inactive", "On Leave", "Pending"];
var priorities = ["High", "Medium", "Low"];
var projectStatuses = ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"];
var emailDomains = ["company.com", "enterprise.com", "business.com", "corp.com"];

var cities = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
    "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
    "Fort Worth", "Columbus", "Charlotte", "San Francisco", "Indianapolis", "Seattle",
    "Denver", "Washington", "Boston", "Nashville", "Detroit", "Portland", "Las Vegas"
];

// ----------------------------------------------------------------------------
// GENERATE 500 EMPLOYEE RECORDS
// ----------------------------------------------------------------------------

function generate500EmployeeRecords() {
    var records = [];
    
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
            active: randomChoice([true, false, true, true]) // 75% active
        };
        
        records.push(record);
    }
    
    return records;
}

// ----------------------------------------------------------------------------
// GENERATE 500 ORDER RECORDS
// ----------------------------------------------------------------------------

function generate500OrderRecords() {
    var records = [];
    
    for (var i = 1; i <= 500; i++) {
        var orderDate = randomDate("2024-01-01", "2024-12-31");
        var amount = randomAmount(50, 5000);
        
        var record = {
            orderId: 50000 + i,
            customerName: randomChoice(firstNames) + " " + randomChoice(lastNames),
            orderDate: orderDate,
            amount: amount,
            status: randomChoice(projectStatuses),
            priority: randomChoice(priorities),
            city: randomChoice(cities),
            isPaid: randomChoice([true, false, true, true]) // 75% paid
        };
        
        records.push(record);
    }
    
    return records;
}

// ----------------------------------------------------------------------------
// GENERATE 500 TASK RECORDS
// ----------------------------------------------------------------------------

function generate500TaskRecords() {
    var records = [];
    
    for (var i = 1; i <= 500; i++) {
        var createdDate = randomDate("2024-01-01", "2024-12-31");
        var dueDate = randomDate(createdDate, "2024-12-31");
        
        var record = {
            taskId: 20000 + i,
            subject: "Task " + i + ": " + randomChoice(jobTitles) + " Review",
            assignedTo: randomChoice(firstNames) + " " + randomChoice(lastNames),
            status: randomChoice(["Received", "Started", "Completed", "Failed"]),
            priority: randomInt(1, 4), // 1=High, 2=Medium, 3=Low, 4=Very Low
            createdDate: createdDate,
            dueDate: dueDate,
            department: randomChoice(departments)
        };
        
        records.push(record);
    }
    
    return records;
}

// ----------------------------------------------------------------------------
// BUILD TABLE DATA WITH PAGINATION
// ----------------------------------------------------------------------------

/**
 * Build table data structure with pagination
 * @param {Array} allRecords - All 500 records
 * @param {Array} columns - Column definitions
 * @param {Number} currentPage - Current page number
 * @param {Number} pageSize - Records per page
 */
function buildTableData(allRecords, columns, currentPage, pageSize) {
    // Calculate pagination
    var totalRecords = allRecords.length;
    var startIndex = (currentPage - 1) * pageSize;
    var endIndex = Math.min(startIndex + pageSize, totalRecords);
    
    // Get current page records
    var pageRecords = [];
    for (var i = startIndex; i < endIndex; i++) {
        pageRecords.push(allRecords[i]);
    }
    
    // Build table data
    var tableData = {
        columns: columns,
        data: pageRecords,
        pagination: {
            page: currentPage,
            pageSize: pageSize,
            totalRecords: totalRecords
        }
    };
    
    return JSON.stringify(tableData);
}

// ============================================================================
// EXAMPLE 1: 500 EMPLOYEE RECORDS
// ============================================================================

// Generate all 500 employee records
var allEmployees = generate500EmployeeRecords();

// Define columns
var employeeColumns = [
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

// Build table JSON with pagination
var currentPage = tw.local.currentPage || 1;
var pageSize = tw.local.pageSize || 100;

tw.local.tableDataJSON = buildTableData(allEmployees, employeeColumns, currentPage, pageSize);

// Log summary
tw.system.log("Generated 500 employee records");
tw.system.log("Current page: " + currentPage);
tw.system.log("Page size: " + pageSize);
tw.system.log("Total records: " + allEmployees.length);

// ============================================================================
// EXAMPLE 2: 500 ORDER RECORDS (Alternative - comment out Example 1 to use)
// ============================================================================

/*
var allOrders = generate500OrderRecords();

var orderColumns = [
    {
        field: "orderId",
        header: "Order #",
        sortable: true,
        width: "100px",
        align: "center",
        type: "number"
    },
    {
        field: "customerName",
        header: "Customer",
        sortable: true,
        type: "text"
    },
    {
        field: "orderDate",
        header: "Order Date",
        sortable: true,
        width: "120px",
        type: "date"
    },
    {
        field: "amount",
        header: "Amount",
        sortable: true,
        align: "right",
        width: "120px",
        type: "currency"
    },
    {
        field: "status",
        header: "Status",
        sortable: true,
        type: "badge",
        badgeMap: JSON.stringify({
            "Planning": { label: "Planning", color: "blue" },
            "In Progress": { label: "In Progress", color: "yellow" },
            "On Hold": { label: "On Hold", color: "gray" },
            "Completed": { label: "Completed", color: "green" },
            "Cancelled": { label: "Cancelled", color: "red" }
        })
    },
    {
        field: "priority",
        header: "Priority",
        sortable: true,
        width: "100px",
        type: "badge",
        badgeMap: JSON.stringify({
            "High": { label: "High", color: "red" },
            "Medium": { label: "Medium", color: "yellow" },
            "Low": { label: "Low", color: "blue" }
        })
    },
    {
        field: "city",
        header: "City",
        sortable: true,
        type: "text"
    },
    {
        field: "isPaid",
        header: "Paid",
        sortable: true,
        width: "80px",
        align: "center",
        type: "boolean"
    }
];

tw.local.tableDataJSON = buildTableData(allOrders, orderColumns, currentPage, pageSize);
*/

// ============================================================================
// EXAMPLE 3: 500 TASK RECORDS (Alternative - comment out Example 1 to use)
// ============================================================================

/*
var allTasks = generate500TaskRecords();

var taskColumns = [
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
        field: "assignedTo",
        header: "Assigned To",
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
            "Failed": { label: "Failed", color: "red" }
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
        field: "department",
        header: "Department",
        sortable: true,
        type: "text"
    },
    {
        field: "createdDate",
        header: "Created",
        sortable: true,
        width: "120px",
        type: "date"
    },
    {
        field: "dueDate",
        header: "Due Date",
        sortable: true,
        width: "120px",
        type: "date"
    }
];

tw.local.tableDataJSON = buildTableData(allTasks, taskColumns, currentPage, pageSize);
*/

// ============================================================================
// DONE! The table will display 500 records with pagination
// ============================================================================

// Made with Bob
