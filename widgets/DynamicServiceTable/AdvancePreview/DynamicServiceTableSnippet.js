// DynamicServiceTable Widget - Preview Sample Data

// Sample Task Report Data
const taskReportData = {
  columns: [
    { field: "taskId", header: "Task ID", sortable: true, width: "100px", type: "number" },
    { field: "taskName", header: "Task Name", sortable: true },
    { field: "status", header: "Status", sortable: false, type: "badge",
      badgeMap: { "RECEIVED": "blue", "CLOSED": "green", "FAILED": "red", "INPROCESS": "yellow" }
    },
    { field: "dueDate", header: "Due Date", sortable: true, type: "date" },
    { field: "assignedTo", header: "Assigned To", sortable: true }
  ],
  data: [
    { taskId: 10001, taskName: "Review Claim", status: "RECEIVED", dueDate: "2026-06-15", assignedTo: "John Smith" },
    { taskId: 10002, taskName: "Approve Authorization", status: "CLOSED", dueDate: "2026-06-10", assignedTo: "Jane Doe" },
    { taskId: 10003, taskName: "Process Payment", status: "INPROCESS", dueDate: "2026-06-20", assignedTo: "Bob Johnson" },
    { taskId: 10004, taskName: "Verify Documents", status: "RECEIVED", dueDate: "2026-06-18", assignedTo: "Alice Williams" },
    { taskId: 10005, taskName: "Quality Check", status: "FAILED", dueDate: "2026-06-12", assignedTo: "Charlie Brown" },
    { taskId: 10006, taskName: "Final Review", status: "CLOSED", dueDate: "2026-06-08", assignedTo: "Diana Prince" },
    { taskId: 10007, taskName: "Data Entry", status: "INPROCESS", dueDate: "2026-06-22", assignedTo: "Eve Davis" },
    { taskId: 10008, taskName: "Audit Report", status: "RECEIVED", dueDate: "2026-06-25", assignedTo: "Frank Miller" }
  ],
  pagination: {
    page: 1,
    pageSize: 100,
    totalRecords: 5000
  }
};

// Sample Claims Report Data
const claimsReportData = {
  columns: [
    { field: "claimId", header: "Claim ID", sortable: true, width: "120px", type: "number" },
    { field: "memberId", header: "Member ID", sortable: true, width: "120px" },
    { field: "amount", header: "Amount", sortable: true, type: "currency", align: "right" },
    { field: "claimDate", header: "Date", sortable: true, type: "date" },
    { field: "status", header: "Status", sortable: false, type: "badge",
      badgeMap: { "APPROVED": "green", "DENIED": "red", "PENDING": "yellow", "REVIEW": "blue" }
    }
  ],
  data: [
    { claimId: 50001, memberId: "M12345", amount: 1250.50, claimDate: "2026-06-01", status: "APPROVED" },
    { claimId: 50002, memberId: "M12346", amount: 850.00, claimDate: "2026-06-02", status: "PENDING" },
    { claimId: 50003, memberId: "M12347", amount: 2100.75, claimDate: "2026-06-03", status: "REVIEW" },
    { claimId: 50004, memberId: "M12348", amount: 450.25, claimDate: "2026-06-04", status: "DENIED" },
    { claimId: 50005, memberId: "M12349", amount: 3200.00, claimDate: "2026-06-05", status: "APPROVED" },
    { claimId: 50006, memberId: "M12350", amount: 675.50, claimDate: "2026-06-06", status: "PENDING" },
    { claimId: 50007, memberId: "M12351", amount: 1890.25, claimDate: "2026-06-07", status: "APPROVED" },
    { claimId: 50008, memberId: "M12352", amount: 520.00, claimDate: "2026-06-08", status: "REVIEW" }
  ],
  pagination: {
    page: 1,
    pageSize: 100,
    totalRecords: 12500
  }
};

// Sample User Activity Report Data
const userActivityData = {
  columns: [
    { field: "userId", header: "User ID", sortable: true, width: "100px" },
    { field: "userName", header: "User Name", sortable: true },
    { field: "action", header: "Action", sortable: true },
    { field: "timestamp", header: "Timestamp", sortable: true, type: "datetime" },
    { field: "status", header: "Status", sortable: false, type: "badge",
      badgeMap: { "SUCCESS": "green", "FAILED": "red", "WARNING": "yellow", "INFO": "blue" }
    }
  ],
  data: [
    { userId: "U001", userName: "admin", action: "Login", timestamp: "2026-06-13T09:15:30", status: "SUCCESS" },
    { userId: "U002", userName: "jsmith", action: "Update Record", timestamp: "2026-06-13T09:20:45", status: "SUCCESS" },
    { userId: "U003", userName: "jdoe", action: "Delete File", timestamp: "2026-06-13T09:25:12", status: "WARNING" },
    { userId: "U004", userName: "bjohnson", action: "Export Data", timestamp: "2026-06-13T09:30:00", status: "SUCCESS" },
    { userId: "U005", userName: "awilliams", action: "Login Attempt", timestamp: "2026-06-13T09:35:22", status: "FAILED" },
    { userId: "U006", userName: "cbrown", action: "View Report", timestamp: "2026-06-13T09:40:15", status: "INFO" },
    { userId: "U007", userName: "dprince", action: "Create Task", timestamp: "2026-06-13T09:45:30", status: "SUCCESS" },
    { userId: "U008", userName: "edavis", action: "Modify Settings", timestamp: "2026-06-13T09:50:45", status: "WARNING" }
  ],
  pagination: {
    page: 1,
    pageSize: 100,
    totalRecords: 8750
  }
};

// Helper function to generate large dataset for testing
function generateLargeDataset(count, reportType) {
  var data = [];
  var baseData = reportType === "tasks" ? taskReportData : 
                 reportType === "claims" ? claimsReportData : 
                 userActivityData;
  
  for (var i = 0; i < count; i++) {
    var row = {};
    baseData.columns.forEach(function(col) {
      if (col.type === "number") {
        row[col.field] = 10000 + i;
      } else if (col.type === "currency") {
        row[col.field] = Math.random() * 5000;
      } else if (col.type === "date") {
        var date = new Date(2026, 5, 1 + (i % 30));
        row[col.field] = date.toISOString().split('T')[0];
      } else if (col.type === "datetime") {
        row[col.field] = new Date(2026, 5, 13, 9 + (i % 12), i % 60, i % 60).toISOString();
      } else if (col.type === "badge") {
        var statuses = Object.keys(col.badgeMap);
        row[col.field] = statuses[i % statuses.length];
      } else {
        row[col.field] = col.field + " " + (i + 1);
      }
    });
    data.push(row);
  }
  
  return {
    columns: baseData.columns,
    data: data,
    pagination: {
      page: 1,
      pageSize: count,
      totalRecords: count * 10
    }
  };
}

// Export for use in preview
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    taskReportData,
    claimsReportData,
    userActivityData,
    generateLargeDataset
  };
}

// Made with Bob
