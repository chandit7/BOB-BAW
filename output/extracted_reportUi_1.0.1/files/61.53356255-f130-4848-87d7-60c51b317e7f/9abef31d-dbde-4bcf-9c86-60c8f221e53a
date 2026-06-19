/**
 * DynamicReportGrid Preview Snippet
 * Minimal initialization code for preview mode
 */

function initializeDynamicReportGrid(container, config, initialData, callbacks) {
  // This is a simplified preview version
  // The actual widget uses BAW Coach View API
  
  console.log('DynamicReportGrid Preview Initialized');
  console.log('Configuration:', config);
  console.log('Initial Data:', initialData);
  
  // Create a simple message for preview
  container.innerHTML = `
    <div style="padding: 20px; background: #e5f6ff; border: 2px solid #0f62fe; border-radius: 4px; text-align: center;">
      <h3 style="margin: 0 0 10px 0; color: #0f62fe;">DynamicReportGrid Widget</h3>
      <p style="margin: 0; color: #161616;">
        This widget requires BAW runtime environment.<br>
        Please import the widget into IBM Business Automation Workflow to see it in action.
      </p>
      <div style="margin-top: 20px; padding: 15px; background: white; border-radius: 4px; text-align: left;">
        <strong>Configured Columns:</strong>
        <ul style="margin: 10px 0 0 0; padding-left: 20px;">
          ${config.columns.map(col => `<li>${col.label} (${col.field})</li>`).join('')}
        </ul>
      </div>
      <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 4px; text-align: left;">
        <strong>Mock Data:</strong>
        <div style="font-family: monospace; font-size: 12px; margin-top: 10px;">
          Total Rows: ${initialData.totalRows}<br>
          Current Page: ${initialData.currentPage}<br>
          Page Size: ${initialData.pageSize}<br>
          Rows in Current Page: ${initialData.rows.length}
        </div>
      </div>
    </div>
  `;
  
  // Simulate data loaded event
  if (callbacks && callbacks.onDataLoaded) {
    setTimeout(() => {
      callbacks.onDataLoaded({
        rowCount: initialData.rows.length,
        totalRows: initialData.totalRows,
        currentPage: initialData.currentPage,
        pageSize: initialData.pageSize,
        executionTime: initialData.executionTime
      });
    }, 100);
  }
}

// Made with Bob
