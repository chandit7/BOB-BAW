# DynamicServiceTable - Configuration and Event Handling Fix

## Issues Identified

### Issue 1: Configuration Options Not Working
**Problem**: Widget configuration options (pageSize, currentPage, etc.) are being ignored. The widget only uses values from the JSON data's pagination object.

**Root Cause**: In `inlineJavascript.js` lines 119-125, the widget directly uses `parsedData.pagination` values without considering the configuration options.

**Impact**: 
- Setting `pageSize` in widget configuration has no effect
- Setting `currentPage` in widget configuration has no effect
- JSON data always overrides configuration

### Issue 2: Next/Prev Buttons Not Firing Events
**Problem**: Clicking Next/Prev buttons doesn't trigger `onPageChange` event in BAW.

**Root Cause**: Event listeners are attached in `inlineJavascript.js` during initialization, but when `change.js` runs (on data update), it re-renders the DOM without re-attaching event listeners.

**Impact**:
- Pagination buttons appear but don't work
- No server-side page changes occur
- User is stuck on first page

## Solution

### Fix 1: Respect Configuration Options
The widget should use configuration options as the source of truth, with JSON data providing only the data rows and totalRecords.

**Logic**:
```javascript
// Configuration options take precedence
state.pagination = {
    page: config.currentPage,           // From widget config
    pageSize: config.pageSize,          // From widget config
    totalRecords: parsedData.pagination.totalRecords || 0  // From JSON data
};
```

### Fix 2: Re-attach Event Listeners in change.js
The `change.js` file must re-attach all event listeners after re-rendering the DOM.

**Required Changes**:
1. Extract event listener setup into a reusable function
2. Call this function in both `inlineJavascript.js` and `change.js`
3. Store widget context reference for event firing

## Implementation Plan

### Step 1: Update inlineJavascript.js
- Modify `updateFromJSON()` to respect config options
- Extract event listener setup into `setupEventListeners()` function
- Ensure function is reusable

### Step 2: Update change.js
- Add event listener setup after DOM re-render
- Store widget context reference
- Implement all event handlers (sort, page, refresh, row select)

### Step 3: Test Scenarios
1. Set pageSize=50 in widget config → Should display 50 rows per page
2. Set currentPage=2 in widget config → Should start on page 2
3. Click Next button → Should fire onPageChange event
4. Click Prev button → Should fire onPageChange event
5. Change page size dropdown → Should fire onPageSizeChange event
6. Click column header → Should fire onSort event
7. Click refresh button → Should fire onRefresh event
8. Click row → Should fire onRowSelect event

## Expected Behavior After Fix

### Configuration Priority
1. **Widget Configuration** (highest priority)
   - pageSize from config.json
   - currentPage from config.json
   - sortColumn from config.json
   - sortDirection from config.json

2. **JSON Data** (provides data only)
   - columns array
   - data array
   - pagination.totalRecords (total count from server)

### Event Flow
```
User clicks Next → 
  handlePageChange() → 
    widgetContext.fireEvent("onPageChange", {...}) → 
      BAW event handler receives event → 
        Updates tw.local.currentPage → 
          Calls service to fetch new page → 
            Updates tw.local.tableDataJSON → 
              Widget change.js runs → 
                Re-renders with new data
```

## Files to Modify

1. **BOB-BAW/widgets/DynamicServiceTable/widget/inlineJavascript.js**
   - Lines 94-126: Update `updateFromJSON()` function
   - Lines 519-569: Ensure `setupEventListeners()` is reusable

2. **BOB-BAW/widgets/DynamicServiceTable/widget/events/change.js**
   - Add after line 232: Event listener setup
   - Add widget context storage
   - Add all event handler functions

## Testing Checklist

- [ ] Widget respects pageSize configuration
- [ ] Widget respects currentPage configuration
- [ ] Next button fires onPageChange event
- [ ] Prev button fires onPageChange event
- [ ] Page size dropdown fires onPageSizeChange event
- [ ] Column headers fire onSort event
- [ ] Refresh button fires onRefresh event
- [ ] Row clicks fire onRowSelect event
- [ ] Events include correct parameters
- [ ] BAW event handlers receive events
- [ ] Server-side pagination works end-to-end

## Made with Bob