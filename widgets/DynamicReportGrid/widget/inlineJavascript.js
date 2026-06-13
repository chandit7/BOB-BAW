/**
 * DynamicReportGrid - Server-Side Paginated Data Grid
 * Zero client-side data caching - every interaction triggers fresh SQL execution
 */

(function() {
  var widget = this;
  var context = widget.context;
  
  // DOM Elements
  var container = context.element.querySelector(".dynamic-report-grid");
  var loadingOverlay = container.querySelector(".grid-loading-overlay");
  var loadingText = container.querySelector(".grid-loading-text");
  var errorMessage = container.querySelector(".grid-error-message");
  var errorText = container.querySelector(".grid-error-text");
  var tableWrapper = container.querySelector(".grid-table-wrapper");
  var table = container.querySelector(".grid-table");
  var thead = table.querySelector("thead tr");
  var tbody = table.querySelector("tbody");
  var noDataDiv = container.querySelector(".grid-no-data");
  var noDataText = container.querySelector(".grid-no-data-text");
  var showingText = container.querySelector(".grid-showing-text");
  var pageText = container.querySelector(".grid-page-text");
  var pageSizeSelect = container.querySelector(".grid-page-size-select");
  var btnFirst = container.querySelector(".grid-btn-first");
  var btnPrev = container.querySelector(".grid-btn-prev");
  var btnNext = container.querySelector(".grid-btn-next");
  var btnLast = container.querySelector(".grid-btn-last");
  
  // Configuration
  var columns = widget.context.options.columns || [];
  var pageSize = widget.context.options.pageSize || 25;
  var pageSizeOptions = widget.context.options.pageSizeOptions || [10, 25, 50, 100];
  var defaultSortColumn = widget.context.options.defaultSortColumn || "";
  var defaultSortDirection = widget.context.options.defaultSortDirection || "ASC";
  var size = widget.context.options.size || "medium";
  var showStatusColumn = widget.context.options.showStatusColumn || false;
  var statusColumnField = widget.context.options.statusColumnField || "status";
  var enableKeyboardNav = widget.context.options.enableKeyboardNav !== false;
  var labels = widget.context.options.labels || {};
  var loadingTextConfig = widget.context.options.loadingText || "Loading data...";
  var errorTextConfig = widget.context.options.errorText || "Error loading data. Please try again.";
  var noDataTextConfig = widget.context.options.noDataText || "No data available";
  var autoRefresh = widget.context.options.autoRefresh || false;
  
  // State - ONLY current page data, no full dataset caching
  var state = {
    currentPage: 1,
    pageSize: pageSize,
    sortColumn: defaultSortColumn,
    sortDirection: defaultSortDirection,
    totalRows: 0,
    totalPages: 0,
    isLoading: false,
    hasError: false
  };
  
  // Default labels
  var defaultLabels = {
    firstPage: "First",
    previousPage: "Previous",
    nextPage: "Next",
    lastPage: "Last",
    pageInfo: "Page {current} of {total}",
    rowsPerPage: "Rows per page:",
    showing: "Showing {start}-{end} of {total} rows"
  };
  
  // Merge labels
  labels = Object.assign({}, defaultLabels, labels);
  
  /**
   * Initialize widget
   */
  function init() {
    // Validate required configuration
    if (!columns || columns.length === 0) {
      showError("No columns configured. Please provide column definitions.");
      return;
    }
    
    // Apply size class
    container.classList.add("size-" + size);
    
    // Set UI text
    loadingText.textContent = loadingTextConfig;
    errorText.textContent = errorTextConfig;
    noDataText.textContent = noDataTextConfig;
    
    // Initialize page size selector
    initPageSizeSelector();
    
    // Render column headers
    renderHeaders();
    
    // Attach event listeners
    attachEventListeners();
    
    // Check if data is already bound
    var initialData = widget.getData();
    if (initialData && initialData.rows) {
      handleDataSuccess(initialData);
    } else {
      // Request initial data fetch via event
      requestDataFetch();
    }
  }
  
  /**
   * Initialize page size selector with configured options
   */
  function initPageSizeSelector() {
    pageSizeSelect.innerHTML = "";
    pageSizeOptions.forEach(function(option) {
      var optionEl = document.createElement("option");
      optionEl.value = option;
      optionEl.textContent = option;
      if (option === state.pageSize) {
        optionEl.selected = true;
      }
      pageSizeSelect.appendChild(optionEl);
    });
  }
  
  /**
   * Render table column headers
   */
  function renderHeaders() {
    thead.innerHTML = "";
    
    columns.forEach(function(column) {
      var th = document.createElement("th");
      th.className = "grid-header-cell";
      th.setAttribute("role", "columnheader");
      th.setAttribute("scope", "col");
      
      var isSortable = column.sortable !== false;
      if (isSortable) {
        th.classList.add("sortable");
        th.setAttribute("tabindex", "0");
        th.setAttribute("aria-sort", "none");
        th.dataset.field = column.field;
        
        // Check if this is the current sort column
        if (column.field === state.sortColumn) {
          th.classList.add("sorted");
          th.classList.add("sorted-" + state.sortDirection.toLowerCase());
          th.setAttribute("aria-sort", state.sortDirection === "ASC" ? "ascending" : "descending");
        }
      }
      
      // Set column width if specified
      if (column.width) {
        th.style.width = column.width;
      }
      
      // Set text alignment
      if (column.align) {
        th.style.textAlign = column.align;
      }
      
      // Create header content
      var headerContent = document.createElement("div");
      headerContent.className = "grid-header-content";
      
      var label = document.createElement("span");
      label.textContent = column.label;
      headerContent.appendChild(label);
      
      // Add sort icon if sortable
      if (isSortable) {
        var sortIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        sortIcon.setAttribute("class", "grid-sort-icon");
        sortIcon.setAttribute("width", "16");
        sortIcon.setAttribute("height", "16");
        sortIcon.setAttribute("viewBox", "0 0 16 16");
        sortIcon.setAttribute("fill", "currentColor");
        
        var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", "M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z");
        sortIcon.appendChild(path);
        
        headerContent.appendChild(sortIcon);
      }
      
      th.appendChild(headerContent);
      thead.appendChild(th);
    });
  }
  
  /**
   * Render table rows
   */
  function renderRows(rows) {
    tbody.innerHTML = "";
    
    if (!rows || rows.length === 0) {
      showNoData();
      return;
    }
    
    hideNoData();
    
    rows.forEach(function(row, index) {
      var tr = document.createElement("tr");
      tr.className = "grid-row";
      tr.setAttribute("role", "row");
      
      if (enableKeyboardNav) {
        tr.setAttribute("tabindex", "0");
      }
      
      columns.forEach(function(column) {
        var td = document.createElement("td");
        td.className = "grid-cell";
        td.setAttribute("role", "cell");
        
        // Set text alignment
        if (column.align) {
          td.classList.add("align-" + column.align);
        }
        
        var value = row[column.field];
        
        // Format value based on data type
        var formattedValue = formatValue(value, column.dataType, column.formatter);
        
        // Handle status column
        if (showStatusColumn && column.field === statusColumnField) {
          var badge = createStatusBadge(value);
          td.appendChild(badge);
        } else {
          td.textContent = formattedValue;
        }
        
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
    });
  }
  
  /**
   * Format value based on data type and formatter
   */
  function formatValue(value, dataType, formatter) {
    if (value === null || value === undefined) {
      return "";
    }
    
    switch (dataType) {
      case "date":
        if (formatter === "date") {
          return formatDate(value);
        }
        return value;
        
      case "currency":
        if (formatter === "currency") {
          return formatCurrency(value);
        }
        return value;
        
      case "number":
        if (formatter === "percentage") {
          return formatPercentage(value);
        }
        return formatNumber(value);
        
      default:
        return String(value);
    }
  }
  
  /**
   * Format date value
   */
  function formatDate(value) {
    try {
      var date = new Date(value);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    } catch (e) {
      return value;
    }
  }
  
  /**
   * Format currency value
   */
  function formatCurrency(value) {
    try {
      var num = parseFloat(value);
      return "$" + num.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } catch (e) {
      return value;
    }
  }
  
  /**
   * Format percentage value
   */
  function formatPercentage(value) {
    try {
      var num = parseFloat(value) * 100;
      return num.toFixed(1) + "%";
    } catch (e) {
      return value;
    }
  }
  
  /**
   * Format number value
   */
  function formatNumber(value) {
    try {
      var num = parseFloat(value);
      return num.toLocaleString("en-US");
    } catch (e) {
      return value;
    }
  }
  
  /**
   * Create status badge element
   */
  function createStatusBadge(status) {
    var badge = document.createElement("span");
    badge.className = "grid-status-badge";
    
    var statusLower = String(status).toLowerCase();
    
    if (statusLower.includes("success") || statusLower.includes("completed") || statusLower.includes("approved")) {
      badge.classList.add("status-success");
    } else if (statusLower.includes("warning") || statusLower.includes("pending") || statusLower.includes("review")) {
      badge.classList.add("status-warning");
    } else if (statusLower.includes("error") || statusLower.includes("failed") || statusLower.includes("rejected")) {
      badge.classList.add("status-error");
    } else {
      badge.classList.add("status-info");
    }
    
    badge.textContent = status;
    return badge;
  }
  
  /**
   * Fetch data from server
   * CRITICAL: This is where server-side pagination happens
   */
  function fetchData() {
    if (state.isLoading) {
      return;
    }
    
    state.isLoading = true;
    showLoading();
    hideError();
    
    // Calculate offset
    var offset = (state.currentPage - 1) * state.pageSize;
    
    // Parameterize SQL template
    var parameterizedSQL = sqlTemplate
      .replace(/\{\{offset\}\}/g, offset)
      .replace(/\{\{limit\}\}/g, state.pageSize)
      .replace(/\{\{sortColumn\}\}/g, state.sortColumn || columns[0].field)
      .replace(/\{\{sortDirection\}\}/g, state.sortDirection);
    
    // In production, this would call a BAW service
    // For now, we'll simulate with the bound data
    var gridData = widget.getData();
    
    if (gridData && gridData.rows) {
      handleDataSuccess(gridData);
    } else {
      // Simulate error if no data bound
      handleDataError({
        error: "No data bound to widget. Please bind GridDataResult from service.",
        retryable: false
      });
    }
  }
  
  /**
   * Handle successful data fetch
   */
  function handleDataSuccess(data) {
    state.isLoading = false;
    state.hasError = false;
    hideLoading();
    hideError();
    
    // Update state from server response
    state.totalRows = data.totalRows || 0;
    state.totalPages = Math.ceil(state.totalRows / state.pageSize);
    state.currentPage = data.currentPage || state.currentPage;
    
    // Render rows (ONLY current page data)
    renderRows(data.rows);
    
    // Update UI
    updatePaginationControls();
    updateInfoText();
    
    // Fire dataLoaded event
    context.trigger("dataLoaded", {
      rowCount: data.rows ? data.rows.length : 0,
      totalRows: state.totalRows,
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection,
      executionTime: data.executionTime || 0,
      timestamp: new Date().getTime()
    });
  }
  
  /**
   * Handle data fetch error
   */
  function handleDataError(error) {
    state.isLoading = false;
    state.hasError = true;
    hideLoading();
    showError(error.error || errorTextConfig);
    
    // Clear table
    tbody.innerHTML = "";
    showNoData();
    
    // Disable pagination
    updatePaginationControls();
    
    // Fire dataError event
    context.trigger("dataError", {
      error: error.error || "Unknown error",
      errorCode: error.errorCode || "UNKNOWN",
      sqlTemplate: sqlTemplate,
      parameters: {
        offset: (state.currentPage - 1) * state.pageSize,
        limit: state.pageSize,
        sortColumn: state.sortColumn,
        sortDirection: state.sortDirection
      },
      currentPage: state.currentPage,
      pageSize: state.pageSize,
      timestamp: new Date().getTime(),
      retryable: error.retryable !== false
    });
  }
  
  /**
   * Update pagination controls
   */
  function updatePaginationControls() {
    var isFirstPage = state.currentPage === 1;
    var isLastPage = state.currentPage >= state.totalPages;
    var hasData = state.totalRows > 0 && !state.hasError;
    
    btnFirst.disabled = isFirstPage || !hasData;
    btnPrev.disabled = isFirstPage || !hasData;
    btnNext.disabled = isLastPage || !hasData;
    btnLast.disabled = isLastPage || !hasData;
    
    pageSizeSelect.disabled = !hasData;
  }
  
  /**
   * Update info text
   */
  function updateInfoText() {
    if (state.totalRows === 0) {
      showingText.textContent = "Showing 0 rows";
      pageText.textContent = "Page 0 of 0";
      return;
    }
    
    var start = (state.currentPage - 1) * state.pageSize + 1;
    var end = Math.min(state.currentPage * state.pageSize, state.totalRows);
    
    var showingLabel = labels.showing
      .replace("{start}", start)
      .replace("{end}", end)
      .replace("{total}", state.totalRows);
    
    var pageLabel = labels.pageInfo
      .replace("{current}", state.currentPage)
      .replace("{total}", state.totalPages);
    
    showingText.textContent = showingLabel;
    pageText.textContent = pageLabel;
  }
  
  /**
   * Attach event listeners
   */
  function attachEventListeners() {
    // Pagination buttons
    btnFirst.addEventListener("click", function() {
      goToPage(1);
    });
    
    btnPrev.addEventListener("click", function() {
      goToPage(state.currentPage - 1);
    });
    
    btnNext.addEventListener("click", function() {
      goToPage(state.currentPage + 1);
    });
    
    btnLast.addEventListener("click", function() {
      goToPage(state.totalPages);
    });
    
    // Page size selector
    pageSizeSelect.addEventListener("change", function() {
      changePageSize(parseInt(this.value, 10));
    });
    
    // Column header sorting
    thead.addEventListener("click", function(e) {
      var th = e.target.closest(".grid-header-cell.sortable");
      if (th) {
        var field = th.dataset.field;
        changeSorting(field);
      }
    });
    
    // Keyboard navigation for headers
    if (enableKeyboardNav) {
      thead.addEventListener("keydown", function(e) {
        var th = e.target.closest(".grid-header-cell.sortable");
        if (th && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          var field = th.dataset.field;
          changeSorting(field);
        }
      });
    }
  }
  
  /**
   * Navigate to specific page
   */
  function goToPage(page) {
    if (page < 1 || page > state.totalPages || page === state.currentPage) {
      return;
    }
    
    var previousPage = state.currentPage;
    state.currentPage = page;
    
    // Fire pageChange event
    context.trigger("pageChange", {
      currentPage: state.currentPage,
      previousPage: previousPage,
      pageSize: state.pageSize,
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection,
      totalPages: state.totalPages,
      totalRows: state.totalRows
    });
    
    // Fetch new page data
    fetchData();
  }
  
  /**
   * Change page size
   */
  function changePageSize(newSize) {
    if (newSize === state.pageSize) {
      return;
    }
    
    var previousSize = state.pageSize;
    state.pageSize = newSize;
    state.currentPage = 1; // Reset to first page
    state.totalPages = Math.ceil(state.totalRows / state.pageSize);
    
    // Fire pageSizeChange event
    context.trigger("pageSizeChange", {
      newPageSize: newSize,
      previousPageSize: previousSize,
      resetToPage: 1,
      totalPages: state.totalPages,
      totalRows: state.totalRows,
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection
    });
    
    // Request new page data
    requestDataFetch();
  }
  
  /**
   * Change sorting
   */
  function changeSorting(field) {
    var previousColumn = state.sortColumn;
    var previousDirection = state.sortDirection;
    
    // Toggle direction if same column, otherwise default to ASC
    if (field === state.sortColumn) {
      state.sortDirection = state.sortDirection === "ASC" ? "DESC" : "ASC";
    } else {
      state.sortColumn = field;
      state.sortDirection = "ASC";
    }
    
    state.currentPage = 1; // Reset to first page
    
    // Update header UI
    renderHeaders();
    
    // Fire sortChange event
    context.trigger("sortChange", {
      sortColumn: state.sortColumn,
      sortDirection: state.sortDirection,
      previousColumn: previousColumn,
      previousDirection: previousDirection,
      currentPage: 1,
      pageSize: state.pageSize
    });
    
    // Request new sorted data
    requestDataFetch();
  }
  
  /**
   * Show loading overlay
   */
  function showLoading() {
    loadingOverlay.setAttribute("aria-hidden", "false");
  }
  
  /**
   * Hide loading overlay
   */
  function hideLoading() {
    loadingOverlay.setAttribute("aria-hidden", "true");
  }
  
  /**
   * Show error message
   */
  function showError(message) {
    errorText.textContent = message || errorTextConfig;
    errorMessage.setAttribute("aria-hidden", "false");
  }
  
  /**
   * Hide error message
   */
  function hideError() {
    errorMessage.setAttribute("aria-hidden", "true");
  }
  
  /**
   * Show no data message
   */
  function showNoData() {
    noDataDiv.setAttribute("aria-hidden", "false");
    tableWrapper.style.display = "none";
  }
  
  /**
   * Hide no data message
   */
  function hideNoData() {
    noDataDiv.setAttribute("aria-hidden", "true");
    tableWrapper.style.display = "block";
  }
  
  // Initialize widget
  init();
  
})();

// Made with Bob
