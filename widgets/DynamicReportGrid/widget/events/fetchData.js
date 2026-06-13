/**
 * FetchData Event Handler for DynamicReportGrid
 * 
 * This event is fired when the grid needs data from the server.
 * Connect this event to a service flow that fetches data based on the parameters.
 * 
 * Event Data Contains:
 * - offset: Starting row number (e.g., 0, 25, 50)
 * - limit: Number of rows to fetch (e.g., 25, 50, 100)
 * - sortColumn: Column field name to sort by
 * - sortDirection: Sort direction (ASC or DESC)
 * - currentPage: Current page number (1-based)
 * - timestamp: Event timestamp
 * 
 * Expected Response:
 * Update the widget's bound data (GridDataResult) with:
 * - rows: Array of row objects for current page
 * - totalRows: Total number of rows in complete dataset
 * - currentPage: Current page number
 * - pageSize: Rows per page
 * - sortColumn: Current sort column
 * - sortDirection: Current sort direction
 * - error: Error message (if any)
 * - executionTime: Query execution time in ms
 */

// The event data is available in the 'event' object
// Use event.offset, event.limit, event.sortColumn, event.sortDirection

// Example: Call a service flow to fetch data
// tw.local.gridData = tw.system.invokeService(
//   "FetchGridData",
//   {
//     offset: event.offset,
//     limit: event.limit,
//     sortColumn: event.sortColumn,
//     sortDirection: event.sortDirection
//   }
// );

// Made with Bob
