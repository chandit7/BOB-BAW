# DynamicReportGrid - Manual Setup Guide for BAW

This guide walks you through manually creating and testing the DynamicReportGrid widget in IBM Business Automation Workflow (BAW) environment.

## Prerequisites

- IBM Business Automation Workflow (BAW) v24.x or v25.x
- Access to Process Designer
- Database with sample data (or use BAW's built-in database)
- Admin permissions to create toolkits and process applications

---

## Part 1: Package the Widget (Automated)

### Option A: Using BAW Package Manager Mode (Recommended)

1. **Switch to Package Manager Mode**
   ```
   Ask Bob: "Switch to BAW Package Manager mode"
   ```

2. **Package the Widget**
   ```
   Ask Bob: "Package the DynamicReportGrid widget"
   ```

3. **Result**: A TWX file will be created in `output/` directory

### Option B: Using Python Script

1. **Run the packaging script**
   ```bash
   cd BOB-BAW
   python3 package_baw.py
   ```

2. **Locate the TWX file**
   ```
   output/Custom_Widgets_{version}.twx
   ```

---

## Part 2: Import Widget into BAW

### Step 1: Access Process Designer

1. Open your BAW environment in a web browser
2. Navigate to **Process Designer**
3. Log in with your credentials

### Step 2: Import Toolkit

1. In Process Designer, click **File** → **Import**
2. Select **Process Application or Toolkit**
3. Click **Browse** and select the TWX file from `output/` directory
4. Click **Import**
5. Wait for import to complete (may take 1-2 minutes)

### Step 3: Verify Import

1. In the **Library** panel, expand **Toolkits**
2. Look for **Custom Widgets** (or your configured toolkit name)
3. Expand the toolkit and verify **DynamicReportGrid** appears under **Coach Views**

---

## Part 3: Create Test Database and Data

### Option A: Use BAW's Built-in Database

1. **Create a Test Table**

   In BAW Process Designer:
   - Go to **Servers** → **Database**
   - Execute this SQL:

   ```sql
   CREATE TABLE test_orders (
     order_id INT PRIMARY KEY,
     customer_name VARCHAR(200),
     order_date DATE,
     total_amount DECIMAL(10,2),
     status VARCHAR(50)
   );
   ```

2. **Insert Sample Data**

   ```sql
   INSERT INTO test_orders VALUES
   (1001, 'Acme Corporation', '2024-01-15', 15000.00, 'success'),
   (1002, 'TechStart Inc', '2024-01-14', 8500.00, 'warning'),
   (1003, 'Global Solutions', '2024-01-13', 22000.00, 'success'),
   (1004, 'Innovation Labs', '2024-01-12', 5500.00, 'info'),
   (1005, 'Digital Dynamics', '2024-01-11', 12000.00, 'error'),
   (1006, 'Smart Systems', '2024-01-10', 18500.00, 'success'),
   (1007, 'Future Tech', '2024-01-09', 9200.00, 'warning'),
   (1008, 'Cloud Nine', '2024-01-08', 31000.00, 'success'),
   (1009, 'Data Masters', '2024-01-07', 7800.00, 'info'),
   (1010, 'Code Crafters', '2024-01-06', 14500.00, 'success');
   
   -- Add more rows for pagination testing
   INSERT INTO test_orders 
   SELECT 
     1010 + generate_series(1, 90),
     'Customer ' || generate_series(1, 90),
     CURRENT_DATE - generate_series(1, 90),
     (random() * 50000 + 1000)::DECIMAL(10,2),
     CASE (random() * 4)::INT 
       WHEN 0 THEN 'success'
       WHEN 1 THEN 'warning'
       WHEN 2 THEN 'error'
       ELSE 'info'
     END;
   ```

### Option B: Use External Database

1. Configure JDBC data source in BAW
2. Create similar table structure
3. Note the JNDI name for later use

---

## Part 4: Create Business Objects

### Step 1: Create GridColumn Business Object

1. In Process Designer, create a new **Business Object**
2. Name it: `GridColumn`
3. Add these properties:

   | Name | Type | List | Description |
   |------|------|------|-------------|
   | field | String | No | Database column name |
   | label | String | No | Display label |
   | dataType | String | No | Data type |
   | formatter | String | No | Formatter function |
   | width | String | No | Column width |
   | sortable | Boolean | No | Is sortable |
   | align | String | No | Text alignment |

### Step 2: Create GridDataResult Business Object

1. Create another **Business Object**
2. Name it: `GridDataResult`
3. Add these properties:

   | Name | Type | List | Description |
   |------|------|------|-------------|
   | rows | ANY | Yes | Current page rows |
   | totalRows | Integer | No | Total row count |
   | currentPage | Integer | No | Current page number |
   | pageSize | Integer | No | Rows per page |
   | sortColumn | String | No | Sort column |
   | sortDirection | String | No | Sort direction |
   | error | String | No | Error message |
   | executionTime | Integer | No | Query time (ms) |

---

## Part 5: Create Database Service

### Step 1: Create Service Flow

1. In Process Designer, create a new **Service Flow**
2. Name it: `FetchGridData`

### Step 2: Add Input Variables

Add these input variables:

| Name | Type | Description |
|------|------|-------------|
| offset | Integer | Starting row |
| limit | Integer | Rows to fetch |
| sortColumn | String | Column to sort by |
| sortDirection | String | ASC or DESC |

### Step 3: Add Output Variable

| Name | Type | Description |
|------|------|-------------|
| gridData | GridDataResult | Result data |

### Step 4: Add SQL Execute Activity

1. Drag **SQL Execute** activity to the flow
2. Configure:
   - **Data Source**: Select your database
   - **SQL Statement**:

   ```sql
   SELECT 
     order_id,
     customer_name,
     order_date,
     total_amount,
     status
   FROM test_orders
   ORDER BY ${sortColumn} ${sortDirection}
   LIMIT ${limit} OFFSET ${offset}
   ```

3. Map input parameters to SQL parameters

### Step 5: Add Count Query

1. Add another **SQL Execute** activity
2. Configure:
   - **SQL Statement**:

   ```sql
   SELECT COUNT(*) as total FROM test_orders
   ```

3. Store result in a variable `totalCount`

### Step 6: Build GridDataResult

1. Add a **Script** activity
2. Add this JavaScript:

   ```javascript
   // Create result object
   tw.local.gridData = new tw.object.GridDataResult();
   
   // Map SQL results to rows
   tw.local.gridData.rows = tw.local.sqlResults; // From SQL Execute
   
   // Set metadata
   tw.local.gridData.totalRows = tw.local.totalCount;
   tw.local.gridData.currentPage = Math.floor(tw.local.offset / tw.local.limit) + 1;
   tw.local.gridData.pageSize = tw.local.limit;
   tw.local.gridData.sortColumn = tw.local.sortColumn;
   tw.local.gridData.sortDirection = tw.local.sortDirection;
   tw.local.gridData.error = null;
   tw.local.gridData.executionTime = 50; // Approximate
   ```

### Step 7: Save and Test Service

1. Save the service flow
2. Click **Run** to test
3. Provide test inputs:
   - offset: 0
   - limit: 25
   - sortColumn: "order_date"
   - sortDirection: "DESC"
4. Verify output contains rows and metadata

---

## Part 6: Create Test Coach

### Step 1: Create Human Service

1. Create a new **Human Service**
2. Name it: `TestDynamicReportGrid`

### Step 2: Add Coach

1. Add a **Coach** to the human service
2. Name it: `GridTestCoach`

### Step 3: Configure Coach Variables

Add these private variables:

| Name | Type | Initial Value |
|------|------|---------------|
| columns | GridColumn[] | (see below) |
| gridData | GridDataResult | null |
| currentOffset | Integer | 0 |
| currentLimit | Integer | 25 |
| currentSort | String | "order_date" |
| currentDirection | String | "DESC" |

### Step 4: Initialize Columns

In Coach's **Load** event, add:

```javascript
// Initialize column definitions
tw.local.columns = new tw.object.listOf.GridColumn();

var col1 = new tw.object.GridColumn();
col1.field = "order_id";
col1.label = "Order ID";
col1.dataType = "number";
col1.width = "100px";
col1.sortable = true;
col1.align = "right";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col1);

var col2 = new tw.object.GridColumn();
col2.field = "customer_name";
col2.label = "Customer";
col2.dataType = "string";
col2.width = "200px";
col2.sortable = true;
col2.align = "left";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col2);

var col3 = new tw.object.GridColumn();
col3.field = "order_date";
col3.label = "Order Date";
col3.dataType = "date";
col3.formatter = "date";
col3.width = "150px";
col3.sortable = true;
col3.align = "center";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col3);

var col4 = new tw.object.GridColumn();
col4.field = "total_amount";
col4.label = "Amount";
col4.dataType = "currency";
col4.formatter = "currency";
col4.width = "120px";
col4.sortable = true;
col4.align = "right";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col4);

var col5 = new tw.object.GridColumn();
col5.field = "status";
col5.label = "Status";
col5.dataType = "string";
col5.width = "100px";
col5.sortable = false;
col5.align = "center";
tw.local.columns.insertIntoList(tw.local.columns.listLength, col5);

// Initial data fetch
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: tw.local.currentOffset,
    limit: tw.local.currentLimit,
    sortColumn: tw.local.currentSort,
    sortDirection: tw.local.currentDirection
  }
);
```

### Step 5: Add Widget to Coach

1. In the Coach designer, find **DynamicReportGrid** in the palette
2. Drag it onto the coach canvas
3. Configure the widget properties:

   **Configuration Options:**
   - columns: `${columns}`
   - sqlTemplate: `"SELECT * FROM test_orders ORDER BY {{sortColumn}} {{sortDirection}} LIMIT {{limit}} OFFSET {{offset}}"`
   - connectionString: `"jdbc/YourDataSource"` (or your JNDI name)
   - pageSize: `25`
   - defaultSortColumn: `"order_date"`
   - defaultSortDirection: `"DESC"`
   - showStatusColumn: `true`
   - statusColumnField: `"status"`
   - size: `"medium"`

   **Data Binding:**
   - Bind to: `${gridData}`

### Step 6: Handle Events

Add event handlers for the widget:

**pageChange Event:**
```javascript
// Update offset based on new page
tw.local.currentOffset = (event.currentPage - 1) * event.pageSize;

// Fetch new data
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: tw.local.currentOffset,
    limit: tw.local.currentLimit,
    sortColumn: tw.local.currentSort,
    sortDirection: tw.local.currentDirection
  }
);
```

**sortChange Event:**
```javascript
// Update sort parameters
tw.local.currentSort = event.sortColumn;
tw.local.currentDirection = event.sortDirection;
tw.local.currentOffset = 0; // Reset to page 1

// Fetch new data
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: 0,
    limit: tw.local.currentLimit,
    sortColumn: tw.local.currentSort,
    sortDirection: tw.local.currentDirection
  }
);
```

**pageSizeChange Event:**
```javascript
// Update page size
tw.local.currentLimit = event.newPageSize;
tw.local.currentOffset = 0; // Reset to page 1

// Fetch new data
tw.local.gridData = tw.system.invokeService(
  "FetchGridData",
  {
    offset: 0,
    limit: tw.local.currentLimit,
    sortColumn: tw.local.currentSort,
    sortDirection: tw.local.currentDirection
  }
);
```

---

## Part 7: Test the Widget

### Step 1: Run the Human Service

1. Save all changes
2. Click **Run** on the Human Service
3. The coach should open in a new window/tab

### Step 2: Test Functionality

**Test Pagination:**
1. Click **Next** button - should load page 2
2. Click **Previous** button - should return to page 1
3. Click **Last** button - should jump to last page
4. Click **First** button - should return to page 1

**Test Sorting:**
1. Click on **Order ID** column header - should sort ascending
2. Click again - should sort descending
3. Try sorting by different columns

**Test Page Size:**
1. Change page size dropdown from 25 to 50
2. Verify more rows are displayed
3. Verify pagination controls update

**Test Status Badges:**
1. Verify status column shows color-coded badges:
   - Green for "success"
   - Yellow for "warning"
   - Red for "error"
   - Blue for "info"

### Step 3: Verify Server-Side Behavior

1. Open browser Developer Tools (F12)
2. Go to Network tab
3. Perform pagination/sorting actions
4. Verify each action triggers a new service call
5. Check that only current page data is returned

---

## Part 8: Troubleshooting

### Widget Not Appearing

**Problem**: Widget doesn't show in palette  
**Solution**:
1. Verify TWX import completed successfully
2. Refresh Process Designer (Ctrl+F5)
3. Check toolkit is activated in your process app

### No Data Displayed

**Problem**: Grid shows "No data available"  
**Solution**:
1. Verify database table has data
2. Check service flow returns GridDataResult
3. Verify data binding is correct
4. Check browser console for errors

### Sorting Not Working

**Problem**: Clicking headers doesn't sort  
**Solution**:
1. Verify sortable property is true in column definitions
2. Check sortChange event handler is configured
3. Verify SQL supports ORDER BY clause
4. Check column field names match database columns

### Pagination Not Working

**Problem**: Navigation buttons don't work  
**Solution**:
1. Verify totalRows is set correctly in GridDataResult
2. Check pageChange event handler is configured
3. Verify offset calculation is correct
4. Check service flow receives correct parameters

### Performance Issues

**Problem**: Grid is slow to load  
**Solution**:
1. Add database indexes on sortable columns
2. Reduce page size
3. Optimize SQL query
4. Check network latency
5. Verify database connection pool settings

---

## Part 9: Production Deployment

### Step 1: Export Toolkit

1. In Process Designer, select your toolkit
2. Click **File** → **Export**
3. Save TWX file to a secure location

### Step 2: Import to Production

1. Access production BAW environment
2. Import toolkit using same process as test
3. Verify all dependencies are available

### Step 3: Configure Production Database

1. Update connection strings for production
2. Verify database permissions
3. Test with production data volume

### Step 4: Monitor Performance

1. Track query execution times
2. Monitor page load times
3. Check for errors in logs
4. Gather user feedback

---

## Additional Resources

- **Widget Documentation**: See [`README.md`](README.md)
- **Data Model**: See [`widget/datamodel.md`](widget/datamodel.md)
- **Event Handling**: See [`widget/eventHandler.md`](widget/eventHandler.md)
- **IBM BAW Documentation**: https://www.ibm.com/docs/en/baw

---

## Quick Reference

### Minimum Required Configuration

```javascript
{
  columns: [/* GridColumn array */],
  sqlTemplate: "SELECT ... ORDER BY {{sortColumn}} {{sortDirection}} LIMIT {{limit}} OFFSET {{offset}}",
  connectionString: "jdbc/DataSource"
}
```

### Service Flow Signature

**Input:**
- offset (Integer)
- limit (Integer)
- sortColumn (String)
- sortDirection (String)

**Output:**
- gridData (GridDataResult)

### Event Handlers

All events should call service flow and update `gridData` binding.

---

**Need Help?** Check the troubleshooting section or review the comprehensive documentation in the widget's README file.