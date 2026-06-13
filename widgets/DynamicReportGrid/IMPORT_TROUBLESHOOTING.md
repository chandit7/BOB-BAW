# DynamicReportGrid - Import Troubleshooting Guide

## Error: "Unable to import project"

This error typically occurs when importing a TWX toolkit into BAW. Here are the solutions:

---

## Solution 1: Toolkit Already Exists (Most Common)

**Problem**: A toolkit with the same ID already exists in BAW.

**Solution A - Update Existing Toolkit**:
1. In Process Designer, go to **File** → **Manage Process Apps and Toolkits**
2. Find the existing "reportUi" or "Custom Widgets" toolkit
3. Right-click → **Update from File**
4. Select `reportUi_1.0.7.twx`
5. Click **Update**

**Solution B - Delete Old Toolkit First**:
1. In Process Designer, go to **File** → **Manage Process Apps and Toolkits**
2. Find the existing "reportUi" or "Custom Widgets" toolkit
3. Right-click → **Delete** (if not in use)
4. Then import the new TWX file normally

**Solution C - Create New Toolkit with Different ID**:
If you want a fresh toolkit alongside the existing one, we can generate a new toolkit with a different ID.

---

## Solution 2: Import as Toolkit (Not Process App)

**Problem**: Trying to import as Process Application instead of Toolkit.

**Solution**:
1. In Process Designer, go to **File** → **Import**
2. Select `reportUi_1.0.7.twx`
3. **IMPORTANT**: Choose **"Import as Toolkit"** (not Process Application)
4. Click **Import**

---

## Solution 3: Check BAW Version Compatibility

**Problem**: TWX was packaged for BAW v25.x but you're using a different version.

**Current Package**: Built for BAW v25.0.1 (8.6.10.25010)

**Solution**:
- If using BAW v24.x, we need to repackage with v24 template
- If using BAW v23.x or earlier, widget features may not be compatible

To repackage for different version:
1. Edit `toolkit.config.json`
2. Change `"bawVersion": "25.0.1"` to your version (e.g., "24.0.1")
3. Run `python package_baw.py`

---

## Solution 4: File Corruption Check

**Problem**: TWX file may be corrupted during download/transfer.

**Verification**:
```powershell
# Check file size (should be ~15 MB)
Get-Item BOB-BAW/output/reportUi_1.0.7.twx | Select-Object Name, Length

# Verify it's a valid ZIP file
Test-Path BOB-BAW/output/reportUi_1.0.7.twx
```

**Solution**: If corrupted, regenerate:
```bash
cd BOB-BAW
python package_baw.py
```

---

## Solution 5: Server Permissions

**Problem**: Insufficient permissions to import toolkits.

**Solution**:
- Ensure you have **Administrator** or **Toolkit Developer** role in BAW
- Contact your BAW administrator if needed

---

## Solution 6: Clean Import (Nuclear Option)

If all else fails, create a completely new toolkit:

1. **Edit toolkit.config.json**:
```json
{
  "toolkit": {
    "name": "DynamicReportGridToolkit",
    "shortName": "DRGT",
    "description": "DynamicReportGrid widget toolkit",
    "version": "1.0.0",
    "id": "2066.NEW-GUID-HERE",
    ...
  }
}
```

2. **Remove the ID field** (let system generate new one):
```json
{
  "toolkit": {
    "name": "DynamicReportGridToolkit",
    "shortName": "DRGT",
    "description": "DynamicReportGrid widget toolkit",
    "version": "1.0.0",
    ...
  }
}
```

3. **Repackage**:
```bash
cd BOB-BAW
python package_baw.py
```

---

## Verification After Import

Once successfully imported, verify:

1. **Check Toolkit**:
   - Go to **File** → **Manage Process Apps and Toolkits**
   - Find "reportUi" toolkit
   - Verify version is 1.0.7

2. **Check Widget**:
   - Create a new Coach
   - Open the widget palette
   - Search for "DynamicReportGrid"
   - Widget should appear with grid icon

3. **Check Business Objects**:
   - In toolkit, expand **Business Objects**
   - Should see:
     - GridColumn
     - GridDataResult
     - GridLabels

---

## Getting More Details

To see detailed error messages:

1. **Check BAW Logs**:
   - Location: `<BAW_HOME>/profiles/<profile>/logs/`
   - Look for: `SystemOut.log` or `SystemErr.log`
   - Search for: "import" or "reportUi"

2. **Enable Debug Logging**:
   - In Process Designer: **Window** → **Preferences** → **Logging**
   - Set level to **DEBUG**
   - Retry import
   - Check logs for detailed error

---

## Contact Information

If you continue to have issues:

1. **Check Package Contents**:
   ```bash
   python BOB-BAW/analyze_twx.py BOB-BAW/output/reportUi_1.0.7.twx
   ```

2. **Verify Widget Structure**:
   - DynamicReportGrid coach view: ✓
   - 3 Business objects: ✓
   - Preview files: ✓
   - Icon: ✓

3. **Share Error Details**:
   - Exact error message from BAW
   - BAW version (Help → About)
   - Log file excerpts

---

## Quick Reference

**Package Location**: `BOB-BAW/output/reportUi_1.0.7.twx`

**Import Steps**:
1. Process Designer → File → Import
2. Select TWX file
3. Choose "Import as Toolkit"
4. If exists, use "Update from File" instead

**Alternative**: Manual creation guide available in [`MANUAL_CREATION_IN_BAW.md`](MANUAL_CREATION_IN_BAW.md)