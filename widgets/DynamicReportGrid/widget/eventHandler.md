# DynamicReportGrid - Event Handlers

## Overview

The DynamicReportGrid widget fires events for all user interactions and data operations, enabling parent components to react to grid state changes, track user behavior, and implement custom logic.

## Event List

1. [pageChange](#pagechange) - User navigates to different page
2. [sortChange](#sortchange) - User changes sort column or direction
3. [pageSizeChange](#pagesizechange) - User changes rows per page
4. [dataLoaded](#dataloaded) - Data fetch completes successfully
5. [dataError](#dataerror) - Data fetch fails

## Event Details

### pageChange

**Fired When**: User clicks pagination buttons (First, Previous, Next, Last)

**Event Data**:
```javascript
{
  currentPage: 2,              // New current page number (1-based)
  previousPage: 1,             // Previous page number
  pageSize: 25,                // Current page size
  sortColumn: "order_date",    // Current sort column
  sortDirection: "DESC",       // Current sort direction
  totalPages: 50,              // Total number of pages
  totalRows: 1250              // Total rows in dataset
}
```

**Use Cases**:
- Track user navigation patterns
- Log page view analytics
- Update URL parameters for bookmarking
- Trigger related data loads
- Show page-specific help text

**Example Handler**:
```javascript
// In parent coach or service flow
function onPageChange(event) {
  var data = event.data;
  console.log("User navigated to page " + data.currentPage);
  
  // Update URL for bookmarking
  updateURLParameter("page", data.currentPage);
  
  // Track analytics
  trackEvent("grid_page_change", {
    page: data.currentPage,
    pageSize: data.pageSize
  });
}
```

### sortChange

**Fired When**: User clicks a sortable column header

**Event Data**:
```javascript
{
  sortColumn: "customer_name",     // New sort column field name
  sortDirection: "ASC",            // New sort direction (ASC or DESC)
  previousColumn: "order_date",    // Previous sort column
  previousDirection: "DESC",       // Previous sort direction
  currentPage: 1,                  // Reset to page 1 after sort
  pageSize: 25                     // Current page size
}
```

**Important**: Sorting always resets to page 1 to show the beginning of the newly sorted dataset.

**Use Cases**:
- Track which columns users sort by
- Log sort preferences for user profiles
- Update URL parameters
- Trigger dependent data refreshes
- Show sort-specific help text

**Example Handler**:
```javascript
function onSortChange(event) {
  var data = event.data;
  console.log("Sorted by " + data.sortColumn + " " + data.sortDirection);
  
  // Save user preference
  saveUserPreference("defaultSort", {
    column: data.sortColumn,
    direction: data.sortDirection
  });
  
  // Update URL
  updateURLParameter("sort", data.sortColumn);
  updateURLParameter("dir", data.sortDirection);
}
```

### pageSizeChange

**Fired When**: User selects a different page size from dropdown

**Event Data**:
```javascript
{
  newPageSize: 50,             // New page size
  previousPageSize: 25,        // Previous page size
  resetToPage: 1,              // Always resets to page 1
  totalPages: 25,              // New total pages (recalculated)
  totalRows: 1250,             // Total rows (unchanged)
  sortColumn: "order_date",    // Current sort column
  sortDirection: "DESC"        // Current sort direction
}
```

**Important**: Changing page size always resets to page 1 and recalculates total pages.

**Use Cases**:
- Track user preferences for page size
- Save page size preference
- Adjust UI layout based on page size
- Log user behavior
- Update URL parameters

**Example Handler**:
```javascript
function onPageSizeChange(event) {
  var data = event.data;
  console.log("Page size changed from " + data.previousPageSize + " to " + data.newPageSize);
  
  // Save preference
  saveUserPreference("pageSize", data.newPageSize);
  
  // Adjust container height if needed
  if (data.newPageSize > 50) {
    adjustGridHeight("large");
  }
  
  // Update URL
  updateURLParameter("pageSize", data.newPageSize);
}
```

### dataLoaded

**Fired When**: Server successfully returns data and grid renders

**Event Data**:
```javascript
{
  rowCount: 25,                // Number of rows in current page
  totalRows: 1250,             // Total rows in complete dataset
  currentPage: 1,              // Current page number
  pageSize: 25,                // Rows per page
  sortColumn: "order_date",    // Current sort column
  sortDirection: "DESC",       // Current sort direction
  executionTime: 45,           // Query execution time in milliseconds
  timestamp: 1704067200000     // Event timestamp
}
```

**Use Cases**:
- Hide loading indicators
- Show success messages
- Track query performance
- Log successful data loads
- Enable dependent UI elements
- Update summary statistics

**Example Handler**:
```javascript
function onDataLoaded(event) {
  var data = event.data;
  console.log("Loaded " + data.rowCount + " rows in " + data.executionTime + "ms");
  
  // Hide loading overlay
  hideLoadingOverlay();
  
  // Show success message if slow query
  if (data.executionTime > 5000) {
    showNotification("Data loaded successfully (took " + (data.executionTime / 1000) + " seconds)");
  }
  
  // Track performance
  trackMetric("grid_load_time", data.executionTime);
  
  // Update summary
  updateSummaryText("Showing " + data.rowCount + " of " + data.totalRows + " records");
}
```

### dataError

**Fired When**: Server returns an error or query fails

**Event Data**:
```javascript
{
  error: "Connection timeout after 30 seconds",  // Error message
  errorCode: "TIMEOUT",                          // Error code (if available)
  sqlTemplate: "SELECT...",                      // SQL template that failed
  parameters: {                                  // Parameters used
    offset: 0,
    limit: 25,
    sortColumn: "order_date",
    sortDirection: "DESC"
  },
  currentPage: 1,                                // Page that failed to load
  pageSize: 25,                                  // Page size attempted
  timestamp: 1704067200000,                      // Error timestamp
  retryable: true                                // Whether error is retryable
}
```

**Use Cases**:
- Show error messages to user
- Log errors for debugging
- Implement retry logic
- Disable UI elements
- Show fallback content
- Track error rates

**Example Handler**:
```javascript
function onDataError(event) {
  var data = event.data;
  console.error("Grid error:", data.error);
  
  // Show user-friendly error message
  showErrorNotification("Unable to load data: " + data.error);
  
  // Log error for debugging
  logError({
    component: "DynamicReportGrid",
    error: data.error,
    errorCode: data.errorCode,
    parameters: data.parameters,
    timestamp: data.timestamp
  });
  
  // Implement retry logic for retryable errors
  if (data.retryable && retryCount < 3) {
    setTimeout(function() {
      retryCount++;
      refreshGrid();
    }, 2000);
  }
  
  // Track error metrics
  trackError("grid_load_error", {
    errorCode: data.errorCode,
    page: data.currentPage
  });
}
```

## Event Binding in BAW

### In Coach Designer

1. Select the DynamicReportGrid widget
2. Go to the Events tab
3. Select the event (e.g., "pageChange")
4. Choose binding type:
   - **Service**: Call a service flow
   - **Script**: Execute inline JavaScript
   - **Event Handler**: Fire a coach-level event

### Service Flow Binding

**Input Variables** (automatically passed):
```javascript
{
  eventData: {/* event-specific data */},
  widgetId: "DynamicReportGrid_1",
  eventType: "pageChange"
}
```

**Example Service Flow**:
```
Input: eventData (ANY)
Steps:
  1. Log Event
  2. Update Analytics
  3. Refresh Related Data
Output: (none)
```

### Script Binding

```javascript
// Access event data
var eventData = event.data;

// Access widget
var grid = page.ui.get("DynamicReportGrid_1");

// Example: Update URL on page change
if (event.type === "pageChange") {
  window.history.pushState(
    {},
    "",
    "?page=" + eventData.currentPage + 
    "&sort=" + eventData.sortColumn +
    "&dir=" + eventData.sortDirection
  );
}
```

## Event Sequence

### Initial Load
```
1. Widget initialized
2. fetchData() called
3. [Loading state shown]
4. Server responds
5. dataLoaded event fired
6. Grid rendered
```

### Page Navigation
```
1. User clicks Next button
2. pageChange event fired
3. fetchData() called with new page
4. [Loading state shown]
5. Server responds
6. dataLoaded event fired
7. Grid updated
```

### Sort Change
```
1. User clicks column header
2. sortChange event fired
3. State updated (page reset to 1)
4. fetchData() called with new sort
5. [Loading state shown]
6. Server responds
7. dataLoaded event fired
8. Grid updated
```

### Page Size Change
```
1. User selects new page size
2. pageSizeChange event fired
3. State updated (page reset to 1)
4. fetchData() called with new size
5. [Loading state shown]
6. Server responds
7. dataLoaded event fired
8. Grid updated
```

### Error Scenario
```
1. User action triggers fetch
2. fetchData() called
3. [Loading state shown]
4. Server returns error
5. dataError event fired
6. Error message displayed
7. Grid shows error state
```

## Event Chaining

Events can trigger other events through parent component logic:

```javascript
// Example: Refresh related data when sort changes
function onSortChange(event) {
  var sortColumn = event.data.sortColumn;
  
  // Refresh summary chart based on new sort
  if (sortColumn === "revenue") {
    refreshRevenueChart();
  }
  
  // Update related grids
  refreshRelatedGrid("details", {
    sortBy: sortColumn
  });
}
```

## Event Throttling

For performance, consider throttling event handlers:

```javascript
var throttleTimer;

function onPageChange(event) {
  clearTimeout(throttleTimer);
  throttleTimer = setTimeout(function() {
    // Actual handler logic
    processPageChange(event.data);
  }, 300);
}
```

## Error Recovery

Implement error recovery in event handlers:

```javascript
function onDataError(event) {
  var retryCount = 0;
  var maxRetries = 3;
  
  function retry() {
    if (retryCount < maxRetries) {
      retryCount++;
      console.log("Retry attempt " + retryCount);
      
      // Wait before retry (exponential backoff)
      setTimeout(function() {
        refreshGrid();
      }, Math.pow(2, retryCount) * 1000);
    } else {
      // Max retries reached
      showPermanentError("Unable to load data after " + maxRetries + " attempts");
    }
  }
  
  // Check if error is retryable
  if (event.data.retryable) {
    retry();
  }
}
```

## Analytics Integration

Track user interactions for analytics:

```javascript
// Google Analytics example
function trackGridEvent(eventType, eventData) {
  if (typeof gtag !== 'undefined') {
    gtag('event', eventType, {
      'event_category': 'DynamicReportGrid',
      'event_label': JSON.stringify(eventData),
      'value': eventData.currentPage || 0
    });
  }
}

// Use in event handlers
function onPageChange(event) {
  trackGridEvent('page_change', event.data);
}

function onSortChange(event) {
  trackGridEvent('sort_change', event.data);
}
```

## State Synchronization

Keep parent component state in sync:

```javascript
// Parent component state
var gridState = {
  currentPage: 1,
  pageSize: 25,
  sortColumn: "order_date",
  sortDirection: "DESC"
};

// Update on events
function onPageChange(event) {
  gridState.currentPage = event.data.currentPage;
  saveState();
}

function onSortChange(event) {
  gridState.sortColumn = event.data.sortColumn;
  gridState.sortDirection = event.data.sortDirection;
  gridState.currentPage = 1; // Reset to page 1
  saveState();
}

function onPageSizeChange(event) {
  gridState.pageSize = event.data.newPageSize;
  gridState.currentPage = 1; // Reset to page 1
  saveState();
}

function saveState() {
  // Save to session storage
  sessionStorage.setItem('gridState', JSON.stringify(gridState));
  
  // Or update URL
  updateURL(gridState);
}
```

## Best Practices

1. **Always handle dataError** - Provide user feedback for failures
2. **Log events** - Track user behavior and performance
3. **Implement retry logic** - Handle transient failures gracefully
4. **Update URL parameters** - Enable bookmarking and sharing
5. **Save user preferences** - Remember page size and sort preferences
6. **Throttle handlers** - Prevent excessive processing
7. **Track performance** - Monitor executionTime in dataLoaded
8. **Provide feedback** - Show loading states and success messages
9. **Handle edge cases** - Empty results, timeouts, network errors
10. **Test error scenarios** - Verify error handling works correctly

## Debugging Events

Enable event logging for debugging:

```javascript
// Add to coach initialization
var DEBUG_EVENTS = true;

function logEvent(eventType, eventData) {
  if (DEBUG_EVENTS) {
    console.log("[DynamicReportGrid Event]", eventType, eventData);
  }
}

// Use in all event handlers
function onPageChange(event) {
  logEvent("pageChange", event.data);
  // ... handler logic
}
```

## Event Data Validation

Validate event data before processing:

```javascript
function onPageChange(event) {
  // Validate event data
  if (!event.data || typeof event.data.currentPage !== 'number') {
    console.error("Invalid pageChange event data:", event.data);
    return;
  }
  
  // Safe to process
  var currentPage = event.data.currentPage;
  // ... handler logic
}