// DynamicServiceTable Widget - Main JavaScript Controller
// Implements the reusable dynamic table framework for IBM BAW CP4BA
// Uses a single String binding containing JSON payload
// Supports theme switching (default/modern) and client-side search

// Get widget context and configuration
var tableDataJSON = this.getData(); // This is a String containing JSON
var config = {
	title: this.getOption("title") || "Data Table",
	showRefresh: this.getOption("showRefresh") !== false,
	showRecordCount: this.getOption("showRecordCount") !== false,
	enableRowSelection: this.getOption("enableRowSelection") !== false,
	currentPage: this.getOption("currentPage") || 1,
	pageSize: this.getOption("pageSize") || 100,
	sortColumn: this.getOption("sortColumn") || "",
	sortDirection: this.getOption("sortDirection") || "ASC",
	isLoading: this.getOption("isLoading") || false,
	styleTheme: this.getOption("styleTheme") || "default",
	enableSearch: this.getOption("enableSearch") !== false
};

// Register event handlers
this.registerEventHandlingFunction(this, "onSort", "sortData");
this.registerEventHandlingFunction(this, "onPageChange", "pageData");
this.registerEventHandlingFunction(this, "onPageSizeChange", "sizeData");
this.registerEventHandlingFunction(this, "onRowSelect", "rowData");
this.registerEventHandlingFunction(this, "onRefresh", "refreshData");

// Get DOM elements
var container = this.context.element.querySelector(".dt-container");
var titleEl = container.querySelector(".dt-title");
var recordCountEl = container.querySelector(".dt-record-count");
var refreshBtn = container.querySelector(".dt-btn-refresh");
var loadingOverlay = container.querySelector(".dt-loading-overlay");
var loadingMsg = container.querySelector(".dt-loading-msg");
var thead = container.querySelector(".dt-thead");
var tbody = container.querySelector(".dt-tbody");
var pageInfo = container.querySelector(".dt-page-info");
var pageSizeSelect = container.querySelector(".dt-pagesize");
var prevBtn = container.querySelector(".dt-btn-prev");
var nextBtn = container.querySelector(".dt-btn-next");
var indicator = container.querySelector(".dt-indicator");
var searchInput = container.querySelector(".dt-search-input");
var searchWrap = container.querySelector(".dt-search-wrap");

// Store reference to widget context for event firing
var widgetContext = this;

// Initialize state
var state = {
	columns: [],
	data: [],
	allData: [], // Store all data for search filtering
	pagination: {
		page: config.currentPage,
		pageSize: config.pageSize,
		totalRecords: 0
	},
	sort: {
		column: config.sortColumn,
		direction: config.sortDirection
	},
	search: {
		term: "",
		isActive: false
	}
};

// Apply theme to container
function applyTheme() {
	container.className = "dt-container theme-" + config.styleTheme;
	console.log("DynamicServiceTable: Applied theme -", config.styleTheme);
}

// Parse JSON payload from String binding
function parseTableData(jsonString) {
	if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
		console.log("DynamicServiceTable: No data provided or empty string");
		return null;
	}
	
	try {
		var parsed = JSON.parse(jsonString);
		console.log("DynamicServiceTable: Successfully parsed JSON", parsed);
		return parsed;
	} catch (e) {
		console.error("DynamicServiceTable: Failed to parse JSON", e);
		console.error("DynamicServiceTable: Invalid JSON string:", jsonString);
		return null;
	}
}

// Update state from parsed JSON data
function updateFromJSON(parsedData) {
	if (!parsedData) {
		console.log("DynamicServiceTable: No parsed data to update from");
		state.columns = [];
		state.data = [];
		state.allData = [];
		state.pagination = { page: config.currentPage, pageSize: config.pageSize, totalRecords: 0 };
		return;
	}
	
	// Update columns
	if (parsedData.columns && Array.isArray(parsedData.columns)) {
		state.columns = parsedData.columns;
		console.log("DynamicServiceTable: Updated columns", state.columns.length);
	}
	
	// Update data
	if (parsedData.data && Array.isArray(parsedData.data)) {
		state.allData = parsedData.data; // Store all data
		state.data = parsedData.data; // Display data (may be filtered)
		console.log("DynamicServiceTable: Updated data rows", state.data.length);
	}
	
	// Update pagination - Configuration options take precedence over JSON data
	// JSON data only provides totalRecords from server
	state.pagination = {
		page: config.currentPage,  // From widget configuration
		pageSize: config.pageSize, // From widget configuration
		totalRecords: (parsedData.pagination && parsedData.pagination.totalRecords) || 0  // From JSON data
	};
	console.log("DynamicServiceTable: Updated pagination", state.pagination);
}

// Client-side search functionality
function performSearch(searchTerm) {
	if (!searchTerm || searchTerm.trim() === '') {
		// Reset to all data
		state.data = state.allData;
		state.search.isActive = false;
		state.search.term = "";
		console.log("DynamicServiceTable: Search cleared");
		return;
	}
	
	var term = searchTerm.toLowerCase().trim();
	state.search.term = term;
	state.search.isActive = true;
	
	// Filter data across all columns
	state.data = state.allData.filter(function(row) {
		return state.columns.some(function(col) {
			var value = row[col.field];
			if (value === null || value === undefined) {
				return false;
			}
			return String(value).toLowerCase().indexOf(term) !== -1;
		});
	});
	
	console.log("DynamicServiceTable: Search filtered", state.data.length, "of", state.allData.length, "rows");
}

// Build table header from columns
function buildHeader() {
	thead.innerHTML = "";
	
	if (!state.columns || state.columns.length === 0) {
		console.log("DynamicServiceTable: No columns to render");
		return;
	}
	
	var tr = document.createElement("tr");
	
	state.columns.forEach(function(col) {
		var th = document.createElement("th");
		th.className = "dt-th";
		
		// Apply column width if specified
		if (col.width) {
			th.style.width = col.width;
		}
		
		// Apply column alignment if specified
		if (col.align) {
			th.style.textAlign = col.align;
		}
		
		// Create header content
		var headerContent = document.createElement("div");
		headerContent.className = "dt-th-content";
		
		var headerText = document.createElement("span");
		headerText.textContent = col.header || col.field;
		headerContent.appendChild(headerText);
		
		// Add sort indicator if column is sortable
		if (col.sortable) {
			th.classList.add("sortable");
			
			if (state.sort.column === col.field) {
				th.classList.add("sort-active");
				th.classList.add(state.sort.direction === "ASC" ? "sort-asc" : "sort-desc");
			}
			
			// Add click handler for sorting
			th.addEventListener("click", function() {
				handleSort(col.field);
			});
		}
		
		th.appendChild(headerContent);
		tr.appendChild(th);
	});
	
	thead.appendChild(tr);
	console.log("DynamicServiceTable: Header built with", state.columns.length, "columns");
}

// Render table body from data
function renderBody() {
	tbody.innerHTML = "";
	
	if (!state.data || state.data.length === 0) {
		showEmptyState();
		return;
	}
	
	var frag = document.createDocumentFragment();
	
	state.data.forEach(function(row, rowIndex) {
		var tr = document.createElement("tr");
		tr.className = "dt-row";
		
		// Add row selection handler if enabled
		if (config.enableRowSelection) {
			tr.classList.add("selectable");
			tr.addEventListener("click", function() {
				handleRowSelect(row, rowIndex);
			});
		}
		
		state.columns.forEach(function(col) {
			var td = document.createElement("td");
			td.className = "dt-td";
			
			// Apply column alignment if specified
			if (col.align) {
				td.style.textAlign = col.align;
			}
			
			// Render cell content based on column type
			var cellContent = renderCell(row[col.field], col);
			
			if (typeof cellContent === 'string') {
				td.innerHTML = cellContent;
			} else {
				td.appendChild(cellContent);
			}
			
			tr.appendChild(td);
		});
		
		frag.appendChild(tr);
	});
	
	tbody.appendChild(frag);
	console.log("DynamicServiceTable: Body rendered with", state.data.length, "rows");
}

// Render individual cell based on column type
function renderCell(value, column) {
	// Handle null/undefined values
	if (value === null || value === undefined) {
		return '<span class="dt-null">—</span>';
	}
	
	// Handle different column types
	switch (column.type) {
		case "badge":
			return renderBadge(value, column);
		
		case "currency":
			return renderCurrency(value);
		
		case "date":
			return renderDate(value);
		
		case "number":
			return renderNumber(value);
		
		case "boolean":
			return renderBoolean(value);
		
		case "link":
			return renderLink(value, column);
		
		default:
			return escapeHtml(String(value));
	}
}

// Render badge cell
function renderBadge(value, column) {
	if (!column.badgeMap) {
		return escapeHtml(String(value));
	}
	
	// Parse badgeMap if it's a JSON string
	var badgeMap = column.badgeMap;
	if (typeof badgeMap === 'string') {
		try {
			badgeMap = JSON.parse(badgeMap);
		} catch (e) {
			console.error("DynamicServiceTable: Failed to parse badgeMap", e);
			return escapeHtml(String(value));
		}
	}
	
	var badgeConfig = badgeMap[value];
	if (!badgeConfig) {
		return escapeHtml(String(value));
	}
	
	var label = badgeConfig.label || value;
	var color = badgeConfig.color || "gray";
	
	return '<span class="dt-badge badge-' + color + '">' + escapeHtml(label) + '</span>';
}

// Render currency cell
function renderCurrency(value) {
	if (isNaN(value)) {
		return escapeHtml(String(value));
	}
	
	var num = parseFloat(value);
	return '<span class="dt-currency">$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>';
}

// Render date cell
function renderDate(value) {
	try {
		var date = new Date(value);
		if (isNaN(date.getTime())) {
			return escapeHtml(String(value));
		}
		return '<span class="dt-date">' + date.toLocaleDateString() + '</span>';
	} catch (e) {
		return escapeHtml(String(value));
	}
}

// Render number cell
function renderNumber(value) {
	if (isNaN(value)) {
		return escapeHtml(String(value));
	}
	
	var num = parseFloat(value);
	return '<span class="dt-number">' + num.toLocaleString() + '</span>';
}

// Render boolean cell
function renderBoolean(value) {
	var boolValue = value === true || value === "true" || value === 1 || value === "1";
	var icon = boolValue ? "✓" : "✗";
	var className = boolValue ? "dt-bool-true" : "dt-bool-false";
	return '<span class="' + className + '">' + icon + '</span>';
}

// Render link cell
function renderLink(value, column) {
	var url = column.linkTemplate ? column.linkTemplate.replace("{value}", value) : value;
	return '<a href="' + escapeHtml(url) + '" class="dt-link" target="_blank">' + escapeHtml(String(value)) + '</a>';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// Show empty state when no data
function showEmptyState() {
	var message = state.search.isActive ? 
		"No results found for '" + escapeHtml(state.search.term) + "'" : 
		"No data available";
	tbody.innerHTML = '<tr><td colspan="' + (state.columns.length || 1) + '" class="dt-empty">' + message + '</td></tr>';
}

// Update pagination controls
function updatePagination() {
	var displayCount = state.search.isActive ? state.data.length : state.pagination.totalRecords;
	var totalPages = Math.ceil(displayCount / state.pagination.pageSize);
	var currentPage = state.pagination.page;
	
	// Update page info
	var startRecord = (currentPage - 1) * state.pagination.pageSize + 1;
	var endRecord = Math.min(currentPage * state.pagination.pageSize, displayCount);
	
	if (displayCount === 0) {
		pageInfo.textContent = "0 records";
	} else {
		pageInfo.textContent = startRecord + "-" + endRecord + " of " + displayCount;
		if (state.search.isActive) {
			pageInfo.textContent += " (filtered)";
		}
	}
	
	// Update navigation buttons
	prevBtn.disabled = currentPage <= 1;
	nextBtn.disabled = currentPage >= totalPages || displayCount === 0;
	
	// Update page size select
	pageSizeSelect.value = state.pagination.pageSize;
	
	console.log("DynamicServiceTable: Pagination updated - Page", currentPage, "of", totalPages);
}

// Update record count in header
function updateRecordCount() {
	if (config.showRecordCount) {
		var count = state.search.isActive ? 
			state.data.length + " of " + state.allData.length : 
			state.pagination.totalRecords;
		recordCountEl.textContent = count + " records";
		recordCountEl.style.display = "inline";
	} else {
		recordCountEl.style.display = "none";
	}
}

// Update loading state
function updateLoadingState() {
	if (config.isLoading) {
		loadingOverlay.classList.add("active");
	} else {
		loadingOverlay.classList.remove("active");
	}
}

// Handle sort event
function handleSort(field) {
	var newDirection = "ASC";
	
	if (state.sort.column === field) {
		newDirection = state.sort.direction === "ASC" ? "DESC" : "ASC";
	}
	
	state.sort.column = field;
	state.sort.direction = newDirection;
	
	// Fire sort event
	widgetContext.fireEvent("onSort", {
		column: field,
		direction: newDirection
	});
	
	console.log("DynamicServiceTable: Sort triggered -", field, newDirection);
}

// Handle page change event
function handlePageChange(newPage) {
	state.pagination.page = newPage;
	
	// Fire page change event
	widgetContext.fireEvent("onPageChange", {
		page: newPage,
		pageSize: state.pagination.pageSize
	});
	
	console.log("DynamicServiceTable: Page change triggered -", newPage);
}

// Handle page size change event
function handlePageSizeChange(newSize) {
	state.pagination.pageSize = newSize;
	state.pagination.page = 1; // Reset to first page
	
	// Fire page size change event
	widgetContext.fireEvent("onPageSizeChange", {
		pageSize: newSize
	});
	
	console.log("DynamicServiceTable: Page size change triggered -", newSize);
}

// Handle row selection event
function handleRowSelect(row, rowIndex) {
	// Fire row select event
	widgetContext.fireEvent("onRowSelect", {
		row: row,
		index: rowIndex
	});
	
	console.log("DynamicServiceTable: Row selected -", rowIndex);
}

// Handle refresh event
function handleRefresh() {
	// Clear search when refreshing
	if (searchInput) {
		searchInput.value = "";
		performSearch("");
	}
	
	// Fire refresh event
	widgetContext.fireEvent("onRefresh", {
		timestamp: new Date().toISOString()
	});
	
	console.log("DynamicServiceTable: Refresh triggered");
}

// Handle search input
function handleSearch() {
	var searchTerm = searchInput.value;
	performSearch(searchTerm);
	renderBody();
	updatePagination();
	updateRecordCount();
}

// Setup event listeners
function setupEventListeners() {
	// Refresh button
	if (refreshBtn && config.showRefresh) {
		refreshBtn.addEventListener("click", handleRefresh);
		refreshBtn.style.display = "flex";
	} else if (refreshBtn) {
		refreshBtn.style.display = "none";
	}
	
	// Search input
	if (searchInput && config.enableSearch) {
		searchWrap.style.display = "flex";
		searchInput.addEventListener("input", handleSearch);
		searchInput.addEventListener("keyup", function(e) {
			if (e.key === "Escape") {
				searchInput.value = "";
				handleSearch();
			}
		});
	} else if (searchWrap) {
		searchWrap.style.display = "none";
	}
	
	// Page size select
	if (pageSizeSelect) {
		pageSizeSelect.addEventListener("change", function() {
			handlePageSizeChange(parseInt(this.value, 10));
		});
	}
	
	// Previous page button
	if (prevBtn) {
		prevBtn.addEventListener("click", function() {
			if (state.pagination.page > 1) {
				handlePageChange(state.pagination.page - 1);
			}
		});
	}
	
	// Next page button
	if (nextBtn) {
		nextBtn.addEventListener("click", function() {
			var displayCount = state.search.isActive ? state.data.length : state.pagination.totalRecords;
			var totalPages = Math.ceil(displayCount / state.pagination.pageSize);
			if (state.pagination.page < totalPages) {
				handlePageChange(state.pagination.page + 1);
			}
		});
	}
}

// Initialize the widget
function initialize() {
	console.log("DynamicServiceTable: Initializing widget");
	
	// Apply theme
	applyTheme();
	
	// Set title
	if (titleEl) {
		titleEl.textContent = config.title;
	}
	
	// Parse and update data from JSON string
	var parsedData = parseTableData(tableDataJSON);
	updateFromJSON(parsedData);
	
	// Setup event listeners
	setupEventListeners();
	
	// Render table
	buildHeader();
	renderBody();
	updatePagination();
	updateRecordCount();
	updateLoadingState();
	
	console.log("DynamicServiceTable: Initialization complete");
}

// Run initialization
initialize();

// Made with Bob
