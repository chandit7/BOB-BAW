// DynamicServiceTable - Change Event Handler
// Handles updates when the tableDataJSON String binding or configuration changes

// Get the new JSON string data
var tableDataJSON = this.getData();

// Get configuration options (including new theme and search options)
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

// Store widget context for event firing
var widgetContext = this;

// Get DOM elements
var container = this.context.element.querySelector(".dt-container");
if (!container) {
	console.error("DynamicServiceTable (change): Container not found");
	return;
}

var titleEl = container.querySelector(".dt-title");
var recordCountEl = container.querySelector(".dt-record-count");
var refreshBtn = container.querySelector(".dt-btn-refresh");
var loadingOverlay = container.querySelector(".dt-loading-overlay");
var indicator = container.querySelector(".dt-indicator");
var thead = container.querySelector(".dt-thead");
var tbody = container.querySelector(".dt-tbody");
var pageInfo = container.querySelector(".dt-page-info");
var pageSizeSelect = container.querySelector(".dt-pagesize");
var prevBtn = container.querySelector(".dt-btn-prev");
var nextBtn = container.querySelector(".dt-btn-next");
var searchInput = container.querySelector(".dt-search-input");
var searchWrap = container.querySelector(".dt-search-wrap");

// Apply theme to container
container.className = "dt-container theme-" + config.styleTheme;
console.log("DynamicServiceTable (change): Applied theme -", config.styleTheme);

// Update search visibility
if (searchWrap) {
	searchWrap.style.display = config.enableSearch ? "flex" : "none";
}

// Parse JSON string
var parsedData = null;
if (tableDataJSON && typeof tableDataJSON === 'string' && tableDataJSON.trim() !== '') {
	try {
		parsedData = JSON.parse(tableDataJSON);
		console.log("DynamicServiceTable (change): Successfully parsed JSON", parsedData);
	} catch (e) {
		console.error("DynamicServiceTable (change): Failed to parse JSON", e);
		console.error("DynamicServiceTable (change): Invalid JSON string:", tableDataJSON);
	}
} else {
	console.log("DynamicServiceTable (change): No data provided or empty string");
}

// Extract data from parsed JSON
var columns = [];
var data = [];
var totalRecords = 0;

if (parsedData) {
	if (parsedData.columns && Array.isArray(parsedData.columns)) {
		columns = parsedData.columns;
	}
	
	if (parsedData.data && Array.isArray(parsedData.data)) {
		data = parsedData.data;
	}
	
	// Get totalRecords from JSON data (from server)
	if (parsedData.pagination && parsedData.pagination.totalRecords) {
		totalRecords = parsedData.pagination.totalRecords;
	}
}

// Use configuration for pagination (not JSON data)
var pagination = {
	page: config.currentPage,
	pageSize: config.pageSize,
	totalRecords: totalRecords
};

console.log("DynamicServiceTable (change): Using pagination from config", pagination);

// Update title
if (titleEl) {
	titleEl.textContent = config.title;
}

// Update loading state
if (loadingOverlay) {
	if (config.isLoading) {
		loadingOverlay.classList.add("active");
	} else {
		loadingOverlay.classList.remove("active");
	}
}

// Update refresh button visibility
if (refreshBtn) {
	refreshBtn.style.display = config.showRefresh ? "flex" : "none";
}

// Re-render header
if (thead) {
	thead.innerHTML = "";
	if (columns.length > 0) {
		var tr = document.createElement("tr");
		columns.forEach(function(col) {
			var th = document.createElement("th");
			th.className = "dt-th";
			
			if (col.width) {
				th.style.width = col.width;
			}
			if (col.align) {
				th.style.textAlign = col.align;
			}
			
			var headerContent = document.createElement("div");
			headerContent.className = "dt-th-content";
			
			var headerText = document.createElement("span");
			headerText.textContent = col.header || col.field;
			headerContent.appendChild(headerText);
			
			if (col.sortable) {
				th.classList.add("sortable");
				
				// Add sort indicator if this is the active sort column
				if (config.sortColumn === col.field) {
					th.classList.add("sort-active");
					th.classList.add(config.sortDirection === "ASC" ? "sort-asc" : "sort-desc");
				}
			}
			
			th.appendChild(headerContent);
			tr.appendChild(th);
		});
		thead.appendChild(tr);
	}
}

// Re-render body
if (tbody) {
	tbody.innerHTML = "";
	
	if (data.length === 0) {
		tbody.innerHTML = '<tr><td colspan="' + (columns.length || 1) + '" class="dt-empty">No data available</td></tr>';
	} else {
		var frag = document.createDocumentFragment();
		
		data.forEach(function(row) {
			var tr = document.createElement("tr");
			tr.className = "dt-row";
			
			if (config.enableRowSelection) {
				tr.classList.add("selectable");
			}
			
			columns.forEach(function(col) {
				var td = document.createElement("td");
				td.className = "dt-td";
				
				if (col.align) {
					td.style.textAlign = col.align;
				}
				
				var value = row[col.field];
				
				// Render cell based on type
				if (value === null || value === undefined) {
					td.innerHTML = '<span class="dt-null">—</span>';
				} else if (col.type === "badge" && col.badgeMap) {
					// Parse badgeMap if it's a JSON string
					var badgeMap = col.badgeMap;
					if (typeof badgeMap === 'string') {
						try {
							badgeMap = JSON.parse(badgeMap);
						} catch (e) {
							console.error("DynamicServiceTable (change): Failed to parse badgeMap", e);
						}
					}
					
					var badgeConfig = badgeMap[value];
					if (badgeConfig) {
						var label = badgeConfig.label || value;
						var color = badgeConfig.color || "gray";
						td.innerHTML = '<span class="dt-badge badge-' + color + '">' + escapeHtml(label) + '</span>';
					} else {
						td.textContent = value;
					}
				} else if (col.type === "currency") {
					if (!isNaN(value)) {
						var num = parseFloat(value);
						td.innerHTML = '<span class="dt-currency">$' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</span>';
					} else {
						td.textContent = value;
					}
				} else if (col.type === "date") {
					try {
						var date = new Date(value);
						if (!isNaN(date.getTime())) {
							td.innerHTML = '<span class="dt-date">' + date.toLocaleDateString() + '</span>';
						} else {
							td.textContent = value;
						}
					} catch (e) {
						td.textContent = value;
					}
				} else if (col.type === "number") {
					if (!isNaN(value)) {
						var num = parseFloat(value);
						td.innerHTML = '<span class="dt-number">' + num.toLocaleString() + '</span>';
					} else {
						td.textContent = value;
					}
				} else if (col.type === "boolean") {
					var boolValue = value === true || value === "true" || value === 1 || value === "1";
					var icon = boolValue ? "✓" : "✗";
					var className = boolValue ? "dt-bool-true" : "dt-bool-false";
					td.innerHTML = '<span class="' + className + '">' + icon + '</span>';
				} else if (col.type === "link") {
					var url = col.linkTemplate ? col.linkTemplate.replace("{value}", value) : value;
					td.innerHTML = '<a href="' + escapeHtml(url) + '" class="dt-link" target="_blank">' + escapeHtml(String(value)) + '</a>';
				} else {
					td.textContent = value;
				}
				
				tr.appendChild(td);
			});
			
			frag.appendChild(tr);
		});
		
		tbody.appendChild(frag);
	}
}

// Update pagination
if (pageInfo && pageSizeSelect && prevBtn && nextBtn) {
	var totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);
	var currentPage = pagination.page;
	
	var startRecord = (currentPage - 1) * pagination.pageSize + 1;
	var endRecord = Math.min(currentPage * pagination.pageSize, pagination.totalRecords);
	
	if (pagination.totalRecords === 0) {
		pageInfo.textContent = "0 records";
	} else {
		pageInfo.textContent = startRecord + "-" + endRecord + " of " + pagination.totalRecords;
	}
	
	prevBtn.disabled = currentPage <= 1;
	nextBtn.disabled = currentPage >= totalPages || pagination.totalRecords === 0;
	
	pageSizeSelect.value = pagination.pageSize;
}

// Update record count
if (recordCountEl) {
	if (config.showRecordCount) {
		recordCountEl.textContent = pagination.totalRecords + " records";
		recordCountEl.style.display = "inline";
	} else {
		recordCountEl.style.display = "none";
	}
}

// Clear search input when data changes
if (searchInput && config.enableSearch) {
	searchInput.value = "";
}

// ============================================================================
// EVENT HANDLERS - Re-attach after DOM re-render
// ============================================================================

// Handle sort event
function handleSort(field) {
	var newDirection = "ASC";
	
	if (config.sortColumn === field) {
		newDirection = config.sortDirection === "ASC" ? "DESC" : "ASC";
	}
	
	// Fire sort event
	widgetContext.fireEvent("onSort", {
		column: field,
		direction: newDirection
	});
	
	console.log("DynamicServiceTable (change): Sort triggered -", field, newDirection);
}

// Handle page change event
function handlePageChange(newPage) {
	// Fire page change event
	widgetContext.fireEvent("onPageChange", {
		page: newPage,
		pageSize: pagination.pageSize
	});
	
	console.log("DynamicServiceTable (change): Page change triggered -", newPage);
}

// Handle page size change event
function handlePageSizeChange(newSize) {
	// Fire page size change event
	widgetContext.fireEvent("onPageSizeChange", {
		pageSize: newSize
	});
	
	console.log("DynamicServiceTable (change): Page size change triggered -", newSize);
}

// Handle row selection event
function handleRowSelect(row, rowIndex) {
	// Fire row select event
	widgetContext.fireEvent("onRowSelect", {
		row: row,
		index: rowIndex
	});
	
	console.log("DynamicServiceTable (change): Row selected -", rowIndex);
}

// Handle refresh event
function handleRefresh() {
	// Fire refresh event
	widgetContext.fireEvent("onRefresh", {
		timestamp: new Date().toISOString()
	});
	
	console.log("DynamicServiceTable (change): Refresh triggered");
}

// ============================================================================
// ATTACH EVENT LISTENERS
// ============================================================================

// Refresh button
if (refreshBtn && config.showRefresh) {
	refreshBtn.addEventListener("click", handleRefresh);
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
		if (pagination.page > 1) {
			handlePageChange(pagination.page - 1);
		}
	});
}

// Next page button
if (nextBtn) {
	nextBtn.addEventListener("click", function() {
		var totalPages = Math.ceil(pagination.totalRecords / pagination.pageSize);
		if (pagination.page < totalPages) {
			handlePageChange(pagination.page + 1);
		}
	});
}

// Column header sort handlers
if (thead) {
	var thElements = thead.querySelectorAll("th.sortable");
	thElements.forEach(function(th, index) {
		var col = columns[index];
		if (col && col.sortable) {
			th.addEventListener("click", function() {
				handleSort(col.field);
			});
		}
	});
}

// Row selection handlers
if (tbody && config.enableRowSelection) {
	var rowElements = tbody.querySelectorAll("tr.selectable");
	rowElements.forEach(function(tr, index) {
		tr.addEventListener("click", function() {
			handleRowSelect(data[index], index);
		});
	});
}

console.log("DynamicServiceTable (change): Update complete - Theme:", config.styleTheme, "Search:", config.enableSearch, "Page:", pagination.page, "PageSize:", pagination.pageSize);

// Helper function to escape HTML
function escapeHtml(text) {
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// Made with Bob
