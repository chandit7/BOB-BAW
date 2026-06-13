// DynamicServiceTable - Change Event Handler
// Handles updates when the tableDataJSON String binding changes

// Get the new JSON string data
var tableDataJSON = this.getData();

// Get configuration options
var config = {
	title: this.getOption("title") || "Data Table",
	showRefresh: this.getOption("showRefresh") !== false,
	showRecordCount: this.getOption("showRecordCount") !== false,
	enableRowSelection: this.getOption("enableRowSelection") !== false,
	isLoading: this.getOption("isLoading") || false
};

// Get DOM elements
var container = this.context.element.querySelector(".dt-container");
if (!container) {
	console.error("DynamicServiceTable: Container not found");
} else {
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
	var pagination = { page: 1, pageSize: 100, totalRecords: 0 };
	
	if (parsedData) {
		if (parsedData.columns && Array.isArray(parsedData.columns)) {
			columns = parsedData.columns;
		}
		
		if (parsedData.data && Array.isArray(parsedData.data)) {
			data = parsedData.data;
		}
		
		if (parsedData.pagination) {
			pagination = {
				page: parsedData.pagination.page || 1,
				pageSize: parsedData.pagination.pageSize || 100,
				totalRecords: parsedData.pagination.totalRecords || 0
			};
		}
	}
	
	// Update title
	if (titleEl) {
		titleEl.textContent = config.title;
	}
	
	// Update loading state
	if (loadingOverlay && indicator) {
		if (config.isLoading) {
			loadingOverlay.style.display = "flex";
			indicator.style.display = "block";
		} else {
			loadingOverlay.style.display = "none";
			indicator.style.display = "none";
		}
	}
	
	// Update refresh button visibility
	if (refreshBtn) {
		refreshBtn.style.display = config.showRefresh ? "inline-block" : "none";
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
					th.classList.add("dt-sortable");
					var sortIcon = document.createElement("span");
					sortIcon.className = "dt-sort-icon";
					sortIcon.textContent = "⇅";
					headerContent.appendChild(sortIcon);
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
					tr.classList.add("dt-row-selectable");
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
							td.innerHTML = '<span class="dt-badge dt-badge-' + color + '">' + escapeHtml(label) + '</span>';
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
		
		pageInfo.textContent = startRecord + "-" + endRecord + " of " + pagination.totalRecords;
		
		prevBtn.disabled = currentPage <= 1;
		nextBtn.disabled = currentPage >= totalPages;
		
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
	
	console.log("DynamicServiceTable (change): Update complete");
}

// Helper function to escape HTML
function escapeHtml(text) {
	var div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// Made with Bob
