# DynamicReportGrid - Manual Creation in BAW Process Designer

This guide shows you how to manually create the DynamicReportGrid widget directly in IBM Business Automation Workflow Process Designer by copying and pasting the code.

---

## Prerequisites

- IBM Business Automation Workflow (BAW) v24.x or v25.x
- Access to Process Designer
- A toolkit or process application to work in

---

## Part 1: Create Business Objects

### Step 1: Create GridColumn Business Object

1. Open **Process Designer**
2. In your toolkit/process app, right-click on **Business Objects**
3. Select **New** → **Business Object**
4. Name it: `GridColumn`
5. Click **Finish**

6. Add these properties (click **+** button for each):

| Name | Type | List | Description |
|------|------|------|-------------|
| field | String | ☐ | Database column name |
| label | String | ☐ | Display label |
| dataType | String | ☐ | Data type |
| formatter | String | ☐ | Formatter function |
| width | String | ☐ | Column width |
| sortable | Boolean | ☐ | Is sortable |
| align | String | ☐ | Text alignment |

7. **Save** the business object

### Step 2: Create GridDataResult Business Object

1. Right-click on **Business Objects** → **New** → **Business Object**
2. Name it: `GridDataResult`
3. Click **Finish**

4. Add these properties:

| Name | Type | List | Description |
|------|------|------|-------------|
| rows | ANY | ☑ | Current page rows |
| totalRows | Integer | ☐ | Total row count |
| currentPage | Integer | ☐ | Current page number |
| pageSize | Integer | ☐ | Rows per page |
| sortColumn | String | ☐ | Sort column |
| sortDirection | String | ☐ | Sort direction |
| error | String | ☐ | Error message |
| executionTime | Integer | ☐ | Query time (ms) |

5. **Save** the business object

### Step 3: Create GridLabels Business Object

1. Right-click on **Business Objects** → **New** → **Business Object**
2. Name it: `GridLabels`
3. Click **Finish**

4. Add these properties:

| Name | Type | List | Description |
|------|------|------|-------------|
| firstPage | String | ☐ | First page label |
| previousPage | String | ☐ | Previous page label |
| nextPage | String | ☐ | Next page label |
| lastPage | String | ☐ | Last page label |
| pageInfo | String | ☐ | Page info template |
| rowsPerPage | String | ☐ | Rows per page label |
| showing | String | ☐ | Showing info template |

5. **Save** the business object

---

## Part 2: Create Coach View Widget

### Step 1: Create New Coach View

1. In Process Designer, right-click on **Coach Views**
2. Select **New** → **Coach View**
3. Name it: `DynamicReportGrid`
4. Click **Finish**

### Step 2: Configure Coach View Properties

1. In the **Overview** tab, set:
   - **Name**: `DynamicReportGrid`
   - **Description**: `Production-ready server-side paginated data grid`

2. Click on the **Behavior** tab

3. In the **Binding** section:
   - **Type**: Select `GridDataResult`
   - **List**: Unchecked (☐)

### Step 3: Add Configuration Options

1. Click on the **Configuration Options** tab
2. Click **Add** button for each option below:

**Option 1: columns**
- Name: `columns`
- Type: `GridColumn`
- List: ☑ (checked)
- Label: `Column Definitions`
- Description: `Array of column definitions`
- Required: ☑

**Option 2: pageSize**
- Name: `pageSize`
- Type: `Integer`
- List: ☐
- Label: `Initial Page Size`
- Default Value: `25`

**Option 3: pageSizeOptions**
- Name: `pageSizeOptions`
- Type: `Integer`
- List: ☑
- Label: `Page Size Options`
- Default Value: `[10, 25, 50, 100]`

**Option 4: defaultSortColumn**
- Name: `defaultSortColumn`
- Type: `String`
- List: ☐
- Label: `Default Sort Column`
- Default Value: `""`

**Option 5: defaultSortDirection**
- Name: `defaultSortDirection`
- Type: `String`
- List: ☐
- Label: `Default Sort Direction`
- Default Value: `"ASC"`

**Option 6: size**
- Name: `size`
- Type: `String`
- List: ☐
- Label: `Grid Size`
- Default Value: `"medium"`

**Option 7: showStatusColumn**
- Name: `showStatusColumn`
- Type: `Boolean`
- List: ☐
- Label: `Show Status Column`
- Default Value: `false`

**Option 8: statusColumnField**
- Name: `statusColumnField`
- Type: `String`
- List: ☐
- Label: `Status Column Field`
- Default Value: `"status"`

**Option 9: enableKeyboardNav**
- Name: `enableKeyboardNav`
- Type: `Boolean`
- List: ☐
- Label: `Enable Keyboard Navigation`
- Default Value: `true`

**Option 10: labels**
- Name: `labels`
- Type: `GridLabels`
- List: ☐
- Label: `UI Labels`

**Option 11: loadingText**
- Name: `loadingText`
- Type: `String`
- List: ☐
- Label: `Loading Text`
- Default Value: `"Loading data..."`

**Option 12: errorText**
- Name: `errorText`
- Type: `String`
- List: ☐
- Label: `Error Text`
- Default Value: `"Error loading data. Please try again."`

**Option 13: noDataText**
- Name: `noDataText`
- Type: `String`
- List: ☐
- Label: `No Data Text`
- Default Value: `"No data available"`

**Option 14: autoRefresh**
- Name: `autoRefresh`
- Type: `Boolean`
- List: ☐
- Label: `Auto Refresh on Events`
- Default Value: `false`

3. **Save** the coach view

### Step 4: Add Events

1. Click on the **Events** tab
2. Click **Add** button for each event:

**Event 1: fetchData**
- Name: `fetchData`
- Description: `Fired when grid needs data - connect to service flow`

**Event 2: pageChange**
- Name: `pageChange`
- Description: `Fired when user navigates to a different page`

**Event 3: sortChange**
- Name: `sortChange`
- Description: `Fired when user changes sort column or direction`

**Event 4: pageSizeChange**
- Name: `pageSizeChange`
- Description: `Fired when user changes page size`

**Event 5: dataLoaded**
- Name: `dataLoaded`
- Description: `Fired when data fetch completes successfully`

**Event 6: dataError**
- Name: `dataError`
- Description: `Fired when data fetch fails`

3. **Save** the coach view

---

## Part 3: Add HTML Layout

### Step 1: Open Layout Editor

1. Click on the **Layout** tab in the coach view
2. You'll see a visual editor

### Step 2: Switch to HTML Source

1. Click the **Source** button (usually at bottom or in toolbar)
2. This opens the HTML source editor

### Step 3: Copy and Paste HTML

1. **Delete all existing HTML** in the editor
2. Open the file: [`BOB-BAW/widgets/DynamicReportGrid/widget/Layout.html`](widget/Layout.html)
3. **Copy ALL the HTML content** from that file
4. **Paste** it into the BAW HTML source editor
5. Click **OK** or **Apply** to save
6. **Save** the coach view

---

## Part 4: Add CSS Styling

### Step 1: Open Inline CSS Editor

1. In the coach view, click on the **Inline CSS** tab
2. You'll see a CSS editor

### Step 2: Copy and Paste CSS

1. **Delete all existing CSS** (if any)
2. Open the file: [`BOB-BAW/widgets/DynamicReportGrid/widget/InlineCSS.css`](widget/InlineCSS.css)
3. **Copy ALL the CSS content** from that file (429 lines)
4. **Paste** it into the BAW Inline CSS editor
5. **Save** the coach view

---

## Part 5: Add JavaScript Logic

### Step 1: Open Inline JavaScript Editor

1. In the coach view, click on the **Inline JavaScript** tab
2. You'll see a JavaScript editor

### Step 2: Copy and Paste JavaScript

1. **Delete all existing JavaScript** (if any)
2. Open the file: [`BOB-BAW/widgets/DynamicReportGrid/widget/inlineJavascript.js`](widget/inlineJavascript.js)
3. **Copy ALL the JavaScript content** from that file (738 lines)
4. **Paste** it into the BAW Inline JavaScript editor
5. **Save** the coach view

---

## Part 6: Test the Widget

### Step 1: Create Test Service Flow

1. Create a new **Service Flow** named `FetchGridData`
2. Add **Input Variables**:
   - `offset` (Integer)
   - `limit` (Integer)
   - `sortColumn` (String)
   - `sortDirection` (String)

3. Add **Output Variable**:
   - `gridData` (GridDataResult)

4. Add **SQL Execute** activity:
   ```sql
   SELECT 
     order_id,
     customer_name,
     order_date,
     total_amount,
     status
   FROM orders
   ORDER BY ${sortColumn} ${sortDirection}
   LIMIT ${limit} OFFSET ${offset}
   ```

5. Add another **SQL Execute** for count:
   ```sql
   SELECT COUNT(*) as total FROM orders
   ```

6. Add **Script** activity to build result:
   ```javascript
   tw.local.gridData = new tw.object.GridDataResult();
   tw.local.gridData.rows = tw.local.sqlResults;
   tw.local.gridData.totalRows = tw.local.totalCount;
   tw.local.gridData.currentPage = Math.floor(tw.local.offset / tw.local.limit) + 1;
   tw.local.gridData.pageSize = tw.local.limit;
   tw.local.gridData.sortColumn = tw.local.sortColumn;
   tw.local.gridData.sortDirection = tw.local.sortDirection;
   tw.local.gridData.error = null;
   tw.local.gridData.executionTime = 50;
   ```

7. **Save** the service flow

### Step 2: Create Test Coach

1. Create a new **Human Service** named `TestDynamicReportGrid`
2. Add a **Coach** to the service
3. Add **Private Variables**:
   - `columns` (GridColumn, List)
   - `gridData` (GridDataResult)

4. In Coach **Load** event:
   ```javascript
   // Initialize columns
   tw.local.columns = new tw.object.listOf.GridColumn();
   
   var col1 = new tw.object.GridColumn();
   col1.field = "order_id";
   col1.label = "Order ID";
   col1.dataType = "number";
   col1.sortable = true;
   col1.align = "right";
   tw.local.columns.insertIntoList(tw.local.columns.listLength, col1);
   
   var col2 = new tw.object.GridColumn();
   col2.field = "customer_name";
   col2.label = "Customer";
   col2.dataType = "string";
   col2.sortable = true;
   tw.local.columns.insertIntoList(tw.local.columns.listLength, col2);
   
   // Add more columns as needed...
   ```

5. **Drag** your `DynamicReportGrid` widget onto the coach
6. Configure widget properties:
   - columns: `${columns}`
   - pageSize: `25`
   - defaultSortColumn: `"order_id"`
   - defaultSortDirection: `"DESC"`
   - showStatusColumn: `true`

7. Bind widget to: `${gridData}`

8. Add **fetchData** event handler:
   ```javascript
   tw.local.gridData = tw.system.invokeService(
     "FetchGridData",
     {
       offset: event.offset,
       limit: event.limit,
       sortColumn: event.sortColumn,
       sortDirection: event.sortDirection
     }
   );
   ```

9. **Save** everything

### Step 3: Run and Test

1. Click **Run** on the Human Service
2. The coach should open with the grid
3. Test:
   - ✅ Click column headers to sort
   - ✅ Click pagination buttons
   - ✅ Change page size
   - ✅ Verify data loads correctly

---

## Troubleshooting

### Widget Not Appearing in Palette

**Solution**: 
1. Save the coach view
2. Refresh Process Designer (Ctrl+F5)
3. Check that coach view is in correct toolkit

### JavaScript Errors

**Solution**:
1. Open browser Developer Tools (F12)
2. Check Console tab for errors
3. Verify all code was copied correctly
4. Check for missing semicolons or brackets

### No Data Displayed

**Solution**:
1. Verify fetchData event handler is configured
2. Check service flow returns GridDataResult
3. Verify database table has data
4. Check browser console for errors

### Styling Issues

**Solution**:
1. Verify all CSS was copied
2. Check for CSS conflicts with other widgets
3. Clear browser cache
4. Verify Carbon Design System variables are available

---

## Summary Checklist

- [ ] Created GridColumn business object
- [ ] Created GridDataResult business object
- [ ] Created GridLabels business object
- [ ] Created DynamicReportGrid coach view
- [ ] Added configuration options (14 options)
- [ ] Added events (6 events)
- [ ] Copied HTML layout
- [ ] Copied CSS styling
- [ ] Copied JavaScript logic
- [ ] Created FetchGridData service flow
- [ ] Created test coach
- [ ] Added fetchData event handler
- [ ] Tested pagination
- [ ] Tested sorting
- [ ] Tested page size changes

---

## Next Steps

Once the widget is working:

1. **Add More Columns**: Modify the column initialization in coach load event
2. **Add Filtering**: Extend service flow to accept filter parameters
3. **Add Export**: Add button to export grid data
4. **Customize Styling**: Modify CSS for your brand colors
5. **Add Refresh Button**: Add manual refresh capability

---

## Tips

1. **Copy Carefully**: Make sure to copy ALL the code from each file
2. **Save Often**: Save after each major step
3. **Test Incrementally**: Test after adding HTML, CSS, and JavaScript
4. **Use Browser DevTools**: F12 to debug JavaScript issues
5. **Check Console**: Always check browser console for errors

---

**Congratulations!** You've manually created the DynamicReportGrid widget in BAW! 🎉

For usage examples and advanced features, see:
- [SERVICE_BASED_USAGE.md](SERVICE_BASED_USAGE.md) - Complete usage guide
- [MANUAL_SETUP_GUIDE.md](MANUAL_SETUP_GUIDE.md) - Detailed setup instructions