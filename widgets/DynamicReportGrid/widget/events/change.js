/**
 * Change Event Handler for DynamicReportGrid
 * 
 * This event is fired whenever the grid data changes (page navigation, sorting, etc.)
 * It provides the current grid state to parent components.
 */

// Get the current grid state from the widget
var gridData = this.getData();

// Fire the change event with current state
this.context.trigger("change", {
  currentPage: gridData ? gridData.currentPage : 1,
  pageSize: gridData ? gridData.pageSize : 25,
  sortColumn: gridData ? gridData.sortColumn : "",
  sortDirection: gridData ? gridData.sortDirection : "ASC",
  totalRows: gridData ? gridData.totalRows : 0,
  rowCount: gridData && gridData.rows ? gridData.rows.length : 0,
  hasError: gridData ? !!gridData.error : false,
  timestamp: new Date().getTime()
});

// Made with Bob
