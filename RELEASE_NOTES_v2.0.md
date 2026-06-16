# reportUi Toolkit v2.0.1 - Release Notes

**Release Date**: June 14, 2026  
**Package**: `reportUi_2.0.1.twx`  
**Size**: 14.0 MB  
**BAW Version**: 24.0.1+

---

## 🎉 Major Release: Version 2.0

This major release introduces significant enhancements to the **DynamicServiceTable** widget with configurable visual themes and powerful client-side search functionality.

---

## ✨ New Features

### 1. Configurable Theme System

The DynamicServiceTable widget now supports two professional themes:

#### **Default Theme** (`styleTheme: "default"`)
- IBM Carbon Design System styling
- Light gray header (#f4f4f4) with dark text
- Professional, corporate appearance
- Best for enterprise applications requiring Carbon consistency

#### **Modern Theme** (`styleTheme: "modern"`)
- DynamicReportGrid-inspired design
- Deep navy header (#0f3460) with white text
- Enhanced visual hierarchy with alternating row colors
- Bright blue accents (#2e86de)
- Best for dashboards, reports, and data-heavy interfaces

**Configuration Example:**
```javascript
// In BAW Coach widget configuration
{
    styleTheme: "modern",  // or "default"
    title: "Employee Dashboard"
}
```

### 2. Client-Side Search Functionality

Real-time data filtering across all table columns:

- **Search-as-you-type**: Instant filtering without server round-trips
- **Multi-column search**: Searches across ALL columns simultaneously
- **Case-insensitive**: Finds matches regardless of case
- **Partial matching**: Matches anywhere in the text
- **Visual feedback**: Shows "X of Y (filtered)" in record count
- **Keyboard shortcuts**: ESC key to clear search
- **Smart empty state**: Shows "No results found for 'term'" when no matches

**Configuration Example:**
```javascript
{
    enableSearch: true,  // Default is true
    title: "Searchable Data Table"
}
```

---

## 📦 What's Included

### Widgets (19 Total)
All existing widgets plus enhanced DynamicServiceTable:

1. **Breadcrumb** - Navigation breadcrumb trail
2. **Carousel** - Image/content carousel slider
3. **DateOutput** - Formatted date display
4. **DynamicServiceTable** ⭐ **ENHANCED** - Dynamic data table with themes and search
5. **DynamicReportGrid** - Advanced report grid
6. **FileNetBrowser** - FileNet document browser
7. **FileNetImport** - FileNet document import
8. **FolderTree** - Hierarchical folder tree
9. **MarkdownViewer** - Markdown content renderer
10. **MultiCheckbox** - Multiple checkbox selection
11. **MultiDocumentUpload** - Multiple document upload
12. **MultiSelect** - Multiple item selection
13. **ProcessActivityTimeline** - Process activity timeline
14. **ProcessCircle** - Process status circle
15. **ProgressBar** - Progress indicator bar
16. **RiskFactor** - Risk factor indicator
17. **Stepper** - Step-by-step wizard
18. **TasksList** - Task list display
19. **Timeline** - Event timeline

### Business Objects (11 Total)
- BreadcrumbItem
- CarouselItem
- DocumentItem
- GridColumn
- GridDataResult
- GridLabels
- ProcessActivityEvent
- ProgressData
- StepItem
- TaskItem
- TimelineEvent

---

## 🔧 Technical Details

### DynamicServiceTable Enhancements

#### New Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `styleTheme` | String | "default" | Visual theme: "default" or "modern" |
| `enableSearch` | Boolean | true | Enable client-side search |

#### Files Modified

1. **config.json** - Added theme and search configuration options
2. **Layout.html** - Added search input component in header toolbar
3. **InlineCSS.css** - Complete rewrite with dual-theme support (831 lines)
   - Common base styles
   - Default theme (Carbon Design System)
   - Modern theme (DynamicReportGrid-inspired)
   - Search input styles
   - Responsive design
4. **inlineJavascript.js** - Enhanced with theme and search (608 lines)
   - Theme application logic
   - Search filtering functionality
   - State management for search
5. **events/change.js** - Updated for theme switching (276 lines)
   - Dynamic theme class application
   - Search state handling

#### New Documentation

- **THEMES_AND_SEARCH_GUIDE.md** (565 lines) - Comprehensive guide covering:
  - Theme configuration and comparison
  - Search functionality details
  - Usage examples and best practices
  - Troubleshooting guide
  - Migration guide

---

## 📊 Theme Comparison

| Feature | Default Theme | Modern Theme |
|---------|--------------|--------------|
| **Header Background** | Light Gray (#f4f4f4) | Deep Navy (#0f3460) |
| **Header Text** | Dark Gray (#161616) | White (#ffffff) |
| **Row Hover** | Light Blue (#e5f6ff) | Light Blue (#eef3fb) |
| **Alternating Rows** | White / Light Gray | White / Very Light Blue (#f9fafc) |
| **Badges** | Carbon colors | Enhanced contrast colors |
| **Search Input** | Carbon style | Modern with navy accents |
| **Design System** | IBM Carbon | DynamicReportGrid-inspired |
| **Overall Feel** | Corporate, Clean | Modern, Bold |
| **Best For** | Enterprise apps | Dashboards, Reports |

---

## 🚀 Usage Examples

### Example 1: Modern Dashboard with Search

```javascript
// BAW Script Node - Build table data
var tableData = {
    columns: [
        {
            field: "empId",
            header: "Employee ID",
            sortable: true,
            width: "120px",
            align: "center",
            type: "number"
        },
        {
            field: "name",
            header: "Name",
            sortable: true,
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
                "HR": { label: "HR", color: "yellow" }
            })
        },
        {
            field: "salary",
            header: "Salary",
            sortable: true,
            align: "right",
            type: "currency"
        }
    ],
    data: [
        { empId: 1001, name: "John Doe", department: "Engineering", salary: 85000 },
        { empId: 1002, name: "Jane Smith", department: "Sales", salary: 75000 }
    ],
    pagination: {
        page: 1,
        pageSize: 100,
        totalRecords: 2
    }
};

tw.local.tableDataJSON = JSON.stringify(tableData);
```

```javascript
// BAW Coach - Widget Configuration
{
    title: "Employee Dashboard",
    styleTheme: "modern",      // Use modern theme
    enableSearch: true,        // Enable search
    showRefresh: true,
    showRecordCount: true,
    enableRowSelection: true,
    pageSize: 100
}
```

### Example 2: Corporate Report (Default Theme, No Search)

```javascript
// BAW Coach - Widget Configuration
{
    title: "Quarterly Report",
    styleTheme: "default",     // Use default Carbon theme
    enableSearch: false,       // Disable search for reports
    showRefresh: false,
    showRecordCount: true,
    pageSize: 100
}
```

---

## 🔄 Migration Guide

### Upgrading from v1.x

**Good News**: This release is **100% backward compatible**!

- Existing implementations will continue to work without changes
- Default behavior uses "default" theme with search enabled
- No breaking changes to existing functionality

### Optional Enhancements

To take advantage of new features:

1. **Add Theme Selection**:
   ```javascript
   styleTheme: "modern"  // Add to widget configuration
   ```

2. **Configure Search**:
   ```javascript
   enableSearch: true  // Already default, but can be disabled
   ```

### Example Migration

**Before (v1.x):**
```javascript
{
    title: "My Table",
    showRefresh: true,
    pageSize: 100
}
```

**After (v2.0 with new features):**
```javascript
{
    title: "My Table",
    styleTheme: "modern",      // NEW: Add theme
    enableSearch: true,        // NEW: Enable search
    showRefresh: true,
    pageSize: 100
}
```

---

## 📖 Documentation

### Core Documentation
- **README.md** - Main widget documentation
- **THEMES_AND_SEARCH_GUIDE.md** - Comprehensive theme and search guide
- **BAW_TEST_DATA.md** - Data format and integration examples
- **SQL_INTEGRATION_GUIDE.md** - Database integration guide

### Integration Guides
- **BO_TO_JSON_CONVERTER.js** - Business Object conversion utilities
- **GENERIC_SQL_TEMPLATE.js** - Reusable SQL templates
- **LSW_TASK_EXAMPLE.js** - Complete LSW_TASK integration example

### Testing Resources
- **GENERATE_500_RECORDS.js** - Performance testing data generator
- **REDESIGN_SUMMARY.md** - Architecture and design decisions

---

## 🐛 Bug Fixes

- None (this is a feature release)

---

## ⚠️ Known Issues

- Unicode logging errors in Windows console (cosmetic only, does not affect functionality)
- Search performance may degrade with very large datasets (>1000 rows) - use server-side pagination

---

## 🔮 Future Enhancements

Potential features for future releases:

- Additional theme options (dark mode, custom themes)
- Advanced search with column-specific filters
- Export functionality (CSV, Excel)
- Column visibility toggle
- Column reordering
- Saved search filters

---

## 📋 Installation Instructions

### 1. Download Package
- File: `reportUi_2.0.1.twx`
- Location: `BOB-BAW/output/reportUi_2.0.1.twx`
- Size: 14.0 MB

### 2. Import to BAW

#### Option A: Process Center (Recommended)
1. Open IBM Process Center
2. Navigate to **Process Apps** > **Toolkits**
3. Click **Import**
4. Select `reportUi_2.0.1.twx`
5. Click **Import**

#### Option B: Process Designer
1. Open IBM Process Designer
2. Go to **File** > **Import**
3. Select **Process Application or Toolkit**
4. Browse to `reportUi_2.0.1.twx`
5. Click **Import**

### 3. Verify Installation
1. Open Process Designer
2. Create a new Coach
3. Check widget palette for "reportUi" toolkit
4. Verify all 19 widgets are available
5. Test DynamicServiceTable with both themes

---

## 🎯 Testing Recommendations

### Theme Testing
1. Create a test coach with DynamicServiceTable
2. Test with `styleTheme: "default"`
3. Test with `styleTheme: "modern"`
4. Verify visual appearance matches documentation
5. Test theme switching dynamically

### Search Testing
1. Load sample data (use GENERATE_500_RECORDS.js)
2. Test search across different column types
3. Verify case-insensitive matching
4. Test ESC key to clear search
5. Verify filtered record count display

### Integration Testing
1. Test with SQL data sources
2. Test with Business Object data
3. Test pagination with search
4. Test sorting with search active
5. Test event handlers (onSort, onPageChange, etc.)

---

## 💡 Best Practices

### Theme Selection

**Use Default Theme When:**
- Building enterprise applications
- Need Carbon Design System consistency
- Corporate/professional look required
- Integrating with other Carbon components

**Use Modern Theme When:**
- Building dashboards and reports
- Need visual hierarchy and contrast
- Data-heavy interfaces
- Modern, bold aesthetic desired

### Search Optimization

**For Best Performance:**
1. Limit data to current page (use server-side pagination)
2. Keep column count reasonable (< 15 columns)
3. Use meaningful column headers
4. Consider adding search hints in placeholder text

---

## 🤝 Support

For issues or questions:
1. Review the comprehensive documentation
2. Check THEMES_AND_SEARCH_GUIDE.md for troubleshooting
3. Contact your BAW administrator
4. Refer to IBM BAW documentation

---

## 📝 Version History

### v2.0.1 (June 14, 2026)
- ✨ Added configurable theme system (default/modern)
- ✨ Added client-side search functionality
- 📚 Comprehensive documentation updates
- 🎨 Enhanced visual design options

### v1.0.7 (Previous)
- Base functionality with DynamicReportGrid and other widgets

---

## 👥 Credits

**Developed with Bob** 🤖 - AI-powered BAW widget development assistant

---

## 📄 License

This toolkit is part of the IBM Business Automation Workflow ecosystem.

---

**End of Release Notes**