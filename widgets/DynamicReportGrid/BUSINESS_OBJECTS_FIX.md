# DynamicReportGrid Business Objects Fix

## Problem
Business objects (GridColumn, GridDataResult, GridLabels) defined in `widget/config.json` were not being included in the TWX package, causing them to not be created in BAW after import.

## Root Cause
The `Widget.get_business_objects()` method in [`toolkit_packager/models/widget.py`](../toolkit_packager/models/widget.py) only supported **file-referenced** business objects (with a `"file"` property), but DynamicReportGrid had **embedded** business objects directly in config.json.

### Original Code (Lines 104-110)
```python
for bo_ref in config['businessObjects']:
    bo_file = bo_ref.get('file')  # Returns None for embedded BOs
    if bo_file:                    # Condition fails for embedded BOs
        bo_path = self.files.get(bo_file)
        if bo_path and bo_path.exists():
            bo_data = json.loads(bo_path.read_text(encoding='utf-8'))
            business_objects.append(bo_data)
```

## Solution
Modified `Widget.get_business_objects()` to support **both** embedded and file-referenced business objects:

### Fixed Code
```python
for bo_ref in config['businessObjects']:
    # Check if business object is embedded directly in config
    if 'name' in bo_ref and 'properties' in bo_ref:
        # Embedded business object definition
        business_objects.append(bo_ref)
    else:
        # File-referenced business object
        bo_file = bo_ref.get('file')
        if bo_file:
            bo_path = self.files.get(bo_file)
            if bo_path and bo_path.exists():
                bo_data = json.loads(bo_path.read_text(encoding='utf-8'))
                business_objects.append(bo_data)
```

## Verification

### Package Build Output
```
INFO: Registered new custom type 'GridColumn' with class ID '/12.54e08c82-599b-462e-9105-a5becbfea67e'
INFO: Created new business object 'GridColumn' with ID: 12.54e08c82-599b-462e-9105-a5becbfea67e
INFO: Registered new custom type 'GridDataResult' with class ID '/12.ce5c2d0d-c86a-4dc0-a7db-229b278722cb'
INFO: Created new business object 'GridDataResult' with ID: 12.ce5c2d0d-c86a-4dc0-a7db-229b278722cb
INFO: Registered new custom type 'GridLabels' with class ID '/12.fc36218c-35a0-4275-b41f-1709bc6a4664'
INFO: Created new business object 'GridLabels' with ID: 12.fc36218c-35a0-4275-b41f-1709bc6a4664
```

### Package Contents Verification
All three business objects are present in `reportUi_1.0.2.twx`:

**META-INF/package.xml:**
```xml
<object id="12.54e08c82-599b-462e-9105-a5becbfea67e" name="GridColumn" type="twClass"/>
<object id="12.ce5c2d0d-c86a-4dc0-a7db-229b278722cb" name="GridDataResult" type="twClass"/>
<object id="12.fc36218c-35a0-4275-b41f-1709bc6a4664" name="GridLabels" type="twClass"/>
<object id="64.0474f273-cd07-4fc0-999b-04e980aac6a8" name="DynamicReportGrid" type="coachView"/>
```

**Business Object XML Files:**
- `objects/12.54e08c82-599b-462e-9105-a5becbfea67e.xml` (GridColumn - 7 properties)
- `objects/12.ce5c2d0d-c86a-4dc0-a7db-229b278722cb.xml` (GridDataResult - 8 properties)
- `objects/12.fc36218c-35a0-4275-b41f-1709bc6a4664.xml` (GridLabels - 8 properties)

## Next Steps
1. Import `output/reportUi_1.0.2.twx` into BAW v24.0.1 or v25.0.1
2. Verify that GridColumn, GridDataResult, and GridLabels business objects are created
3. Test the DynamicReportGrid widget with the business objects

## Files Modified
- [`toolkit_packager/models/widget.py`](../toolkit_packager/models/widget.py) - Lines 92-120

## Package Details
- **Package:** `reportUi_1.0.2.twx`
- **Location:** `output/reportUi_1.0.2.twx`
- **Size:** 13.98 MB
- **BAW Version:** 24.0.1 (compatible with 25.0.1)
- **Build Date:** 2026-06-13