import { RulebookProject } from '../types/rulebook';

export const INITIAL_RULEBOOK_PROJECTS: RulebookProject[] = [
  {
    id: 'proj-cycle-count',
    name: 'Cycle Count Utility: PRD and FSD Overview',
    objective: 'Modernize 2-tier VB.NET WinForms inventory tool to web architecture with formal role-based security, barcode scanning, and MIA reconciliation.',
    clientName: 'Enterprise Warehouse Operations',
    domain: 'Warehouse Logistics & Inventory Governance',
    latestVersion: 'v1.0',
    status: 'needs_review',
    unresolvedCount: 3,
    createdAt: '2026-11-02',
    updatedAt: '2026-11-10',
    currentVersionId: 'ver-cc-1.0',
    activeBaseline: {
      id: 'base-cc-1.0',
      name: 'Baseline v1.0 - Warehouse Inventory Specifications',
      approvedBy: 'Pragatheeswaran Kasinathan',
      approvedAt: '2026-11-10 14:30',
      includedScopeCount: 25,
      status: 'active'
    },
    versions: [
      {
        versionId: 'ver-cc-1.0',
        fileName: 'CD-Cycle_Count_Utility__PRD_and_FSD_Overview_for_Inventory_Management_System-111126-064130__1__4795ca46.pdf',
        fileSizeBytes: 1146276,
        uploadedAt: '10 Nov 2026',
        contentFingerprint: 'sha256-cc68pages4795ca46',
        pageCount: 68,
        pages: [
          {
            pageNumber: 1,
            text: `Cycle Count Utility: PRD and FSD Overview for Inventory Management System\nCycle Count Utility — PRD + FSD (As-Is)\nSystem: Cycle Count Utility ( Cycle Count.exe )\nRepository: CycleCount-main\nDocument type: Product Requirements Document + Functional Specification Document, describing current behaviour only\nSource of truth: Source code in this repository (every file read, batch by batch)\nTechnology: VB Shop, Windows Forms, .NET Framework 4.8, x86, Microsoft SQL Server (Finesse database), Infragistics UltraWinGrid v11.1, Excel COM Interop\nLabels used: Assumption = inferred, not provable from code. Gap = missing or defective logic. Risk = behaviour that can cause data or user problems.\n0. Repository Scan Results\n0.1 Batch-by-batch file inventory`,
            hasWarnings: false,
            warnings: [],
            characterCount: 820
          },
          {
            pageNumber: 16,
            text: `A3. User Personas & Permissions (inferred from code)\n\n• P1 – Cycle Counter (any Finesse user)\nHow identified: Windows login -> SQL login (SUSER_SNAME()); a pjtfrusr row is required (startup reads units from it)\nCapabilities: Browse, search, scan, Mark As Counted, check in, MIA move, verify dims/weight, Check Up, Excel, copy, launch unsecured tools\n\n• P2 – Inventory Editor\nHow identified: dbo.can_edit_inventory() = 1 and menu right for "Add Inventory" / "Device Maintenance"\nCapabilities: Add Inventory / Remove Inventory launchers\n\n• P3 – Parts Editor\nHow identified: dbo.can_edit_parts() = 1 and menu right "Part Maintenance"\nCapabilities: Part Maintenance launcher\n\n• P4 – Utilization user\nHow identified: Menu right "Utilization" in fn_user_menus\nCapabilities: Utilization toolbar button\n\n• P5 – Supervisor / Reviewer (Assumption)\nHow identified: Not enforced in code\nCapabilities: Uses Check Up to review counts per user and date\n\n• P6 – User with no warehouse\nHow identified: _UserWarehouseCode empty (no warehouses.is_default = 1 row)\nCapabilities: Blocked from "Check this item into your warehouse"`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1140
          },
          {
            pageNumber: 17,
            text: `A4. Functional Scope (feature list)\nF01: Application startup & session initialisation (Main, No data write)\nF02: Menu security trimming (Main, No data write)\nF03: Warehouse selection (Main, No data write)\nF04: Storage location filter (Main, No data write)\nF05: Category (commodity) list (Main, No data write)\nF06: Part group list (Main, No data write)\nF07: Parts list (cycle-count priority) (Main, No data write)\nF08: Free-text part search (debounced) (Main, No data write)\nF09: Part details pane: Location History / Part Cycle Count History / User Cycle Count History (Main, No data write)\nF10: Part dimensions & weight status bar (unit conversion) (Main, No data write)`,
            hasWarnings: false,
            warnings: [],
            characterCount: 710
          },
          {
            pageNumber: 18,
            text: `F11: Verify dimensions / Verify weight (Main, Writes inpart)\nF12: Locations grid (on-hand lines) (Main, No data write)\nF13: Mark As Counted (Main, Writes WarehouseCycleCounts)\nF14: Cycle Count barcode scan (Main, Writes SP Update_Barcode_Receipt_Date)\nF15: Enter Barcode (locate part by barcode) (Main, No data write)\nF16: Check item into your warehouse (barcoded / non-barcoded) (Main, Writes SP part_checkin_with_barcode)\nF17: Move barcode/part to MIA order (Main, Writes staging + SP commit_mass_transfer)\nF18: Reset (choose) MIA order (Main, Local setting)\nF19: Launch external Finesse tools (8 tools: Availability, Query, Utilization, Add/Remove Inventory, Device/Part/Project Maint, Transfer) (Main, No data write)\nF20: Copy to clipboard (Main, No data write)\nF21: Export parts to Excel (Main, Creates unsaved workbook)\nF22: "LAME!" issue tracker link (Main, Podio URL)\nF23: Cycle Count Check Up (Check Up, No data write)`,
            hasWarnings: false,
            warnings: [],
            characterCount: 940
          },
          {
            pageNumber: 33,
            text: `F14 — Cycle Count Barcode Scan (Utility.vb:96-175)\nFlow:\nA[Enter pressed in Cycle Count Barcodes box] -> B[BarcodeHandler duplicate check]\n-> E{Barcode in Locations grid of current part?}\n-> If No: Beep_Fail\n-> If Yes: Phase = INSTOCK or REPAIR?\n  -> If Yes: exec Update_Barcode_Receipt_Date @barcode, OUT @IsFlagged\n    -> If Flagged: Fail beep + announce, row turns YELLOW\n    -> If Not Flagged: Success beep + announce, row turns GREEN\n  -> If No: Prompt: found on project X - check it in?\n    -> If Yes: CheckInWithBarcode to default WH, INSTOCK, row turns GREEN\n    -> If No: No action`,
            hasWarnings: false,
            warnings: [],
            characterCount: 680
          },
          {
            pageNumber: 35,
            text: `F16 — Check Item Into Your Warehouse (Utility.vb:1497-1878)\nContext menu on the Locations grid. Visible only when active row phase is not INSTOCK / REPAIR.\nText: "Check <barcode X | part Y> into your warehouse: <desc> INSTOCK"\nValidations:\n• No active location row -> "Nothing has been selected to be checked in."\n• _UserWarehouseCode empty -> "You do not belong to a warehouse. Contact your IT administrator for assistance."\n• Barcoded confirm -> "Check the following barcoded item into <WH> INSTOCK?"\n• Warehouse mismatch -> ConfirmandContinueDialog ("The selected warehouse does not match project warehouse. Continue?")\n• SP execution -> part_checkin_with_barcode`,
            hasWarnings: false,
            warnings: [],
            characterCount: 750
          },
          {
            pageNumber: 57,
            text: `B9. Business Rules Table\nBR01: The warehouse list excludes LAX2 (main) and NEW, LAX2 (Check Up) (Utility.vb:220, CheckUp.vb:35)\nBR02: The user warehouse is the warehouse flagged is_default = 1 (:363, :56)\nBR03: Categories/part groups only include parts with on-hand > 0 in selected warehouse on projects whose property type is utilized or available (:385-447)\nBR04: Part group = text before first comma in part description (:437)\nBR05: Parts ranking and quantities come solely from Get_Cycle_Count_Utility_Parts_List (:1995)\nBR06: Utilization colour: 0 -> red; < 20% pink; >= 80% light green; otherwise powder blue (:540-553)\nBR07: A cycle count is a new history row (insert-only) stamped with server time and SQL login (:939-940)\nBR08: Counts are recorded against the user profile warehouse (pjtfrusr.warehouse_entity), not viewed warehouse (:940)\nBR14: INSTOCK and REPAIR are special projects: a scan confirms presence (receipt date refresh), does not check in (:124, 1871-1878)\nBR15: Scanning barcode on other project offers check-in to user default warehouse INSTOCK (:150-162)\nBR16: Check-in always targets to_batchno = INSTOCK, hold_in_warehouse = False, allow_warehouse_transfer = True (:1616-1623, 1714)\nBR21: MIA transfer keeps dept/area/row, changes phase to MIA order and warehouse to MIA project agency (:1376-1402)`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1320
          },
          {
            pageNumber: 67,
            text: `B12. Gaps Summary (as-is defects / missing logic)\nG01: ClairUtilities submodule missing – repo cannot be built or fully specified\nG02: "Search all part groups" fallback is ineffective (flag not passed to Get_Parts_From_Warehouse)\nG03: Filter timer not stopped on an unchanged search\nG04: Scan check-in ignores return value (false green) and skips warehouse confirmation\nG05: Config persistence uses three different table names (app_config, AppConfig, App_Config)\nG06: MIA order chosen in app is not saved to DB; DB value overrides it at next startup\nG07: Write actions (Mark As Counted, verify, check-in, MIA) have no permission checks\nG08: MIA move lacks error handling, allows negative quantities, crashes on decimals\nG09: Form background stays red after any check-in error\nG10: Hidden "Export Part History to Excel" button with no implementation\nG11: Check-in sound played twice on barcoded success\nG12: Mark As Counted query has no explicit current-user filter (depends on mudbmsinfo scope)\nG13: Unused files (Index.dat, Storage.dat, 4 icons) and dead code`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1120
          }
        ],
        analysis: {
          purpose: {
            primaryPurpose: 'FSD or detailed requirements',
            module: 'Cycle Count Utility (CycleCount.exe)',
            currentSituation: '2-tier Windows Forms client (.NET 4.8 / VB.NET / SQL Server / Infragistics UltraWinGrid / Excel COM Interop).',
            intendedWork: 'Modernization to deterministic enterprise architecture, formal OPA/Cedar role-based security, automated barcode verification, and discrepancy auditing.',
            unknowns: [
              'Confirm ClairUtilities external Git submodule resolution (missing from repo).',
              'Address G04: CheckInWithBarcode ignores return value (false green) and skips warehouse mismatch dialog on scan.',
              'Address G06: User MIA order choice is not saved to database App_Config and gets overridden at restart.'
            ],
            isUserCorrected: false,
            supportingEvidence: [
              { page: 1, passage: 'Cycle Count Utility: PRD and FSD Overview for Inventory Management System' },
              { page: 16, passage: 'Section A3: User Personas & Permissions (P1 through P6)' }
            ]
          },
          roles: [
            {
              id: 'rol-cc-p1-1',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Cycle Count Barcode Scan (F14)',
              resource: 'Floor Inventory Items',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Refreshes receipt date on INSTOCK/REPAIR; prompts check-in if found on project; emits audio feedback.',
              provenance: { page: 33, passage: 'F14: Cycle Count Barcode Scan (Utility.vb:96-175)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p1-2',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Mark As Counted (F13)',
              resource: 'WarehouseCycleCounts History',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Inserts record to WarehouseCycleCounts with SQL login (SUSER_SNAME()) and server timestamp.',
              provenance: { page: 32, passage: 'F13: Mark As Counted (Utility.vb:927-957)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p1-3',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Check-in Item to Warehouse (F16)',
              resource: 'Warehouse Stock / INSTOCK',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Barcoded and non-barcoded check-in with warehouse mismatch confirmation dialog.',
              provenance: { page: 35, passage: 'F16: Check Item Into Your Warehouse (Utility.vb:1497-1878)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p1-4',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Move Barcode/Part to MIA Order (F17)',
              resource: 'Missing Inventory Orders',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Transfers missing item to user configured MIA order via MassTransferStaging_v.',
              provenance: { page: 38, passage: 'F17: Move Barcode/Part to MIA Order (Utility.vb:1331-1410)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p1-5',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Verify Dimensions & Weight (F11)',
              resource: 'Part Master Specifications',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Updates inpart with dimsVerifiedUser and dbo.today() verification timestamps.',
              provenance: { page: 31, passage: 'F11: Verify Dimensions / Weight (Utility.vb:1461-1495)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p1-6',
              role: 'P1 – Cycle Counter',
              relationship: 'Performer',
              action: 'Locate Part by Barcode (F15)',
              resource: 'Multi-Warehouse Inventory',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Finds part across all warehouses and injects row into parts list if from another warehouse.',
              provenance: { page: 34, passage: 'F15: Enter Barcode (Locate Part) (Utility.vb:1905-1981)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p2-1',
              role: 'P2 – Inventory Editor',
              relationship: 'Approver',
              action: 'Add / Remove Inventory Launchers (F19)',
              resource: 'Inventory Adjustment Tools',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires dbo.can_edit_inventory() = 1 and menu right for Add Inventory / Device Maintenance.',
              provenance: { page: 16, passage: 'A3: Persona P2 – Inventory Editor' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p3-1',
              role: 'P3 – Parts Editor',
              relationship: 'Approver',
              action: 'Part Maintenance Launcher (F19)',
              resource: 'Part Master Catalogue',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires dbo.can_edit_parts() = 1 and menu right Part Maintenance.',
              provenance: { page: 16, passage: 'A3: Persona P3 – Parts Editor' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p4-1',
              role: 'P4 – Utilization User',
              relationship: 'Performer',
              action: 'Utilization Toolbar Launcher (F19)',
              resource: 'Utilization Metrics Engine',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires menu right Utilization in fn_user_menus.',
              provenance: { page: 16, passage: 'A3: Persona P4 – Utilization user' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p5-1',
              role: 'P5 – Warehouse Supervisor',
              relationship: 'Approver',
              action: 'Cycle Count Check Up Review (F23)',
              resource: 'Multi-Warehouse Count Audit',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Inspects and audits past counts by warehouse, date range, and operator.',
              provenance: { page: 42, passage: 'F23: Cycle Count Check Up (CheckUp.vb)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p5-2',
              role: 'P5 – Warehouse Supervisor',
              relationship: 'Approver',
              action: 'Export Parts Grid to Styled Excel (F21)',
              resource: 'Analytical Reports',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Bulk writes parts list and count history to Excel workbook via COM Interop.',
              provenance: { page: 41, passage: 'F21: Export Parts to Excel (Utility.vb:801-878)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p6-1',
              role: 'P6 – User with No Warehouse',
              relationship: 'Performer',
              action: 'Browse & View Parts',
              resource: 'Read-Only Catalog',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'User without assigned default warehouse entity (_UserWarehouseCode empty).',
              provenance: { page: 16, passage: 'A3: Persona P6 – User with no warehouse' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p6-2',
              role: 'P6 – User with No Warehouse',
              relationship: 'Performer',
              action: 'Check-in Item to Warehouse (F16)',
              resource: 'Warehouse Stock / INSTOCK',
              effect: 'Deny',
              recordScope: 'None',
              conditions: 'Strictly blocked: "You do not belong to a warehouse. Contact your IT administrator."',
              provenance: { page: 36, passage: 'Validation: _UserWarehouseCode empty -> Check-in blocked' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-cc-p6-3',
              role: 'P6 – User with No Warehouse',
              relationship: 'Performer',
              action: 'Mark As Counted (F13)',
              resource: 'WarehouseCycleCounts',
              effect: 'Deny',
              recordScope: 'None',
              conditions: 'Strictly blocked without default warehouse assignment.',
              provenance: { page: 32, passage: 'F13: Mark As Counted requires valid warehouse_entity' },
              reviewState: 'Approved'
            }
          ],
          facts: [
            {
              id: 'fct-cc-01',
              type: 'behavior',
              statement: 'BR01: Warehouse list excludes LAX2 (main) and NEW, LAX2 (Check Up)',
              details: 'Warehouse dropdown query excludes LAX2 in frmCycleCount and Check Up to prevent cross-region corruption.',
              provenance: { page: 57, passage: 'BR01: Utility.vb:220, CheckUp.vb:35' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-02',
              type: 'behavior',
              statement: 'BR02: Default warehouse resolved from warehouses where is_default = 1',
              details: 'At startup, the system assigns _UserWarehouseCode from the default warehouse database row.',
              provenance: { page: 57, passage: 'BR02: Utility.vb:363, :56' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-03',
              type: 'behavior',
              statement: 'BR07: Cycle counts are insert-only history records stamped with server time',
              details: 'Counts are never updated in place. Each count creates a new row stamped with SUSER_SNAME() and GETDATE().',
              provenance: { page: 58, passage: 'BR07: Utility.vb:939-940' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-04',
              type: 'behavior',
              statement: 'BR14: INSTOCK and REPAIR scans confirm presence without triggering check-in',
              details: 'Items already on INSTOCK or REPAIR get their receipt timestamp refreshed rather than moving stock.',
              provenance: { page: 59, passage: 'BR14: Utility.vb:124, 1871-1878' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-05',
              type: 'behavior',
              statement: 'BR15: Scanning project barcode prompts user to check item into default warehouse',
              details: 'Prompt asks user if found item should be checked back into INSTOCK, changing row to lime green.',
              provenance: { page: 59, passage: 'BR15: Utility.vb:150-162' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-06',
              type: 'behavior',
              statement: 'BR16: Check-in always targets to_batchno = INSTOCK and allow_warehouse_transfer = True',
              details: 'Parameters for part_checkin_with_barcode enforce INSTOCK batch and allow inter-warehouse movement.',
              provenance: { page: 59, passage: 'BR16: Utility.vb:1616-1623, 1714' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-cc-07',
              type: 'behavior',
              statement: 'BR21: MIA transfer moves lost barcodes to user MIA project order',
              details: 'Stages row in MassTransferStaging_v with @@SPID and executes commit_mass_transfer stored procedure.',
              provenance: { page: 60, passage: 'BR21: Utility.vb:1376-1402' },
              reviewState: 'Approved'
            }
          ],
          scope: {
            functionalAreas: ['Setup & Auth', 'Filter Surface', 'Tree UX', 'Data Pipeline', 'Reporting & Launchers'],
            items: [
              { id: 'F01', functionalArea: 'Setup & Auth', title: 'Application Startup & Session Initialisation', description: 'Prepare session, SQL connection gconn, permissions, and layout.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F01: Utility.vb:203-274' }, reviewState: 'Approved' },
              { id: 'F02', functionalArea: 'Setup & Auth', title: 'Menu Security Trimming', description: 'Trim ToolStrip items based on fn_user_menus and can_edit_* DB rights.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F02: Utility.vb:276-354' }, reviewState: 'Approved' },
              { id: 'F03', functionalArea: 'Filter Surface', title: 'Warehouse Selection', description: 'Filter and populate active warehouses, excluding LAX2; default selection.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F03: Utility.vb:356-373' }, reviewState: 'Approved' },
              { id: 'F04', functionalArea: 'Filter Surface', title: 'Storage Location Filter', description: 'Client-side filter on parts list by storage location.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F04: Utility.vb:375-382' }, reviewState: 'Approved' },
              { id: 'F05', functionalArea: 'Filter Surface', title: 'Category & Commodity List', description: 'Populate distinct commodities with on-hand > 0 in warehouse.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F05: Utility.vb:385-423' }, reviewState: 'Approved' },
              { id: 'F06', functionalArea: 'Filter Surface', title: 'Part Group List', description: 'Comma-separated prefix parsing of part descriptions for categorization.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F06: Utility.vb:425-458' }, reviewState: 'Approved' },
              { id: 'F07', functionalArea: 'Tree UX', title: 'Parts List by Cycle Count Priority', description: 'SP Get_Cycle_Count_Utility_Parts_List ranked by utilization.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F07: Utility.vb:460-503' }, reviewState: 'Approved' },
              { id: 'F08', functionalArea: 'Filter Surface', title: 'Free-text Part Search (Debounced)', description: '300ms debounced search across part number and description.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F08: Utility.vb:1164-1235' }, reviewState: 'Approved' },
              { id: 'F09', functionalArea: 'Tree UX', title: 'Part Details & History Pane', description: 'Location History, Part Cycle Count History, and User History modes.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F09: Utility.vb:573-682' }, reviewState: 'Approved' },
              { id: 'F10', functionalArea: 'Tree UX', title: 'Dimensions & Weight Status Bar', description: 'Calculates dimensions and weight with imperial unit conversions.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 17, passage: 'F10: Utility.vb:1096-1154' }, reviewState: 'Approved' },
              { id: 'F11', functionalArea: 'Data Pipeline', title: 'Verify Dimensions & Weight', description: 'Updates inpart dimsVerifiedUser and dbo.today() verification stamps.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F11: Utility.vb:1461-1495' }, reviewState: 'Approved' },
              { id: 'F12', functionalArea: 'Tree UX', title: 'Locations Grid (On-Hand Lines)', description: 'Displays onhand lines with barcode, phase, warehouse, and owner.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F12: Utility.vb:771-788' }, reviewState: 'Approved' },
              { id: 'F13', functionalArea: 'Data Pipeline', title: 'Mark As Counted', description: 'Inserts record to WarehouseCycleCounts with SUSER_SNAME() and timestamp.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F13: Utility.vb:927-957' }, reviewState: 'Approved' },
              { id: 'F14', functionalArea: 'Data Pipeline', title: 'Cycle Count Barcode Scan', description: 'Scans barcode, updates receipt date on INSTOCK/REPAIR with audio beep.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F14: Utility.vb:96-175' }, reviewState: 'Approved' },
              { id: 'F15', functionalArea: 'Tree UX', title: 'Enter Barcode (Locate Part)', description: 'Locates part by barcode across warehouses and injects into list.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F15: Utility.vb:1905-1981' }, reviewState: 'Approved' },
              { id: 'F16', functionalArea: 'Data Pipeline', title: 'Check Item into Warehouse', description: 'SP part_checkin_with_barcode with warehouse mismatch confirmation.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F16: Utility.vb:1497-1878' }, reviewState: 'Approved' },
              { id: 'F17', functionalArea: 'Data Pipeline', title: 'Move Barcode/Part to MIA Order', description: 'Mass transfer staging for missing or stray inventory items.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F17: Utility.vb:1331-1410' }, reviewState: 'Approved' },
              { id: 'F18', functionalArea: 'Setup & Auth', title: 'Reset / Choose MIA Order', description: 'Select MIA order via ProjectPicker and persist user setting.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F18: Utility.vb:1412-1426' }, reviewState: 'Approved' },
              { id: 'F19', functionalArea: 'Reporting & Launchers', title: 'Launch External Finesse Tools', description: 'Contextual launchers for Availability, Utilization, Device/Part Maint.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F19: Tools' }, reviewState: 'Approved' },
              { id: 'F20', functionalArea: 'Reporting & Launchers', title: 'Copy to Clipboard', description: 'Copy tab-separated grid data for part number, phase, or full list.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F20: Utility.vb:684-740' }, reviewState: 'Approved' },
              { id: 'F21', functionalArea: 'Reporting & Launchers', title: 'Export Parts to Excel', description: 'Automated COM Interop export of parts grid to styled Excel sheet.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F21: Utility.vb:801-878' }, reviewState: 'Approved' },
              { id: 'F22', functionalArea: 'Reporting & Launchers', title: 'Podio Issue Tracker Link', description: 'Opens browser to PODIO_PUBLIC_ISSUE_TRACKING_URL from SysConfig.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F22: Utility.vb:1888-1903' }, reviewState: 'Approved' },
              { id: 'F23', functionalArea: 'Reporting & Launchers', title: 'Cycle Count Check Up Review Screen', description: 'Review who counted what by warehouse, date, and user in CheckUp.vb.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 18, passage: 'F23: CheckUp.vb' }, reviewState: 'Approved' },
              { id: 'F24', functionalArea: 'Setup & Auth', title: 'Window Layout Persistence', description: 'Saves location, size, and state to App_Config and local settings.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 19, passage: 'F24: Utility.vb:59-94' }, reviewState: 'Approved' },
              { id: 'F25', functionalArea: 'Tree UX', title: 'Audio & Voice Feedback System', description: 'Plays 5 WAV sounds and text-to-speech for scanning and verification.', workStatus: 'Proposed', deliveryScope: 'Included', provenance: { page: 19, passage: 'F25: Sounds' }, reviewState: 'Approved' }
            ]
          },
          questions: [
            {
              id: 'clr-cc-01',
              question: 'Confirm ClairUtilities external submodule resolution and database connection provider.',
              basis: 'FSD G01 states ClairUtilities submodule is missing from repository; database helper methods are inferred.',
              impact: 'Critical for compiling database extension methods and duplicate barcode picker dialogs.',
              state: 'Open',
              blocking: true
            },
            {
              id: 'clr-cc-02',
              question: 'Address F14 scan check-in false-positive green confirmation on unhandled return code.',
              basis: 'FSD G04 indicates CheckInWithBarcode return value is currently unhandled on check-in failures.',
              impact: 'Prevents warehouse operators from assuming an item was checked in when the database operation failed.',
              state: 'Open',
              blocking: false
            },
            {
              id: 'clr-cc-03',
              question: 'Persist MIA order selection to database App_Config instead of local settings only.',
              basis: 'FSD G06 notes chosen MIA order is not saved to DB; startup prefers DB value which overwrites local setting.',
              impact: 'Ensures warehouse operator choice persists across terminal sessions.',
              state: 'Open',
              blocking: false
            }
          ],
          baselineHistory: [],
          roleMap: {
            roles: [
              {
                roleName: 'P1 – Cycle Counter',
                features: [
                  {
                    featureName: 'Cycle Count Execution',
                    actions: [
                      { id: 'act-f14', actionName: 'Cycle Count Barcode Scan (F14)', effect: 'Allow', recordScope: 'Assigned', conditions: 'Floor barcode scan and receipt date refresh', sourcePage: 33, sourcePassage: 'F14: Utility.vb:96-175' },
                      { id: 'act-f13', actionName: 'Mark As Counted (F13)', effect: 'Allow', recordScope: 'Assigned', conditions: 'INSERT INTO WarehouseCycleCounts', sourcePage: 32, sourcePassage: 'F13: Utility.vb:927-957' },
                      { id: 'act-f16', actionName: 'Check Item into Warehouse (F16)', effect: 'Allow', recordScope: 'Assigned', conditions: 'Check in found project items', sourcePage: 35, sourcePassage: 'F16: Utility.vb:1497-1878' },
                      { id: 'act-f17', actionName: 'Move to MIA Order (F17)', effect: 'Allow', recordScope: 'Assigned', conditions: 'Staging mass transfer', sourcePage: 38, sourcePassage: 'F17: Utility.vb:1331-1410' }
                    ]
                  }
                ]
              },
              {
                roleName: 'P2 – Inventory Editor',
                features: [
                  {
                    featureName: 'Inventory Governance',
                    actions: [
                      { id: 'act-f19-inv', actionName: 'Add / Remove Inventory Launchers', effect: 'Allow', recordScope: 'Global', conditions: 'can_edit_inventory = 1', sourcePage: 40, sourcePassage: 'F19: Tools' }
                    ]
                  }
                ]
              },
              {
                roleName: 'P5 – Warehouse Supervisor',
                features: [
                  {
                    featureName: 'Audit & Compliance',
                    actions: [
                      { id: 'act-f23', actionName: 'Cycle Count Check Up Review (F23)', effect: 'Allow', recordScope: 'Global', conditions: 'Multi-warehouse audit by date and user', sourcePage: 42, sourcePassage: 'F23: CheckUp.vb' },
                      { id: 'act-f21', actionName: 'Export Parts to Excel (F21)', effect: 'Allow', recordScope: 'Global', conditions: 'COM Interop export', sourcePage: 41, sourcePassage: 'F21: Utility.vb:801-878' }
                    ]
                  }
                ]
              }
            ]
          },
          uiPlayground: {
            roles: ['P1 – Cycle Counter', 'P2 – Inventory Editor', 'P5 – Warehouse Supervisor', 'P6 – User with No Warehouse'],
            activeRole: 'P1 – Cycle Counter',
            screens: [
              {
                id: 'scr-cc-main',
                title: 'Cycle Count Utility Terminal (frmCycleCount)',
                roleAccess: {
                  'P1 – Cycle Counter': { allowed: true, recordScope: 'Assigned' },
                  'P2 – Inventory Editor': { allowed: true, recordScope: 'Global' },
                  'P5 – Warehouse Supervisor': { allowed: true, recordScope: 'Global' },
                  'P6 – User with No Warehouse': { allowed: false, recordScope: 'None' }
                },
                fields: [
                  { id: 'fld-wh', label: 'Selected Warehouse', type: 'select', defaultValue: 'LAX1 - Main Distribution Hub', required: true, sourceRequirement: 'F03' },
                  { id: 'fld-cat', label: 'Commodity Category', type: 'select', defaultValue: 'AUDIO - Microphones & Mixers', required: true, sourceRequirement: 'F05' },
                  { id: 'fld-bc', label: 'Barcode Scanner Wedge', type: 'text', defaultValue: 'BC-992014-A', required: true, sourceRequirement: 'F14' }
                ],
                mockRecords: [
                  { testCase: 'VR01', scenario: 'Part Group Selection', expectedBehavior: 'Must be selected before loading parts list', status: 'Verified' },
                  { testCase: 'VR02', scenario: 'Mark As Counted Cell Validation', expectedBehavior: 'Part cell must be selected and not empty', status: 'Verified' },
                  { testCase: 'VR06', scenario: 'Barcode Scan Match', expectedBehavior: 'Must exist in current Locations grid; audio cue triggers', status: 'Verified' },
                  { testCase: 'VR10', scenario: 'Warehouse Assignment Check', expectedBehavior: 'Check-in blocked if user has no assigned default warehouse', status: 'Verified' }
                ],
                actions: [
                  { id: 'act-scan', label: 'Process Barcode Scan', variant: 'primary', requiredRole: ['P1 – Cycle Counter'] },
                  { id: 'act-count', label: 'Mark As Counted', variant: 'primary', requiredRole: ['P1 – Cycle Counter'] },
                  { id: 'act-checkup', label: 'Open Check Up Review', variant: 'secondary', requiredRole: ['P5 – Warehouse Supervisor'] }
                ]
              }
            ]
          },
          tasks: [
            {
              id: 'TSK-CC-01',
              outcome: 'Modernized Warehouse Session & SQL Connection Manager',
              discipline: 'Backend',
              prerequisites: [],
              dependencies: [],
              acceptanceChecks: ['Excludes LAX2 from warehouse dropdown per BR01', 'Resolves default warehouse from is_default = 1 row per BR02', 'Trims menu toolbar by user permissions'],
              optimisticDays: 2.5,
              expectedDays: 4,
              pessimisticDays: 6,
              assignedRole: 'Senior Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-CC-02',
              outcome: 'Parts Priority Grid with Utilization Ranking & Debounced Search',
              discipline: 'Frontend',
              prerequisites: ['TSK-CC-01'],
              dependencies: ['TSK-CC-01'],
              acceptanceChecks: ['Renders parts ranked by Get_Cycle_Count_Utility_Parts_List SP', 'Debounces search by 300ms across partno and description', 'Renders color-coded utilization bar'],
              optimisticDays: 3,
              expectedDays: 5,
              pessimisticDays: 7.5,
              assignedRole: 'Senior Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-CC-03',
              outcome: 'Real-Time Barcode Scanner Wedge & Audio Cue Feedback',
              discipline: 'Integration',
              prerequisites: ['TSK-CC-02'],
              dependencies: ['TSK-CC-02'],
              acceptanceChecks: ['Executes dbo.Update_Barcode_Receipt_Date on INSTOCK/REPAIR rows', 'Prompts check-in when barcode found on project', 'Plays WAV feedback and highlights row green'],
              optimisticDays: 3.5,
              expectedDays: 5.5,
              pessimisticDays: 8,
              assignedRole: 'Full Stack Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-CC-04',
              outcome: 'Multi-Warehouse Check-In Engine with Mismatch Confirmation',
              discipline: 'Backend',
              prerequisites: ['TSK-CC-01', 'TSK-CC-03'],
              dependencies: ['TSK-CC-01'],
              acceptanceChecks: ['Executes part_checkin_with_barcode SP', 'Displays warehouse mismatch confirmation dialog on discrepancy', 'Enforces strict validation if user has no default warehouse'],
              optimisticDays: 3,
              expectedDays: 4.5,
              pessimisticDays: 7,
              assignedRole: 'Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-CC-05',
              outcome: 'MIA Mass Transfer Staging & Transactional Move Service',
              discipline: 'Backend',
              prerequisites: ['TSK-CC-01'],
              dependencies: ['TSK-CC-01'],
              acceptanceChecks: ['Stages rows in MassTransferStaging_v with @@SPID', 'Executes commit_mass_transfer stored procedure', 'Validates non-negative transfer quantity'],
              optimisticDays: 2.5,
              expectedDays: 4,
              pessimisticDays: 6,
              assignedRole: 'Database / Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-CC-06',
              outcome: 'Cycle Count Check Up Audit Screen & Operator History',
              discipline: 'Frontend',
              prerequisites: ['TSK-CC-01'],
              dependencies: ['TSK-CC-01'],
              acceptanceChecks: ['Multi-level drilldown: Warehouse -> Dates Grid -> Users Grid -> Counted Parts', 'Date filter toggle across all history dates', 'Export to styled Excel spreadsheet'],
              optimisticDays: 3.5,
              expectedDays: 5,
              pessimisticDays: 8,
              assignedRole: 'Senior Frontend Engineer',
              status: 'Approved'
            }
          ],
          forecast: {
            knownScopeHours: 520,
            engineersCount: 2,
            hoursPerDay: 7,
            bufferPercent: 15,
            optimisticWeeks: 7.2,
            expectedWeeks: 9.1,
            pessimisticWeeks: 12.8,
            knownPercent: 91,
            assumedPercent: 6,
            blockedPercent: 3,
            assumptions: [
              'Target architecture utilizes Node/PostgreSQL or modern .NET 8 API with React front-end.',
              'Database stored procedures can be called directly or mapped via ORM without altering table schema.',
              'Standard 35 productive engineering hours per week per engineer.'
            ],
            blockers: [
              'TSK-CC-01 requires resolution of external ClairUtilities dependency source repository.'
            ]
          }
        }
      }
    ]
  },
  {
    id: 'proj-sales-forecast',
    name: 'Sales Forecast Modernization & LOC Estimation',
    objective: 'Modernize legacy Visual Basic 6 desktop application to .NET WinForms with calibrated LOC and PERT hours.',
    clientName: 'Enterprise Sales Operations',
    domain: 'Enterprise Modernization',
    latestVersion: 'v1.0',
    status: 'needs_review',
    unresolvedCount: 2,
    createdAt: '2026-10-28',
    updatedAt: '2026-10-30',
    currentVersionId: 'ver-sf-1.0',
    activeBaseline: {
      id: 'base-sf-1.0',
      name: 'Baseline v1.0 - Reviewed Draft',
      approvedBy: 'Pragatheeswaran Kasinathan',
      approvedAt: '2026-10-30 09:15',
      includedScopeCount: 8,
      status: 'active'
    },
    versions: [
      {
        versionId: 'ver-sf-1.0',
        fileName: 'CD-Sales_Forecast_Analysis__LOC_Count__Comparison__and_ETA_Estimation-281026-084501_f749799f.pdf',
        fileSizeBytes: 419430,
        uploadedAt: '30 Oct 2026',
        contentFingerprint: 'sha256-sf8pages7b2e9a',
        pageCount: 8,
        pages: [
          {
            pageNumber: 1,
            text: `Sales Forecast Analysis: LOC Count, Comparison, and ETA Estimation
Sales Forecast (SalesForecast-main) — LOC Count, Comparison, and ETA
Document type: Complexity assessment + man-hour estimation (same method as Comparison ETA – PAM)
Module: Sales Forecast / Sales Projections ( SalesForecast.exe , prjSalesForecast )
Source scanned: C:\\Users\\akshara.karikalan\\Downloads\\SalesForecast
Benchmarks:
• Project Calendar — C:\\Users\\...\\ProjectCalendar + Calendar.txt (860 hours, index 1.0)
• Scheduling Board — C:\\Users\\...\\SchedulingBoard-main + Scheduling-board.txt (1,480 hours, index 1.72)
• Method example — Comparison+ETA+-+PAM.doc (PAM = 800 hours, index 0.93)
Date: 16 Sep 2026
Stack of current code: Visual Basic 6 desktop EXE (not .NET). Estimate below is for a Finesse-style .NET WinForms modernization.

A. Lines of code — necessary application lines only
Counting rules (what "necessary" means)
Included:
• Executable product logic (filters, SQL/SP call, tree render, Excel export, tool launch, settings)
• Helper code actually called by that logic
• ColumnTreeViewStateHelper.cls (tree expand/scroll restore)
Excluded:
• Visual SourceSafe / IDE junk (.scc, .vbw, .log)
• Binary resources (.frx)
• VB6 form designer layout (control coordinates; needed to compile, not business logic)
• Blank lines and comment-only lines
• Dead handlers (optRevenueGross_Click / optRevenueNet_Click — controls are not on the form)`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1420
          },
          {
            pageNumber: 2,
            text: `• Unused Utilities.bas routines (shared Finesse dump; same file also appears in Project Calendar)
• Duplicate Utilities.AppendSQL (the form has its own AppendSQL)

A.1 File-level count
File: frmSalesForecast.frm
Total raw lines: 4,463
Layout / designer junk removed: 1,720 lines
Comments and blanks removed: 1,180 lines
Dead handlers (optRevenueGross_Click, optRevenueNet_Click): 48 lines
Duplicate Utilities.AppendSQL: 32 lines
Necessary application lines: 1,483 lines
Form logic includes:
- Multi-dimensional tree grid filtering (Fiscal Year, Region, Business Unit, Channel)
- Parameter construction for 14 Stored Procedures
- Excel COM Interop workbook export with formatting
- Settings persistence in local Windows Registry

File: ColumnTreeViewStateHelper.cls
Total raw lines: 488
Designer layout removed: 0 lines
Comments and blanks removed: 122 lines
Necessary application lines: 366 lines
Class logic includes:
- Preserving node expand/collapse state across data refreshes
- Scroll position synchronization
- Selection key history stack`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1210
          },
          {
            pageNumber: 3,
            text: `Summary of Necessary LOC:
1. frmSalesForecast.frm: 1,483 LOC (80.2%)
2. ColumnTreeViewStateHelper.cls: 366 LOC (19.8%)
Total Necessary Application LOC: 1,849 lines
Excluded Boilerplate & Unused Dump: 3,468 lines
Signal-to-Noise Ratio: 34.8% true business logic.

B. Stored Procedure & Backend Interfacing
The module calls 14 SQL Server Stored Procedures across 3 logical groups:
1. Projection Calculation & Aggregation (6 SPs):
   - sp_SF_GetQuarterlyForecast
   - sp_SF_CalculateRevenueVariance
   - sp_SF_AggregateByRegion
   - sp_SF_GetHistoricalBaseline
   - sp_SF_ComputePipelineProbability
   - sp_SF_UpdateScenarioWeights
2. Master Entity Lookup & Security (5 SPs):
   - sp_SF_GetUserTerritoryRights
   - sp_SF_ListFiscalCalendars
   - sp_SF_GetCurrenciesAndFxRates
   - sp_SF_GetProductHierarchies
   - sp_SF_GetSalesRepresentatives
3. Export & Audit Logging (3 SPs):
   - sp_SF_LogExportAction
   - sp_SF_SaveCustomFilterPreset
   - sp_SF_GetAuditTrailForForecast`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1190
          },
          {
            pageNumber: 4,
            text: `C. Complexity Comparison Benchmark Table
Metric                 Project Calendar (Benchmark)    Scheduling Board    Sales Forecast (Target)
Raw Line Count         6,120 lines                     11,840 lines        5,317 lines
Necessary Logic LOC    3,280 lines                     5,910 lines         1,849 lines
Stored Procedures      8 SPs                           22 SPs              14 SPs
UI Controls & Grids    FlexGrid + 2 Pickers            Custom Gantt Canvas Multi-Column TreeView + Ribbon
Modernization Ratio    1.00x Base (860 hours)          1.72x (1,480 hours) 0.55x (477 hours)

D. Method Analysis & Risk Factors
1. Third-party Control Replacement:
   The legacy VB6 ColumnTreeView control relies on 32-bit ActiveX OCX (MSCOMCTL.OCX / Sheridan DataWidgets). In .NET WinForms, this must be migrated to a modern DataGridView or ObjectListView with custom hierarchical rendering.
2. Excel Interop:
   VB6 directly called Excel via OLE Automation. In .NET, this will be replaced with ClosedXML or OpenXML to avoid COM server leaks and eliminate Excel desktop installation requirements.
3. Database Migration:
   Stored procedure parameters pass legacy Visual Basic variant data types; modern ADO.NET / Dapper data access layer requires strict typed mappings.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1350
          },
          {
            pageNumber: 5,
            text: `E. Work Breakdown Structure (WBS) & Sprint Allocation
Task ID   WBS    Module / Deliverable                         Optimistic   Most Likely   Pessimistic   PERT Hours
TSK-01    1.1    Data Access Layer & 14 SP Mappings (Dapper)   40 hrs       52 hrs        76 hrs        54.7 hrs
TSK-02    1.2    Hierarchical TreeGrid Component & State       60 hrs       80 hrs        110 hrs       81.7 hrs
TSK-03    1.3    Multi-level Filter Engine (FY, Region, BU)    35 hrs       45 hrs        65 hrs        46.7 hrs
TSK-04    2.1    Excel OpenXML Reporting Engine                30 hrs       40 hrs        60 hrs        41.7 hrs
TSK-05    2.2    User Territory Security & Role Filter         25 hrs       35 hrs        50 hrs        36.0 hrs
TSK-06    2.3    Integration Testing & Legacy Output Match     45 hrs       60 hrs        90 hrs        62.5 hrs
TSK-07    3.1    Packaging, MSI Installer & Registry Migration 20 hrs       30 hrs        45 hrs        30.8 hrs
TSK-08    3.2    UAT Bug Fixing & Performance Optimization     40 hrs       55 hrs        80 hrs        56.7 hrs
Subtotal Estimated Development Effort: 410.8 hrs
Project Management & Architecture Contingency (16%): 66.2 hrs
Total Recommended Commercial Delivery Estimate: 477 hours (approx. 59.6 engineering days).`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1290
          },
          {
            pageNumber: 6,
            text: `F. Quality Gates & Acceptance Criteria
QA-SF-01: Calculated quarterly forecast totals in .NET must match legacy VB6 output to within $0.01 precision across 10,000 historical test records.
QA-SF-02: TreeGrid node collapse and expand state must persist seamlessly when switching fiscal filters without full view rebuilding.
QA-SF-03: Export to Excel must execute in under 2.5 seconds for 5,000 rows without requiring Microsoft Office installed on client machines.
QA-SF-04: User territory scoping: Users assigned to 'EMEA' must never observe 'Americas' pipeline rows in API or grid responses.
QA-SF-05: Application memory consumption must remain below 180 MB under heavy scrolling, verifying complete disposal of tree nodes and font handles.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 950
          },
          {
            pageNumber: 7,
            text: `G. Source Citations & Audit Traceability
1. "frmSalesForecast.frm contains 1,483 necessary lines after stripping 1,720 layout lines and 1,180 comment lines." — Page 2, Line 12
2. "ColumnTreeViewStateHelper.cls retains 366 lines of tree state synchronization." — Page 2, Line 34
3. "Total 14 Stored Procedures invoked across 3 groups: Projections, Master Data, Audit." — Page 3, Line 8
4. "Modernization index calculated at 0.55x of Project Calendar 860-hour baseline." — Page 4, Line 14
5. "Final PERT estimate calibrated at 477 hours across 2 milestone releases." — Page 5, Line 22`,
            hasWarnings: false,
            warnings: [],
            characterCount: 780
          },
          {
            pageNumber: 8,
            text: `H. Review Sign-off & Document Authority
Report Author: Akshara Karikalan, Senior Modernization Analyst
Technical Reviewer: Pragatheeswaran Kasinathan, Engineering Lead
Approved Delivery Method: Three-point PERT estimation calibrated against Project Calendar and PAM historical benchmarks.
Document Status: Reviewed & Verified for Engineering Intake.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 450
          }
        ],
        analysis: {
          purpose: {
            primaryPurpose: 'Estimation or analysis report',
            module: 'Sales Forecast / Sales Projections (SalesForecast.exe, prjSalesForecast)',
            currentSituation: 'Visual Basic 6 desktop EXE with 5,317 raw lines, ActiveX ColumnTreeView, and direct Excel COM automation.',
            intendedWork: 'Modernization to Finesse-style .NET WinForms using C#, Dapper ORM for 14 Stored Procedures, OpenXML export, and custom Hierarchical TreeGrid.',
            unknowns: [
              'Explicit SQL parameter data type contract for sp_SF_UpdateScenarioWeights',
              'Exact denominator for revenue gross vs net margin variance calculations'
            ],
            isUserCorrected: false,
            supportingEvidence: [
              { page: 1, passage: 'Document type: Complexity assessment + man-hour estimation (same method as Comparison ETA – PAM)' },
              { page: 1, passage: 'Stack of current code: Visual Basic 6 desktop EXE (not .NET). Estimate below is for a Finesse-style .NET WinForms modernization.' },
              { page: 3, passage: 'Total Necessary Application LOC: 1,849 lines. Signal-to-Noise Ratio: 34.8% true business logic.' }
            ]
          },
          roles: [
            {
              id: 'rol-sf-01',
              role: 'Sales Representative',
              relationship: 'Performer',
              action: 'View and filter territory forecast',
              resource: 'Sales Forecast TreeGrid',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Only for sales territories linked to authenticated user ID.',
              provenance: { page: 3, passage: 'sp_SF_GetUserTerritoryRights filters access to assigned territory.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-sf-02',
              role: 'Sales Representative',
              relationship: 'Subject',
              action: 'View unassigned enterprise territories',
              resource: 'Global Territory Pipeline',
              effect: 'Deny',
              recordScope: 'Global',
              conditions: 'Non-managerial reps are strictly forbidden from viewing non-assigned territories.',
              provenance: { page: 6, passage: 'Users assigned to EMEA must never observe Americas pipeline rows.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-sf-03',
              role: 'Sales Executive / Director',
              relationship: 'Approver',
              action: 'Update scenario weights & override baseline',
              resource: 'Quarterly Forecast Scenarios',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires executive authorization role.',
              provenance: { page: 3, passage: 'sp_SF_UpdateScenarioWeights adjusts enterprise pipeline probabilities.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-sf-04',
              role: 'System Exporter',
              relationship: 'Performer',
              action: 'Generate OpenXML Excel workbook',
              resource: 'Excel Spreadsheet Report',
              effect: 'Allow',
              recordScope: 'Team-wide',
              conditions: 'Invokes sp_SF_LogExportAction on completion.',
              provenance: { page: 3, passage: 'sp_SF_LogExportAction records user and filter settings.' },
              reviewState: 'Approved'
            }
          ],
          facts: [
            {
              id: 'fct-sf-01',
              type: 'numeric',
              statement: 'Necessary application code is 1,849 lines',
              details: 'FrmSalesForecast has 1,483 LOC; ColumnTreeViewStateHelper has 366 LOC.',
              units: 'lines of code',
              referent: 'Necessary executable application logic',
              provenance: { page: 3, passage: 'Total Necessary Application LOC: 1,849 lines' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-sf-02',
              type: 'numeric',
              statement: 'Documented benchmark is 860 hours for Project Calendar (1.0x index)',
              details: 'Used as standard baseline comparison for modernization effort.',
              units: 'hours',
              referent: 'Project Calendar modernization benchmark',
              provenance: { page: 1, passage: 'Project Calendar — 860 hours, index 1.0' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-sf-03',
              type: 'dependency',
              statement: 'Calls 14 SQL Server Stored Procedures across 3 groups',
              details: '6 projection procedures, 5 lookup/security procedures, 3 audit procedures.',
              units: 'stored procedures',
              referent: 'SQL Server database procedures',
              provenance: { page: 3, passage: 'The module calls 14 SQL Server Stored Procedures across 3 logical groups' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-sf-04',
              type: 'behavior',
              statement: 'Tree state persistence synchronizes node collapse across refreshes',
              details: 'ColumnTreeViewStateHelper stores expand keys in a stack.',
              provenance: { page: 2, passage: 'Preserving node expand/collapse state across data refreshes' },
              reviewState: 'Approved'
            }
          ],
          scope: {
            functionalAreas: ['Forecast Calculation', 'Hierarchical TreeView', 'Security & Territory Scoping', 'Excel Export', 'Legacy Automation Clean-up'],
            items: [
              {
                id: 'scp-sf-01',
                functionalArea: 'Hierarchical TreeView',
                title: 'Multi-column TreeGrid with expand/collapse state preservation',
                description: 'Replace legacy ActiveX control with .NET hierarchical view preserving scroll position.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'Preserving node expand/collapse state across data refreshes' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-sf-02',
                functionalArea: 'Forecast Calculation',
                title: '14 Stored Procedure integration via Dapper',
                description: 'Strongly-typed data mapping for quarterly projections and variance aggregation.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 3, passage: 'The module calls 14 SQL Server Stored Procedures' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-sf-03',
                functionalArea: 'Excel Export',
                title: 'Server-side OpenXML Excel generation',
                description: 'Export structured forecast workbook without requiring client MS Office installation.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 4, passage: 'VB6 directly called Excel via OLE Automation. In .NET, this will be replaced with ClosedXML or OpenXML.' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-sf-04',
                functionalArea: 'Legacy Automation Clean-up',
                title: 'Dead handlers and obsolete Utilities.AppendSQL removal',
                description: 'Exclude optRevenueGross_Click, optRevenueNet_Click, and duplicate utility dumps.',
                workStatus: 'Existing',
                deliveryScope: 'Excluded',
                provenance: { page: 1, passage: 'Dead handlers (optRevenueGross_Click / optRevenueNet_Click — controls are not on the form)' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-sf-05',
                functionalArea: 'Forecast Calculation',
                title: 'Direct cloud CRM real-time bi-directional sync',
                description: 'Live bi-directional synchronization with external Salesforce or Dynamics CRM.',
                workStatus: 'Not established',
                deliveryScope: 'Undecided',
                provenance: { page: 4, passage: 'Cloud integration is not mentioned in source document.' },
                reviewState: 'Unresolved'
              }
            ]
          },
          questions: [
            {
              id: 'clr-sf-01',
              question: 'What is the exact SQL parameter schema for sp_SF_UpdateScenarioWeights?',
              basis: 'Page 3 lists the procedure name but omits data type definitions for scenario coefficients.',
              impact: 'Blocks integration testing and DAL entity code generation for Task TSK-01.',
              state: 'Open',
              blocking: true
            },
            {
              id: 'clr-sf-02',
              question: 'Should net revenue margin variance be calculated using GAAP gross revenue or operating revenue as the denominator?',
              basis: 'Page 2 mentions optRevenueGross and optRevenueNet dead handlers were removed.',
              impact: 'Affects QA-SF-01 precision matching test fixture.',
              state: 'Answered',
              blocking: false,
              answer: 'Use GAAP gross revenue as documented in standard company financial policy.',
              answeredBy: 'Pragatheeswaran Kasinathan',
              answeredAt: '30 Oct 2026 10:45'
            }
          ],
          baselineHistory: [
            {
              id: 'base-sf-1.0',
              name: 'Baseline v1.0 - Reviewed Draft',
              approvedBy: 'Pragatheeswaran Kasinathan',
              approvedAt: '2026-10-30 09:15',
              includedScopeCount: 8,
              status: 'active'
            }
          ],
          roleMap: {
            roles: [
              {
                roleName: 'Sales Representative',
                features: [
                  {
                    featureName: 'Sales Forecast Grid',
                    actions: [
                      {
                        id: 'act-sf-01',
                        actionName: 'Filter by Fiscal Year & Region',
                        effect: 'Allow',
                        recordScope: 'Assigned',
                        conditions: 'Only for assigned territories',
                        sourcePage: 2,
                        sourcePassage: 'frmSalesForecast.frm multi-dimensional tree grid filtering'
                      },
                      {
                        id: 'act-sf-02',
                        actionName: 'Drilldown Customer Pipeline',
                        effect: 'Allow',
                        recordScope: 'Assigned',
                        conditions: 'Authenticated user territory check',
                        sourcePage: 3,
                        sourcePassage: 'sp_SF_GetUserTerritoryRights'
                      },
                      {
                        id: 'act-sf-03',
                        actionName: 'View Unassigned Americas Territory',
                        effect: 'Deny',
                        recordScope: 'Global',
                        conditions: 'Strictly prohibited by territory governance',
                        sourcePage: 6,
                        sourcePassage: 'QA-SF-04: Users assigned to EMEA must never observe Americas pipeline rows.'
                      }
                    ]
                  },
                  {
                    featureName: 'Reporting',
                    actions: [
                      {
                        id: 'act-sf-04',
                        actionName: 'Export Current View to Excel (.xlsx)',
                        effect: 'Allow',
                        recordScope: 'Assigned',
                        conditions: 'Logs action in audit table',
                        sourcePage: 3,
                        sourcePassage: 'sp_SF_LogExportAction'
                      }
                    ]
                  }
                ]
              },
              {
                roleName: 'Executive Director',
                features: [
                  {
                    featureName: 'Forecast Governance',
                    actions: [
                      {
                        id: 'act-sf-05',
                        actionName: 'Override Scenario Weights',
                        effect: 'Allow',
                        recordScope: 'Global',
                        conditions: 'Executive authorization required',
                        sourcePage: 3,
                        sourcePassage: 'sp_SF_UpdateScenarioWeights'
                      },
                      {
                        id: 'act-sf-06',
                        actionName: 'View Enterprise Audit Log',
                        effect: 'Allow',
                        recordScope: 'Global',
                        conditions: 'Full system audit trail',
                        sourcePage: 3,
                        sourcePassage: 'sp_SF_GetAuditTrailForForecast'
                      }
                    ]
                  }
                ]
              }
            ]
          },
          uiPlayground: {
            roles: ['Sales Representative (EMEA)', 'Sales Representative (Americas)', 'Executive Director'],
            activeRole: 'Sales Representative (EMEA)',
            screens: [
              {
                id: 'scr-sf-main',
                title: 'Sales Forecast Modernization Explorer',
                roleAccess: {
                  'Sales Representative (EMEA)': { allowed: true, recordScope: 'Assigned' },
                  'Sales Representative (Americas)': { allowed: true, recordScope: 'Assigned' },
                  'Executive Director': { allowed: true, recordScope: 'Global' }
                },
                fields: [
                  {
                    id: 'fld-fy',
                    label: 'Fiscal Year',
                    type: 'select',
                    defaultValue: 'FY 2026',
                    options: ['FY 2025', 'FY 2026', 'FY 2027'],
                    required: true,
                    sourceRequirement: 'Page 2: Fiscal Year selection dropdown'
                  },
                  {
                    id: 'fld-region',
                    label: 'Assigned Region',
                    type: 'select',
                    defaultValue: 'EMEA',
                    options: ['EMEA', 'Americas', 'APAC', 'Global Enterprise'],
                    required: true,
                    readOnlyForRoles: ['Sales Representative (EMEA)', 'Sales Representative (Americas)'],
                    sourceRequirement: 'Page 6, QA-SF-04: Non-executive reps locked to assigned territory'
                  },
                  {
                    id: 'fld-scenario-weight',
                    label: 'Pipeline Probability Weighting',
                    type: 'select',
                    defaultValue: 'Conservative (65%)',
                    options: ['Conservative (65%)', 'Base Case (80%)', 'Aggressive (95%)'],
                    readOnlyForRoles: ['Sales Representative (EMEA)', 'Sales Representative (Americas)'],
                    sourceRequirement: 'Page 3: sp_SF_UpdateScenarioWeights executive governance'
                  }
                ],
                mockRecords: [
                  { id: 'REC-01', territory: 'EMEA', account: 'Acme Europe GmbH', probability: '85%', q1Forecast: '€420,000', q2Forecast: '€510,000', status: 'Commit' },
                  { id: 'REC-02', territory: 'EMEA', account: 'Nordic Retail AS', probability: '70%', q1Forecast: '€180,000', q2Forecast: '€230,000', status: 'Best Case' },
                  { id: 'REC-03', territory: 'Americas', account: 'Apex USA Corp', probability: '90%', q1Forecast: '$850,000', q2Forecast: '$920,000', status: 'Commit' },
                  { id: 'REC-04', territory: 'Americas', account: 'Pacific Tech Inc', probability: '60%', q1Forecast: '$320,000', q2Forecast: '$410,000', status: 'Pipeline' }
                ],
                actions: [
                  { id: 'btn-export', label: 'Export to Excel (.xlsx)', variant: 'primary', requiredRole: ['Sales Representative (EMEA)', 'Sales Representative (Americas)', 'Executive Director'] },
                  { id: 'btn-override', label: 'Save Scenario Override', variant: 'secondary', requiredRole: ['Executive Director'], forbiddenMessage: 'Only Executive Directors have authorization to modify scenario weights.' }
                ]
              }
            ]
          },
          tasks: [
            {
              id: 'TSK-01',
              outcome: 'Data Access Layer & 14 Stored Procedure Mappings via Dapper',
              discipline: 'Backend',
              prerequisites: ['sp_SF parameter schema verification'],
              dependencies: [],
              acceptanceChecks: ['Maps all 14 SPs with typed parameters', 'Handles DBNull gracefully', 'Unit test coverage > 90%'],
              optimisticDays: 5,
              expectedDays: 6.5,
              pessimisticDays: 9.5,
              assignedRole: 'Senior Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-02',
              outcome: 'Hierarchical TreeGrid Component & State Synchronization',
              discipline: 'Frontend',
              prerequisites: ['ColumnTreeViewStateHelper logic port'],
              dependencies: ['TSK-01'],
              acceptanceChecks: ['Preserves expand/collapse state on refresh', 'Zero ActiveX dependency', 'Scroll position restored correctly'],
              optimisticDays: 7.5,
              expectedDays: 10,
              pessimisticDays: 14,
              assignedRole: 'Lead Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-03',
              outcome: 'Multi-level Filter Engine (FY, Region, BU, Channel)',
              discipline: 'Frontend',
              prerequisites: ['TSK-02'],
              dependencies: ['TSK-02'],
              acceptanceChecks: ['Filters update grid in < 200ms', 'Multi-select checkboxes support rapid clearing'],
              optimisticDays: 4.5,
              expectedDays: 5.5,
              pessimisticDays: 8,
              assignedRole: 'Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-04',
              outcome: 'Server-side OpenXML Excel Reporting Engine',
              discipline: 'Integration',
              prerequisites: ['TSK-01'],
              dependencies: ['TSK-01'],
              acceptanceChecks: ['Exports 5,000 rows in < 2.5s', 'No Microsoft Office installation required', 'Audit log row created on export'],
              optimisticDays: 4,
              expectedDays: 5,
              pessimisticDays: 7.5,
              assignedRole: 'Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-05',
              outcome: 'User Territory Security & Role-Based Access Scoping',
              discipline: 'Backend',
              prerequisites: ['TSK-01'],
              dependencies: ['TSK-01'],
              acceptanceChecks: ['Strictly filters out non-assigned territory rows', 'Throws 403 Forbidden on unauthorized territory ID'],
              optimisticDays: 3,
              expectedDays: 4.5,
              pessimisticDays: 6.5,
              assignedRole: 'Security / Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-06',
              outcome: 'Legacy Output Parity & Financial Verification Testing',
              discipline: 'Testing',
              prerequisites: ['TSK-01', 'TSK-02', 'TSK-03', 'TSK-04', 'TSK-05'],
              dependencies: ['TSK-01', 'TSK-02', 'TSK-03'],
              acceptanceChecks: ['Matches legacy VB6 calculations to within $0.01 precision across 10,000 sample rows', 'Verifies zero memory leaks'],
              optimisticDays: 5.5,
              expectedDays: 7.5,
              pessimisticDays: 11,
              assignedRole: 'Lead QA Engineer',
              status: 'Approved'
            }
          ],
          forecast: {
            knownScopeHours: 410.8,
            engineersCount: 2,
            hoursPerDay: 7,
            bufferPercent: 16,
            optimisticWeeks: 6.2,
            expectedWeeks: 7.5,
            pessimisticWeeks: 10.4,
            knownPercent: 88,
            assumedPercent: 8,
            blockedPercent: 4,
            assumptions: [
              'Team has 2 dedicated full-stack engineers with .NET & SQL Server expertise.',
              'Database stored procedures in target staging database require no structural modifications.',
              'Standard 35 productive engineering hours per week per engineer.'
            ],
            blockers: [
              'TSK-01 requires final confirmation of sp_SF_UpdateScenarioWeights parameter definitions.'
            ]
          }
        }
      }
    ]
  },
  {
    id: 'proj-edupulse-attendance',
    name: 'EduPulse School Attendance ERP & Access Matrix',
    objective: 'Implement role-based attendance management system with JWT authentication, teacher class scoping, and administrator override.',
    clientName: 'EduPulse Academic Consortium',
    domain: 'EdTech & Governance',
    latestVersion: 'v1.0',
    status: 'approved_baseline',
    unresolvedCount: 0,
    createdAt: '2026-10-25',
    updatedAt: '2026-10-30',
    currentVersionId: 'ver-ep-1.0',
    activeBaseline: {
      id: 'base-ep-1.0',
      name: 'Baseline v1.0 - Academic Governance Signed',
      approvedBy: 'Pragatheeswaran Kasinathan',
      approvedAt: '2026-10-29 14:20',
      includedScopeCount: 11,
      status: 'active'
    },
    versions: [
      {
        versionId: 'ver-ep-1.0',
        fileName: 'EduPulse_Attendance_Architecture_Spec.pdf',
        fileSizeBytes: 285400,
        uploadedAt: '29 Oct 2026',
        contentFingerprint: 'sha256-epattendance9821a',
        pageCount: 4,
        pages: [
          {
            pageNumber: 1,
            text: `EduPulse School Attendance Management System Specification
1. System Objectives & Architecture Overview
EduPulse provides a secure, role-governed web application for tracking student and staff attendance across primary and secondary schools.
The system implements strict separation of duties between School Administrators and Teachers:
- School Administrator Role: Full system access across all academic classes, student records, staff accounts, and global configuration.
- Teacher Role: Scoped access strictly limited to assigned classes and sections. Teachers cannot view or edit student records belonging to unassigned classes.

2. Authentication & Authorization Architecture
All requests authenticated via Bearer JWT tokens signed with RS256 algorithm.
Roles: 'School Administrator', 'Teacher'.
JWT claims include: userId, role, assignedClassIds (array of strings, e.g. ["CLS-10A", "CLS-10B"]).`,
            hasWarnings: false,
            warnings: [],
            characterCount: 920
          },
          {
            pageNumber: 2,
            text: `3. Daily Attendance Workflow & Lock Mechanics
3.1 Teacher Check-in:
Teachers submit their personal daily arrival check-in upon entering the facility.
3.2 Bulk Student Attendance Marking:
Teachers select an assigned class, view student roster, and mark status: Present, Absent, or Late.
3.3 Daily Cutoff Lock:
At 11:59 PM each calendar day, attendance records for that day are permanently locked.
Teachers CANNOT edit locked records.
3.4 Admin Override Escalation:
If an error was made prior to the lock, the Teacher submits an Override Request with justification reason.
The School Administrator must review and explicitly approve or reject the override request before records can be amended.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 880
          },
          {
            pageNumber: 3,
            text: `4. Data Matrix & Role Access Controls
Operation                         School Administrator        Teacher
Login to Portal                   Allowed                     Allowed
Manage User Accounts (CRUD)       Allowed (Global)            DENIED (No Access)
Configure Master Classes/Sections Allowed (Global)            DENIED (No Access)
Submit Personal Daily Check-in    Allowed                     Allowed (Own)
Mark Bulk Student Attendance      Allowed (Global)            Allowed (Assigned Classes Only)
Edit Locked Attendance (< 11:59PM) Allowed                    DENIED (Requires Admin Approval)
Generate Global Audit Reports     Allowed (Global)            DENIED (No Access)

5. Observability & Audit
All record modifications generate immutable audit logs with timestamp, userId, IP address, previous value, and new value.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1040
          },
          {
            pageNumber: 4,
            text: `6. Compliance & Quality Assurance Requirements
QA-EP-01: Teacher attempting to access a student record in an unassigned class must receive HTTP 403 Forbidden with security audit event recorded.
QA-EP-02: At 12:00 AM local time, automated cron job sets status of previous day's attendance ledger to 'LOCKED'. Subsequent PUT requests from Teacher role fail with error code ATT_CUTOFF_LOCKED.
QA-EP-03: School Administrator override must require two-factor confirmation and entry of reason code.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 650
          }
        ],
        analysis: {
          purpose: {
            primaryPurpose: 'FSD or detailed requirements',
            module: 'School Attendance & Role-Based Access Control System',
            currentSituation: 'Decentralized manual paper registers and fragmented teacher spreadsheets with lack of auditability.',
            intendedWork: 'Role-segregated web portal featuring JWT RBAC, daily personal check-in, bulk attendance marking, scheduled 11:59 PM lock, and admin override escalation workflow.',
            unknowns: [],
            isUserCorrected: false,
            supportingEvidence: [
              { page: 1, passage: 'EduPulse provides a secure, role-governed web application for tracking student and staff attendance.' },
              { page: 2, passage: 'At 11:59 PM each calendar day, attendance records for that day are permanently locked.' }
            ]
          },
          roles: [
            {
              id: 'rol-ep-01',
              role: 'School Administrator',
              relationship: 'Performer',
              action: 'Manage User Accounts (CRUD for Staff and Students)',
              resource: 'User Management Subsystem',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires active admin JWT session.',
              provenance: { page: 3, passage: 'Manage User Accounts (CRUD): School Administrator Allowed (Global)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-ep-02',
              role: 'Teacher',
              relationship: 'Performer',
              action: 'Manage User Accounts',
              resource: 'User Management Subsystem',
              effect: 'Deny',
              recordScope: 'Global',
              conditions: 'Teachers are strictly forbidden from modifying user credentials or staff accounts.',
              provenance: { page: 3, passage: 'Manage User Accounts: Teacher DENIED (No Access)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-ep-03',
              role: 'Teacher',
              relationship: 'Performer',
              action: 'Mark Bulk Student Attendance',
              resource: 'Class Attendance Ledger',
              effect: 'Allow',
              recordScope: 'Class-specific',
              conditions: 'Only for classes assigned in teacher JWT assignedClassIds claim.',
              provenance: { page: 3, passage: 'Mark Bulk Student Attendance: Teacher Allowed (Assigned Classes Only)' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-ep-04',
              role: 'Teacher',
              relationship: 'Requester',
              action: 'Request Admin Override for Locked Records',
              resource: 'Locked Attendance Ledger',
              effect: 'Require',
              recordScope: 'Class-specific',
              conditions: 'Must submit mandatory justification reason; cannot self-approve.',
              provenance: { page: 2, passage: 'Teacher submits an Override Request with justification reason.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-ep-05',
              role: 'School Administrator',
              relationship: 'Approver',
              action: 'Approve or Reject Attendance Lock Override',
              resource: 'Attendance Override Queue',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires reason code verification and 2FA confirmation.',
              provenance: { page: 2, passage: 'The School Administrator must review and explicitly approve or reject the override request.' },
              reviewState: 'Approved'
            }
          ],
          facts: [
            {
              id: 'fct-ep-01',
              type: 'numeric',
              statement: 'Cutoff lock triggers strictly at 11:59 PM local time daily',
              details: 'Enforces permanent read-only lock on current day attendance.',
              units: 'clock time',
              referent: 'Daily attendance ledger cutoff',
              provenance: { page: 2, passage: 'At 11:59 PM each calendar day, attendance records for that day are permanently locked.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-ep-02',
              type: 'dependency',
              statement: 'Authentication requires RS256 Bearer JWT tokens',
              details: 'Contains assignedClassIds array to enforce class-level isolation.',
              units: 'cryptographic algorithm',
              referent: 'JWT signing algorithm',
              provenance: { page: 1, passage: 'All requests authenticated via Bearer JWT tokens signed with RS256 algorithm.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-ep-03',
              type: 'behavior',
              statement: 'Bulk student attendance supports Present, Absent, and Late states',
              details: 'Submitted in batch per class section.',
              provenance: { page: 2, passage: 'Teachers select an assigned class, view student roster, and mark status: Present, Absent, or Late.' },
              reviewState: 'Approved'
            }
          ],
          scope: {
            functionalAreas: ['Authentication & RBAC', 'Teacher Roster & Attendance', 'Cutoff Lock Engine', 'Admin Governance & Master Data', 'Audit Trails'],
            items: [
              {
                id: 'scp-ep-01',
                functionalArea: 'Teacher Roster & Attendance',
                title: 'Bulk Student Attendance Marking Grid',
                description: 'Fast checkbox/toggle UI for teachers to mark daily attendance for assigned class rosters.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'Teachers select an assigned class, view student roster, and mark status.' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-ep-02',
                functionalArea: 'Cutoff Lock Engine',
                title: 'Automated 11:59 PM Cutoff Lock Worker',
                description: 'Scheduled background task freezing daily attendance records into immutable state.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'At 11:59 PM each calendar day, attendance records for that day are permanently locked.' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-ep-03',
                functionalArea: 'Admin Governance & Master Data',
                title: 'Override Escalation Approval Queue',
                description: 'Admin dashboard view to inspect teacher override requests and grant single-use edit tokens.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'The School Administrator must review and explicitly approve or reject the override request.' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-ep-04',
                functionalArea: 'Authentication & RBAC',
                title: 'Biometric Fingerprint Hardware Integration',
                description: 'Physical biometric scanner integration for student check-ins.',
                workStatus: 'Not established',
                deliveryScope: 'Excluded',
                provenance: { page: 1, passage: 'Excluded from initial web portal scope.' },
                reviewState: 'Approved'
              }
            ]
          },
          questions: [],
          baselineHistory: [
            {
              id: 'base-ep-1.0',
              name: 'Baseline v1.0 - Academic Governance Signed',
              approvedBy: 'Pragatheeswaran Kasinathan',
              approvedAt: '2026-10-29 14:20',
              includedScopeCount: 11,
              status: 'active'
            }
          ],
          roleMap: {
            roles: [
              {
                roleName: 'School Administrator',
                features: [
                  {
                    featureName: 'User Management',
                    actions: [
                      { id: 'act-ep-01', actionName: 'Create Staff & Student Accounts', effect: 'Allow', recordScope: 'Global', conditions: 'Admin role authenticated', sourcePage: 3, sourcePassage: 'Manage User Accounts Allowed (Global)' },
                      { id: 'act-ep-02', actionName: 'Assign Teacher Class Scopes', effect: 'Allow', recordScope: 'Global', conditions: 'Admin role authenticated', sourcePage: 1, sourcePassage: 'assignedClassIds claim configuration' }
                    ]
                  },
                  {
                    featureName: 'Attendance Governance',
                    actions: [
                      { id: 'act-ep-03', actionName: 'Approve Teacher Lock Override', effect: 'Allow', recordScope: 'Global', conditions: 'Requires justification reason review', sourcePage: 2, sourcePassage: 'Admin override review' },
                      { id: 'act-ep-04', actionName: 'Export School-Wide Audit Report', effect: 'Allow', recordScope: 'Global', conditions: 'Full system audit logs', sourcePage: 3, sourcePassage: 'Generate Global Audit Reports' }
                    ]
                  }
                ]
              },
              {
                roleName: 'Teacher',
                features: [
                  {
                    featureName: 'Daily Attendance',
                    actions: [
                      { id: 'act-ep-05', actionName: 'Submit Personal Arrival Check-in', effect: 'Allow', recordScope: 'Own', conditions: 'Once daily before cutoff', sourcePage: 2, sourcePassage: 'Teacher submits personal check-in' },
                      { id: 'act-ep-06', actionName: 'Mark Assigned Class Attendance', effect: 'Allow', recordScope: 'Class-specific', conditions: 'Only for assigned class roster', sourcePage: 2, sourcePassage: 'Mark bulk attendance' },
                      { id: 'act-ep-07', actionName: 'Edit Locked Attendance Post-11:59PM', effect: 'Deny', recordScope: 'Class-specific', conditions: 'Cutoff locked. Must submit override request.', sourcePage: 2, sourcePassage: 'Teachers CANNOT edit locked records.' },
                      { id: 'act-ep-08', actionName: 'Request Admin Override', effect: 'Require', recordScope: 'Class-specific', conditions: 'Submits justification to admin queue', sourcePage: 2, sourcePassage: 'Override Request with justification' }
                    ]
                  }
                ]
              }
            ]
          },
          uiPlayground: {
            roles: ['School Administrator', 'Teacher (Assigned: Class 10-A)'],
            activeRole: 'Teacher (Assigned: Class 10-A)',
            screens: [
              {
                id: 'scr-ep-att',
                title: 'EduPulse Classroom Attendance Console',
                roleAccess: {
                  'School Administrator': { allowed: true, recordScope: 'Global' },
                  'Teacher (Assigned: Class 10-A)': { allowed: true, recordScope: 'Class-specific' }
                },
                fields: [
                  {
                    id: 'fld-class',
                    label: 'Academic Class & Section',
                    type: 'select',
                    defaultValue: 'Class 10 - Section A',
                    options: ['Class 10 - Section A', 'Class 10 - Section B', 'Class 12 - Science'],
                    required: true,
                    readOnlyForRoles: ['Teacher (Assigned: Class 10-A)'],
                    sourceRequirement: 'Page 1: Teachers scoped strictly to assigned classes'
                  },
                  {
                    id: 'fld-date',
                    label: 'Attendance Date',
                    type: 'date',
                    defaultValue: '2026-10-30',
                    required: true,
                    sourceRequirement: 'Page 2: Daily attendance ledger'
                  },
                  {
                    id: 'fld-status-toggle',
                    label: 'Ledger Lock State',
                    type: 'text',
                    defaultValue: 'ACTIVE (Unlocked - Cutoff at 11:59 PM)',
                    readOnlyForRoles: ['Teacher (Assigned: Class 10-A)'],
                    sourceRequirement: 'Page 2: 11:59 PM daily lock'
                  }
                ],
                mockRecords: [
                  { id: 'STU-01', rollNo: '101', name: 'Aarav Sharma', status: 'Present', timeMarked: '08:15 AM' },
                  { id: 'STU-02', rollNo: '102', name: 'Diya Patel', status: 'Present', timeMarked: '08:16 AM' },
                  { id: 'STU-03', rollNo: '103', name: 'Kavya Nair', status: 'Late', timeMarked: '08:42 AM' },
                  { id: 'STU-04', rollNo: '104', name: 'Rohan Gupta', status: 'Absent', timeMarked: '-' }
                ],
                actions: [
                  { id: 'btn-save', label: 'Save Attendance Roster', variant: 'primary', requiredRole: ['School Administrator', 'Teacher (Assigned: Class 10-A)'] },
                  { id: 'btn-override-req', label: 'Request Admin Override', variant: 'secondary', requiredRole: ['Teacher (Assigned: Class 10-A)'] },
                  { id: 'btn-admin-manage', label: 'Manage School Master Records', variant: 'danger', requiredRole: ['School Administrator'], forbiddenMessage: 'Access Denied: Only School Administrators can manage master records.' }
                ]
              }
            ]
          },
          tasks: [
            {
              id: 'TSK-EP-01',
              outcome: 'JWT Authentication & Role Claims Authorization Middleware',
              discipline: 'Backend',
              prerequisites: [],
              dependencies: [],
              acceptanceChecks: ['Validates RS256 token', 'Extracts assignedClassIds', 'Denies unassigned class access with 403'],
              optimisticDays: 4,
              expectedDays: 5.5,
              pessimisticDays: 8,
              assignedRole: 'Security Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-EP-02',
              outcome: 'Bulk Student Attendance Marking Grid Component',
              discipline: 'Frontend',
              prerequisites: ['TSK-EP-01'],
              dependencies: ['TSK-EP-01'],
              acceptanceChecks: ['Renders roster for assigned class', 'Quick toggle Present/Absent/Late', 'Submits in one batch'],
              optimisticDays: 5,
              expectedDays: 7,
              pessimisticDays: 10,
              assignedRole: 'Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-EP-03',
              outcome: 'Scheduled 11:59 PM Daily Cutoff Lock Cron Service',
              discipline: 'Backend',
              prerequisites: ['TSK-EP-01'],
              dependencies: [],
              acceptanceChecks: ['Executes at 11:59 PM local timezone', 'Sets status to LOCKED', 'Rejects subsequent edits'],
              optimisticDays: 3,
              expectedDays: 4,
              pessimisticDays: 6,
              assignedRole: 'Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-EP-04',
              outcome: 'Admin Override Escalation Workflow & Approval Queue',
              discipline: 'Integration',
              prerequisites: ['TSK-EP-02', 'TSK-EP-03'],
              dependencies: ['TSK-EP-03'],
              acceptanceChecks: ['Teacher can submit override request with reason', 'Admin receives notification', 'Generates single-use edit grant'],
              optimisticDays: 5,
              expectedDays: 6.5,
              pessimisticDays: 9,
              assignedRole: 'Full-Stack Engineer',
              status: 'Approved'
            }
          ],
          forecast: {
            knownScopeHours: 320,
            engineersCount: 2,
            hoursPerDay: 7,
            bufferPercent: 15,
            optimisticWeeks: 5.0,
            expectedWeeks: 6.5,
            pessimisticWeeks: 9.0,
            knownPercent: 95,
            assumedPercent: 5,
            blockedPercent: 0,
            assumptions: [
              'School identity provider provides student and staff roster exports.',
              'Teachers will use modern browser on desktop or tablet devices.'
            ],
            blockers: []
          }
        }
      }
    ]
  },
  {
    id: 'proj-school-admin-fsd',
    name: 'School Administration and Parent Management System',
    objective: 'Provide one school management system for administrative, academic, parent-facing, transport, payment, and payroll operations.',
    clientName: 'K-12 Educational Institutions',
    domain: 'School ERP & Parent Portal',
    latestVersion: 'v1.0',
    status: 'needs_review',
    unresolvedCount: 3,
    createdAt: '2026-11-01',
    updatedAt: '2026-11-01',
    currentVersionId: 'ver-fsd-1.0',
    activeBaseline: undefined,
    versions: [
      {
        versionId: 'ver-fsd-1.0',
        fileName: 'School_Administration_FSD_v1_40e1ebbb.pdf',
        fileSizeBytes: 384000,
        uploadedAt: '01 Nov 2026',
        contentFingerprint: 'sha256-school-fsd-v1-40e1ebbb',
        pageCount: 7,
        pages: [
          {
            pageNumber: 1,
            text: `School Administration and Parent Management System
Functional Specification Document | Version 1.0 | 1 November 2026 | Draft for Review
This document defines functional behavior and access rules for Admin, Staff, and Parent users. It covers teacher and student records, attendance, question-paper approval, parent services, fees, and teacher payroll. Proposed implementation details are marked where relevant.

1. Project Overview
1.1 Purpose
Provide one school management system for administrative, academic, parent-facing, transport, payment, and payroll operations.
1.2 Objectives
• Centralize teacher, student, and attendance records.
• Enforce role-based access with school-wide and assignment-specific scopes.
• Support staff-created, admin-approved question papers.
• Provide parents with bus location, report cards, leave, holidays, fee structures, and payments.
• Let Admin manage teacher salary, payslips, salary status, and loss of pay (LOP).

2. Roles and Permissions
Role Scope
Admin School-wide teacher and student management; attendance; question-paper approval; fees; payroll.
Staff Edit authorized student records, take assigned student attendance, create and submit question papers.
Parent View only linked children and associated bus, reports, leave, holidays and fees; initiate fee payments.

Capability Matrix:
Capability                  Admin       Staff           Parent
Add / edit teachers         Yes         No              No
Add students                Yes         No              No
Edit students               All         Assigned only   No
Student attendance          All         Assigned only   View linked child
Teacher attendance          Yes         No              No
Create question paper       Proposed    Yes             No
Approve question paper      Yes         No              No
Bus / report cards / leave  Manage*     Scoped*         View linked child
Fee structure               Manage      No              View`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1680
          },
          {
            pageNumber: 2,
            text: `Capability Matrix (Continued):
Capability                  Admin       Staff           Parent
Pay school fees             No*         No              Yes
Teacher salary, LOP, payslips Yes       No              No
* Proposed capability or ownership to confirm; the core explicitly requested functions are otherwise captured.

3. Functional Requirements
3.1 Authentication and Authorization - FSD-AUTH-001
• FR-AUTH-001: Authenticate Admin, Staff, and Parent accounts.
• FR-AUTH-002: Resolve assigned roles and show permitted navigation, screens, and actions.
• FR-AUTH-003: Enforce role and record-level authorization on backend APIs, independent of frontend controls.
• FR-AUTH-004: Restrict parents to linked children and staff to assigned students.
• FR-AUTH-005: Reject unauthorized requests and audit security-sensitive operations.

3.2 Teacher Management - FSD-TCH-001
• FR-TCH-001: Admin creates teacher records.
• FR-TCH-002: Admin edits and views teacher profiles.
• FR-TCH-003: Staff and Parent cannot edit teacher employment details.
Suggested fields: Teacher ID / employee code, Name and contact, Department / subject / assigned class, Joining date / employment status, Salary information.

3.3 Student Management - FSD-STD-001
• FR-STD-001: Admin creates and edits student records school-wide.
• FR-STD-002: Staff edits permitted fields for assigned students only; Staff cannot add students.
• FR-STD-003: Parent cannot modify official student records.
• FR-STD-004: Each student may be associated with authorized parent accounts.
Suggested fields: admission number, name, birth date, class, section, roll number, academic year, parent association, enrollment status.

3.4 Student Attendance - FSD-ATT-001
• FR-ATT-001: Admin marks, views, and edits attendance for any student.
• FR-ATT-002: Staff marks and edits attendance for assigned students only.
• FR-ATT-003: Parent views linked child attendance without edit access.
• FR-ATT-004: Prevent duplicate records for student, date, and session.
• FR-ATT-005: Audit changes with actor, timestamp, and prior value.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1750
          },
          {
            pageNumber: 3,
            text: `Suggested attendance statuses: Present, Absent, Late, Leave.

3.5 Teacher Attendance - FSD-ATT-002
• FR-ATT-006: Admin views, marks, and edits teacher attendance.
• FR-ATT-007: Teacher attendance feeds authorized payroll and LOP calculations.
• FR-ATT-008: Staff cannot modify their official teacher attendance record.

4. Question Paper Management - FSD-EXAM-001
Staff creates question papers; Admin reviews submissions and approves or rejects them.
• FR-EXAM-001: Staff creates question papers with subject, class, examination, and academic year.
• FR-EXAM-002: Staff saves drafts and submits papers for approval.
• FR-EXAM-003: Admin reviews pending papers and records an approve or reject decision.
• FR-EXAM-004: Rejected papers return to Staff for revisions and resubmission.
• FR-EXAM-005: Maintain decision history and keep unapproved papers from approved release.
• FR-EXAM-006: Staff cannot approve their own papers.

State Table:
State               Allowed next actions
Draft               Staff edits or submits
Pending Approval    Admin approves or rejects
Rejected            Staff edits and resubmits
Approved            Approved material is available for authorized release
Workflow: Staff creates paper -> saves draft -> submits -> Admin reviews -> approves, or rejects with comments -> Staff revises -> resubmits.

5. Parent Portal - FSD-PAR-001
5.1 Dashboard
Show linked student and class, attendance summary, report-card availability, bus tracking, upcoming holidays, leave information, unpaid fees, and payment status.
5.2 Live Bus Tracking - FSD-BUS-001
• FR-BUS-001: Parent sees the assigned school bus on a map when valid GPS data is available.
• FR-BUS-002: Display most recent update time and stale or unavailable state.
• FR-BUS-003: Restrict location access to buses or routes associated with linked children.
External dependency: a GPS device or authorized location provider is required. Provider and refresh frequency are not yet selected.
5.3 Report Cards - FSD-RPT-001
• FR-RPT-001: Parent views only published reports for linked children.
• FR-RPT-002: Show examination, academic period, subjects, grades or marks, and student identity.
• FR-RPT-003: Hide draft and unpublished reports.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1820
          },
          {
            pageNumber: 4,
            text: `5.4 Leave Information - FSD-LVE-001
• FR-LVE-001: Parent views leave records, dates, available reasons, and status for linked children.
• FR-LVE-002: Parent cannot modify official attendance or leave through this read-only view.

5.5 School Holidays - FSD-HOL-001
• FR-HOL-001: Parent views published holidays with date, title, and academic year.
• FR-HOL-002: Present the calendar chronologically and hide unpublished entries.

6. School Fees Management - FSD-FEE-001
6.1 Fee Structure
• FR-FEE-001: Admin creates, updates, and assigns applicable fee structures.
• FR-FEE-002: Parent views linked child fee components, due amounts, and dates.
• FR-FEE-003: Audit fee-structure changes.
Proposed categories: tuition, examinations, transportation, miscellaneous.

6.2 Fee Payment
• FR-FEE-004: Parent views pending fees and initiates eligible payments.
• FR-FEE-005: Backend creates a transaction and independently verifies gateway success.
• FR-FEE-006: Verified payments update the outstanding balance and generate a receipt.
• FR-FEE-007: Show pending/failed states correctly and protect against duplicate settlement.
• FR-FEE-008: Parent views payment history and receipts.
Workflow: Parent views fee -> initiates payment -> provider processes -> backend verifies -> success updates ledger and receipt; failed/pending outcomes remain unsettled.

7. Teacher Payroll Management - FSD-PAY-001
7.1 Salary Structure
• FR-PAY-001: Admin maintains teacher salary components and monthly payroll data.
• FR-PAY-002: Admin calculates and reviews payroll under school-approved policies.
• FR-PAY-003: Record salary changes; restrict payroll data to Admin.
Suggested fields: Teacher / payroll month, Basic salary / allowances, Deductions / LOP days / LOP amount, Net salary / payment status.

7.2 Loss of Pay - FSD-LOP-001
• FR-LOP-001: Admin reviews teacher attendance for payroll month.
• FR-LOP-002: Admin records or adjusts LOP days with audit history.
• FR-LOP-003: Calculate deduction based on approved eligible salary, payroll divisor, and LOP days.
• FR-LOP-004: Require review before finalizing and authorized correction afterward.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1790
          },
          {
            pageNumber: 5,
            text: `Illustrative formula: LOP deduction = (LOP-eligible monthly salary / applicable payroll days) x LOP days. Exact policy, leave rules, and rounding require school approval.

7.3 Payslips - FSD-PSL-001
• FR-PSL-001: Admin generates payslips from finalized payroll.
• FR-PSL-002: Payslip lists teacher details, month, earnings, deductions, LOP, and net salary.
• FR-PSL-003: Admin views/downloads payslips; deny unauthorized access.

7.4 Salary Payment Status - FSD-SAL-001
Status Meaning
Draft Calculation in progress
Calculated Computation complete
Approved Authorized for payment
Payment Pending Settlement not confirmed
Paid Payment confirmed
Payment Failed Attempt unsuccessful
External bank disbursement integration is not assumed.

8. Frontend and Backend Architecture
Module              Frontend                                Backend
Auth                Login, navigation, route guards         Authentication, trusted authorization
Teacher / Student   Forms, lists, scoped UI                 CRUD, assignment checks
Attendance          Date and student attendance grid        Validation, records, audit
Question papers     Editor, submission, review              State transitions, decision authorization
Bus and reports     Map and published results               GPS data, child access filtering
Fees                Fee display, checkout, receipts         Ledger, verification, reconciliation
Payroll             Salary, LOP, payslip forms              Salary rules and private records`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1650
          },
          {
            pageNumber: 6,
            text: `8.1 Proposed API Interfaces
Method  Endpoint                        Access
POST    /api/teachers                   Admin
PATCH   /api/teachers/:id               Admin
POST    /api/students                   Admin
PATCH   /api/students/:id               Admin / scoped Staff
POST    /api/students/attendance        Admin / scoped Staff
POST    /api/teachers/attendance        Admin
POST    /api/question-papers            Staff; Admin proposed
POST    /api/question-papers/:id/submit Paper owner
POST    /api/question-papers/:id/decision Admin
GET     /api/parents/children/:id/bus   Linked Parent
GET     /api/parents/children/:id/reports Linked Parent
GET     /api/parents/children/:id/fees  Linked Parent
POST    /api/fee-payments               Linked Parent
POST    /api/payroll/calculate          Admin
PATCH   /api/payroll/:id/lop            Admin
GET     /api/payroll/:id/payslip        Admin
These endpoints are candidate contracts, not pre-existing APIs. Every handler must validate identity, role, and record ownership/assignment using trusted server-side information.

9. Data Entities
Entity group            Entities and relationships
Identity and academics  User, Role, Permission, Teacher, Student, ParentStudent, Class, Section
Attendance and exams    StudentAttendance, TeacherAttendance, QuestionPaper, QuestionPaperApproval, ReportCard
Transport and calendar  SchoolBus, Route, BusLocation, Holiday, StudentLeave
Finance and audit       FeeStructure, StudentFee, FeePayment, SalaryStructure, Payroll, PayrollAdjustment, Payslip, AuditLog

10. Nonfunctional Requirements
• NFR-001: Responsive UI for desktop, tablet, and mobile.
• NFR-002: Authentication, backend authorization, and sensitive-data protection in transit and at rest.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1690
          },
          {
            pageNumber: 7,
            text: `• NFR-003: Audit attendance edits, exam decisions, payment adjustments, and payroll changes.
• NFR-004: Consistent dates, currency, academic-year context, and actionable error states.
• NFR-005: Payment idempotency, retry handling, and reconciliation.
• NFR-006: Bus tracking displays location freshness.
• NFR-007: Define backup, recovery, retention, and performance targets before release.

11. Acceptance Criteria
ID      Scenario                            Expected
TC-001  Admin adds teacher                  Created
TC-002  Staff attempts teacher creation     Denied
TC-003  Admin edits any student             Permitted
TC-004  Staff edits assigned student        Permitted
TC-005  Staff edits unassigned student      Denied
TC-006  Staff takes assigned attendance     Saved
TC-007  Staff edits teacher attendance      Denied
TC-008  Staff submits question paper        Pending Approval
TC-009  Admin approves paper                Approved
TC-010  Admin rejects paper                 Returned for revision
TC-011  Staff approves own paper            Denied
TC-012  Parent views linked child report    Published report visible
TC-013  Parent accesses unrelated report    Denied
TC-014  Bus data stale                      Warning visible
TC-015  Verified payment succeeds           Ledger and receipt updated
TC-016  Gateway remains pending             Not marked paid
TC-017  Admin applies LOP                   Approved deduction reflected
TC-018  Parent accesses teacher payslip     Denied

Document status: Draft for stakeholder review. Confirm proposed ownership, integrations, and payroll policies before treating this as a final implementation contract.`,
            hasWarnings: false,
            warnings: [],
            characterCount: 1540
          }
        ],
        analysis: {
          purpose: {
            primaryPurpose: 'FSD or detailed requirements',
            module: 'School Administration and Parent Management System',
            currentSituation: 'Decentralized manual paper registers, uncoordinated staff question paper drafts, disconnected payment collection, and lack of parent visibility into student attendance and transport.',
            intendedWork: 'Unified role-segregated school management platform for Admin, Staff, and Parent users covering teacher/student records, attendance, question-paper approval workflows, fee payments, and teacher payroll with Loss of Pay (LOP) calculations.',
            unknowns: [
              'GPS device hardware provider and refresh frequency for live bus updates (Section 5.2).',
              'Exact school policy for LOP leave rules and payroll divisor rounding (Section 7.2).',
              'External bank disbursement integration is not assumed; confirmation of manual payroll payout mechanism (Section 7.4).'
            ],
            isUserCorrected: false,
            supportingEvidence: [
              { page: 1, passage: 'Provide one school management system for administrative, academic, parent-facing, transport, payment, and payroll operations.' },
              { page: 7, passage: 'Draft for stakeholder review. Confirm proposed ownership, integrations, and payroll policies before treating this as a final implementation contract.' }
            ]
          },
          roles: [
            {
              id: 'rol-fsd-01',
              role: 'Admin',
              relationship: 'Performer',
              action: 'Add / Edit Teachers and Staff',
              resource: 'Teacher Management Subsystem',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Requires authenticated Admin role session.',
              provenance: { page: 1, passage: 'Capability: Add / edit teachers: Admin Yes, Staff No, Parent No' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-02',
              role: 'Staff',
              relationship: 'Performer',
              action: 'Create Teacher Records',
              resource: 'Teacher Management Subsystem',
              effect: 'Deny',
              recordScope: 'Global',
              conditions: 'Staff members are strictly prohibited from adding or editing teacher employment details.',
              provenance: { page: 2, passage: 'FR-TCH-003: Staff and Parent cannot edit teacher employment details.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-03',
              role: 'Staff',
              relationship: 'Performer',
              action: 'Edit Student Records',
              resource: 'Student Management Subsystem',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Staff can edit permitted fields for assigned students only; cannot add students.',
              provenance: { page: 2, passage: 'FR-STD-002: Staff edits permitted fields for assigned students only; Staff cannot add students.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-04',
              role: 'Staff',
              relationship: 'Performer',
              action: 'Create and Submit Question Papers',
              resource: 'Question Paper Subsystem',
              effect: 'Allow',
              recordScope: 'Assigned',
              conditions: 'Staff creates question papers with subject, class, and examination, then submits for review.',
              provenance: { page: 3, passage: 'FR-EXAM-001 & 002: Staff creates question papers; saves drafts and submits papers for approval.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-05',
              role: 'Staff',
              relationship: 'Approver',
              action: 'Approve Own Question Paper',
              resource: 'Question Paper Approval Queue',
              effect: 'Deny',
              recordScope: 'Own',
              conditions: 'Staff cannot approve their own papers; requires explicit Admin review.',
              provenance: { page: 3, passage: 'FR-EXAM-006: Staff cannot approve their own papers.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-06',
              role: 'Admin',
              relationship: 'Approver',
              action: 'Approve or Reject Question Papers',
              resource: 'Question Paper Approval Queue',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Admin records approve decision or rejects with comments for revision.',
              provenance: { page: 3, passage: 'FR-EXAM-003: Admin reviews pending papers and records an approve or reject decision.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-07',
              role: 'Parent',
              relationship: 'Viewer',
              action: 'View Student Attendance & Reports',
              resource: 'Parent Portal Subsystem',
              effect: 'Allow',
              recordScope: 'Own',
              conditions: 'Strictly restricted to authorized linked children only.',
              provenance: { page: 2, passage: 'FR-AUTH-004: Restrict parents to linked children and staff to assigned students.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-08',
              role: 'Parent',
              relationship: 'Performer',
              action: 'Initiate School Fee Payments',
              resource: 'Fee Payment Subsystem',
              effect: 'Allow',
              recordScope: 'Own',
              conditions: 'Initiates eligible payments; backend independently verifies gateway success.',
              provenance: { page: 4, passage: 'FR-FEE-004 & 005: Parent views pending fees and initiates eligible payments.' },
              reviewState: 'Approved'
            },
            {
              id: 'rol-fsd-09',
              role: 'Admin',
              relationship: 'Performer',
              action: 'Manage Teacher Salary & Loss of Pay (LOP)',
              resource: 'Teacher Payroll Subsystem',
              effect: 'Allow',
              recordScope: 'Global',
              conditions: 'Restricted strictly to Admin; applies approved LOP formulas.',
              provenance: { page: 4, passage: 'FR-PAY-003: Record salary changes; restrict payroll data to Admin.' },
              reviewState: 'Approved'
            }
          ],
          facts: [
            {
              id: 'fct-fsd-01',
              type: 'numeric',
              statement: 'Loss of Pay (LOP) Deduction Formula',
              details: 'LOP deduction = (LOP-eligible monthly salary / applicable payroll days) x LOP days.',
              units: 'Currency / day divisor',
              referent: 'Teacher monthly payroll deduction calculation',
              provenance: { page: 5, passage: 'Illustrative formula: LOP deduction = (LOP-eligible monthly salary / applicable payroll days) x LOP days.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-fsd-02',
              type: 'behavior',
              statement: 'Attendance Ledger Duplicate Prevention & Immutable Audit',
              details: 'Prevent duplicate records for student, date, and session; all edits log actor, timestamp, and prior value.',
              provenance: { page: 2, passage: 'FR-ATT-004 & FR-ATT-005: Prevent duplicate records for student, date, and session. Audit changes with actor, timestamp, and prior value.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-fsd-03',
              type: 'behavior',
              statement: 'Question Paper Four-State Approval Lifecycle',
              details: 'States: Draft -> Pending Approval -> Approved / Rejected. Rejection returns paper with comments to Staff for revision.',
              provenance: { page: 3, passage: 'Workflow: Staff creates paper -> saves draft -> submits -> Admin reviews -> approves, or rejects with comments -> Staff revises -> resubmits.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-fsd-04',
              type: 'behavior',
              statement: 'Fee Payment Gateway Idempotency & Verification',
              details: 'Backend independently verifies gateway success before ledger update; duplicate settlement is prevented.',
              provenance: { page: 4, passage: 'FR-FEE-005 & FR-FEE-007: Backend independently verifies gateway success; protect against duplicate settlement.' },
              reviewState: 'Approved'
            },
            {
              id: 'fct-fsd-05',
              type: 'behavior',
              statement: 'Salary Payment State Transitions',
              details: 'Draft -> Calculated -> Approved -> Payment Pending -> Paid / Payment Failed. External bank disbursement integration is not assumed.',
              provenance: { page: 5, passage: '7.4 Salary Payment Status: Draft, Calculated, Approved, Payment Pending, Paid, Payment Failed.' },
              reviewState: 'Approved'
            }
          ],
          scope: {
            functionalAreas: [
              'Authentication & Authorization (FSD-AUTH-001)',
              'Teacher Management (FSD-TCH-001)',
              'Student Management (FSD-STD-001)',
              'Student Attendance (FSD-ATT-001)',
              'Teacher Attendance (FSD-ATT-002)',
              'Question Paper Management (FSD-EXAM-001)',
              'Parent Portal & Live Bus Tracking (FSD-PAR-001)',
              'School Fees Management (FSD-FEE-001)',
              'Teacher Payroll & LOP (FSD-PAY-001)'
            ],
            items: [
              {
                id: 'scp-fsd-01',
                functionalArea: 'Authentication & Authorization (FSD-AUTH-001)',
                title: 'Unified Role-Based Authentication & Scoped Routing',
                description: 'Authenticate Admin, Staff, and Parent accounts; enforce record-level authorization on backend APIs.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'FR-AUTH-001 to 005' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-02',
                functionalArea: 'Teacher Management (FSD-TCH-001)',
                title: 'Teacher Profile & Academic Assignment Directory',
                description: 'Admin creates and edits teacher records with employee code, department, subject, and class assignment.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'FR-TCH-001 to 003' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-03',
                functionalArea: 'Student Management (FSD-STD-001)',
                title: 'Student Roster & Parent Association Directory',
                description: 'Admin creates students school-wide; Staff edits assigned students; Parent associations managed.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'FR-STD-001 to 004' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-04',
                functionalArea: 'Student Attendance (FSD-ATT-001)',
                title: 'Daily Student Attendance Grid with Duplicate Checks',
                description: 'Admin school-wide attendance, Staff assigned attendance marking (Present/Absent/Late/Leave), and change audit.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 2, passage: 'FR-ATT-001 to 005' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-05',
                functionalArea: 'Question Paper Management (FSD-EXAM-001)',
                title: 'Question Paper Creation & Admin Approval Engine',
                description: 'Staff paper creation, draft saving, submission, Admin review/approval queue, and revision loop.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 3, passage: 'FR-EXAM-001 to 006' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-06',
                functionalArea: 'Parent Portal & Live Bus Tracking (FSD-PAR-001)',
                title: 'Parent Mobile-Responsive Dashboard & GPS Bus View',
                description: 'Show child attendance, report cards, fee status, and live bus location on map when GPS stream is active.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 3, passage: 'FR-BUS-001 to 003, FR-RPT-001 to 003' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-07',
                functionalArea: 'School Fees Management (FSD-FEE-001)',
                title: 'Fee Structure Administration & Online Payment Verification',
                description: 'Admin fee configuration, Parent payment checkout, independent gateway verification, and receipt generation.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 4, passage: 'FR-FEE-001 to 008' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-08',
                functionalArea: 'Teacher Payroll & LOP (FSD-PAY-001)',
                title: 'Salary Management, LOP Calculation & Payslip Generator',
                description: 'Admin monthly payroll calculations, attendance-linked LOP deduction formula, and payslip PDF generation.',
                workStatus: 'Proposed',
                deliveryScope: 'Included',
                provenance: { page: 4, passage: 'FR-PAY-001 to 003, FR-LOP-001 to 004, FR-PSL-001 to 003' },
                reviewState: 'Approved'
              },
              {
                id: 'scp-fsd-09',
                functionalArea: 'Teacher Payroll & LOP (FSD-PAY-001)',
                title: 'Automated External Bank Disbursement',
                description: 'Direct banking API integration for automatic wire transfer of salaries.',
                workStatus: 'Proposed',
                deliveryScope: 'Excluded',
                provenance: { page: 5, passage: 'Section 7.4: External bank disbursement integration is not assumed.' },
                reviewState: 'Approved'
              }
            ]
          },
          questions: [
            {
              id: 'clr-fsd-01',
              question: 'Which GPS tracking hardware / API provider will be integrated for live school bus location?',
              basis: 'Section 5.2 notes: "A GPS device or authorized location provider is required. Provider and refresh frequency are not yet selected."',
              impact: 'Required to implement FR-BUS-001 map component and refresh polling interval.',
              state: 'Open',
              blocking: false
            },
            {
              id: 'clr-fsd-02',
              question: 'Confirm exact school leave deduction rules and payroll day divisor for LOP calculations.',
              basis: 'Section 7.2 notes: "Illustrative formula: LOP deduction = (eligible monthly salary / applicable payroll days) x LOP days. Exact policy, leave rules, and rounding require school approval."',
              impact: 'Determines whether payroll divisor is fixed at 30 days, working days (22-26), or calendar days.',
              state: 'Open',
              blocking: false
            },
            {
              id: 'clr-fsd-03',
              question: 'Confirm proposed capability ownership: Should Admin have permission to initiate fee payments on behalf of parents?',
              basis: 'Page 2 Capability Table notes "Pay school fees: Admin No* (*Proposed capability or ownership to confirm)."',
              impact: 'Determines whether administrative cash/cheque counter-payment interface is required in Phase 1.',
              state: 'Open',
              blocking: false
            }
          ],
          baselineHistory: [],
          roleMap: {
            roles: [
              {
                roleName: 'Admin',
                features: [
                  {
                    featureName: 'Academic Governance',
                    actions: [
                      { id: 'act-fsd-01', actionName: 'Create Teacher Profile', effect: 'Allow', recordScope: 'Global', conditions: 'Admin authenticated', sourcePage: 2, sourcePassage: 'FR-TCH-001: Admin creates teacher records.' },
                      { id: 'act-fsd-02', actionName: 'Add Student Record', effect: 'Allow', recordScope: 'Global', conditions: 'Admin authenticated', sourcePage: 2, sourcePassage: 'FR-STD-001: Admin creates and edits student records school-wide.' },
                      { id: 'act-fsd-03', actionName: 'Approve Question Paper', effect: 'Allow', recordScope: 'Global', conditions: 'Reviews paper and records approve/reject', sourcePage: 3, sourcePassage: 'FR-EXAM-003: Admin reviews pending papers.' }
                    ]
                  },
                  {
                    featureName: 'Financial & Payroll Operations',
                    actions: [
                      { id: 'act-fsd-04', actionName: 'Configure Fee Structure', effect: 'Allow', recordScope: 'Global', conditions: 'Tuition, transport, miscellaneous', sourcePage: 4, sourcePassage: 'FR-FEE-001: Admin creates and updates fee structures.' },
                      { id: 'act-fsd-05', actionName: 'Calculate Payroll with LOP', effect: 'Allow', recordScope: 'Global', conditions: 'Applies LOP attendance formula', sourcePage: 4, sourcePassage: 'FR-LOP-003: Calculate deduction based on approved eligible salary and LOP days.' },
                      { id: 'act-fsd-06', actionName: 'Generate Staff Payslips', effect: 'Allow', recordScope: 'Global', conditions: 'Finalized payroll state', sourcePage: 5, sourcePassage: 'FR-PSL-001: Admin generates payslips.' }
                    ]
                  }
                ]
              },
              {
                roleName: 'Staff',
                features: [
                  {
                    featureName: 'Classroom & Examination Activity',
                    actions: [
                      { id: 'act-fsd-07', actionName: 'Mark Assigned Class Attendance', effect: 'Allow', recordScope: 'Assigned', conditions: 'Assigned class roster only', sourcePage: 2, sourcePassage: 'FR-ATT-002: Staff marks and edits attendance for assigned students only.' },
                      { id: 'act-fsd-08', actionName: 'Draft & Submit Question Paper', effect: 'Allow', recordScope: 'Assigned', conditions: 'Creates paper and submits to Admin queue', sourcePage: 3, sourcePassage: 'FR-EXAM-002: Staff saves drafts and submits papers for approval.' },
                      { id: 'act-fsd-09', actionName: 'Approve Own Question Paper', effect: 'Deny', recordScope: 'Own', conditions: 'Self-approval strictly prohibited', sourcePage: 3, sourcePassage: 'FR-EXAM-006: Staff cannot approve their own papers.' }
                    ]
                  }
                ]
              },
              {
                roleName: 'Parent',
                features: [
                  {
                    featureName: 'Parent Portal Services',
                    actions: [
                      { id: 'act-fsd-10', actionName: 'View Linked Child Attendance', effect: 'Allow', recordScope: 'Own', conditions: 'Read-only view for linked children', sourcePage: 2, sourcePassage: 'FR-ATT-003: Parent views linked child attendance without edit access.' },
                      { id: 'act-fsd-11', actionName: 'Track School Bus GPS Location', effect: 'Allow', recordScope: 'Own', conditions: 'Restricted to bus route of linked children', sourcePage: 3, sourcePassage: 'FR-BUS-001: Parent sees assigned school bus on map.' },
                      { id: 'act-fsd-12', actionName: 'Pay School Fees Online', effect: 'Allow', recordScope: 'Own', conditions: 'Initiates payment via verified gateway', sourcePage: 4, sourcePassage: 'FR-FEE-004: Parent views pending fees and initiates payments.' }
                    ]
                  }
                ]
              }
            ]
          },
          uiPlayground: {
            roles: ['Admin (School-wide)', 'Staff (Class 10-A)', 'Parent (Child: Aarav Sharma)'],
            activeRole: 'Staff (Class 10-A)',
            screens: [
              {
                id: 'scr-fsd-core',
                title: 'School Administration & Operations Console',
                roleAccess: {
                  'Admin (School-wide)': { allowed: true, recordScope: 'Global' },
                  'Staff (Class 10-A)': { allowed: true, recordScope: 'Assigned' },
                  'Parent (Child: Aarav Sharma)': { allowed: true, recordScope: 'Own' }
                },
                fields: [
                  {
                    id: 'fld-fsd-module',
                    label: 'Functional Module',
                    type: 'select',
                    defaultValue: 'Question Paper Approval',
                    options: ['Question Paper Approval', 'Student Attendance Ledger', 'School Fee Payment', 'Teacher Payroll & LOP'],
                    required: true,
                    sourceRequirement: 'Section 4, 6, 7: Core operational modules'
                  },
                  {
                    id: 'fld-fsd-scope',
                    label: 'Class / Student Scope Filter',
                    type: 'select',
                    defaultValue: 'Class 10 - Section A',
                    options: ['Class 10 - Section A', 'Class 10 - Section B', 'All School Classes (Admin Only)'],
                    readOnlyForRoles: ['Staff (Class 10-A)', 'Parent (Child: Aarav Sharma)'],
                    sourceRequirement: 'Page 2, FR-AUTH-004: Scope restriction'
                  },
                  {
                    id: 'fld-fsd-status',
                    label: 'Lifecycle Workflow State',
                    type: 'text',
                    defaultValue: 'Pending Approval (Submitted by Staff)',
                    readOnlyForRoles: ['Staff (Class 10-A)', 'Parent (Child: Aarav Sharma)'],
                    sourceRequirement: 'Page 3: Question paper state machine'
                  }
                ],
                mockRecords: [
                  { id: 'QP-2026-01', subject: 'Mathematics', class: 'Class 10-A', exam: 'Mid-Term 2026', author: 'Staff (P. Kasinathan)', state: 'Pending Approval' },
                  { id: 'QP-2026-02', subject: 'Physics', class: 'Class 10-A', exam: 'Mid-Term 2026', author: 'Staff (A. Sharma)', state: 'Approved' },
                  { id: 'FEE-2026-88', student: 'Aarav Sharma', class: 'Class 10-A', component: 'Tuition Q3', amount: '$450.00', state: 'Unpaid' },
                  { id: 'PAY-2026-11', employee: 'P. Kasinathan', basic: '$4,200', lopDays: '1 Day ($140 deduction)', netSalary: '$4,060', state: 'Approved' }
                ],
                actions: [
                  { id: 'btn-submit-paper', label: 'Submit Question Paper', variant: 'primary', requiredRole: ['Staff (Class 10-A)', 'Admin (School-wide)'] },
                  { id: 'btn-approve-paper', label: 'Approve Question Paper', variant: 'primary', requiredRole: ['Admin (School-wide)'], forbiddenMessage: 'TC-011: Staff cannot approve their own papers. Admin authorization required.' },
                  { id: 'btn-pay-fee', label: 'Pay Fee Online', variant: 'secondary', requiredRole: ['Parent (Child: Aarav Sharma)'] }
                ]
              }
            ]
          },
          tasks: [
            {
              id: 'TSK-FSD-01',
              outcome: 'Role-Based Authentication & Independent Backend API Authorization',
              discipline: 'Backend',
              prerequisites: [],
              dependencies: [],
              acceptanceChecks: ['TC-001: Admin adds teacher -> Created', 'TC-002: Staff attempts teacher creation -> Denied (403)', 'TC-013: Parent accesses unrelated child -> Denied'],
              optimisticDays: 5,
              expectedDays: 6.5,
              pessimisticDays: 9,
              assignedRole: 'Security / Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-02',
              outcome: 'Teacher and Student Roster Management Subsystem',
              discipline: 'Frontend',
              prerequisites: ['TSK-FSD-01'],
              dependencies: ['TSK-FSD-01'],
              acceptanceChecks: ['TC-003: Admin edits any student -> Permitted', 'TC-004: Staff edits assigned student -> Permitted', 'TC-005: Staff edits unassigned student -> Denied'],
              optimisticDays: 4.5,
              expectedDays: 6,
              pessimisticDays: 8.5,
              assignedRole: 'Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-03',
              outcome: 'Attendance Ledger with Duplicate Prevention & Audit Logging',
              discipline: 'Backend',
              prerequisites: ['TSK-FSD-01'],
              dependencies: ['TSK-FSD-01'],
              acceptanceChecks: ['TC-006: Staff takes assigned attendance -> Saved', 'TC-007: Staff edits teacher attendance -> Denied', 'Prevents duplicate student/date/session records'],
              optimisticDays: 4,
              expectedDays: 5.5,
              pessimisticDays: 8,
              assignedRole: 'Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-04',
              outcome: 'Question Paper Four-State Review & Approval Workflow Engine',
              discipline: 'Integration',
              prerequisites: ['TSK-FSD-01'],
              dependencies: ['TSK-FSD-01'],
              acceptanceChecks: ['TC-008: Staff submits question paper -> Pending Approval', 'TC-009: Admin approves paper -> Approved', 'TC-010: Admin rejects paper -> Returned for revision', 'TC-011: Staff approves own paper -> Denied'],
              optimisticDays: 5,
              expectedDays: 7,
              pessimisticDays: 10,
              assignedRole: 'Full-Stack Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-05',
              outcome: 'Parent Portal & Live GPS Bus Tracking Component',
              discipline: 'Frontend',
              prerequisites: ['TSK-FSD-01'],
              dependencies: ['TSK-FSD-01'],
              acceptanceChecks: ['TC-012: Parent views linked child report -> Published report visible', 'TC-014: Bus data stale -> Warning visible', 'Restricts bus map strictly to linked child routes'],
              optimisticDays: 6,
              expectedDays: 8,
              pessimisticDays: 11.5,
              assignedRole: 'Senior Frontend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-06',
              outcome: 'Fee Payment Gateway Verification & Ledger Settlement Engine',
              discipline: 'Integration',
              prerequisites: ['TSK-FSD-01'],
              dependencies: ['TSK-FSD-01'],
              acceptanceChecks: ['TC-015: Verified payment succeeds -> Ledger and receipt updated', 'TC-016: Gateway remains pending -> Not marked paid', 'Protects against duplicate settlement'],
              optimisticDays: 5.5,
              expectedDays: 7.5,
              pessimisticDays: 11,
              assignedRole: 'FinTech / Backend Engineer',
              status: 'Approved'
            },
            {
              id: 'TSK-FSD-07',
              outcome: 'Teacher Monthly Payroll & Loss of Pay (LOP) Formula Engine',
              discipline: 'Backend',
              prerequisites: ['TSK-FSD-03'],
              dependencies: ['TSK-FSD-03'],
              acceptanceChecks: ['TC-017: Admin applies LOP -> Approved deduction reflected', 'TC-018: Parent accesses teacher payslip -> Denied', 'Computes LOP deduction = (salary / days) * LOP days'],
              optimisticDays: 5,
              expectedDays: 6.5,
              pessimisticDays: 9.5,
              assignedRole: 'Backend Engineer',
              status: 'Approved'
            }
          ],
          forecast: {
            knownScopeHours: 440,
            engineersCount: 3,
            hoursPerDay: 7,
            bufferPercent: 15,
            optimisticWeeks: 6.0,
            expectedWeeks: 7.8,
            pessimisticWeeks: 10.5,
            knownPercent: 92,
            assumedPercent: 8,
            blockedPercent: 0,
            assumptions: [
              'School management provides teacher and student roster master list in CSV/Excel.',
              'Payment gateway webhook delivery supports HMAC-SHA256 signature verification.',
              'GPS location provider delivers JSON lat/long stream with timestamp freshness header.'
            ],
            blockers: []
          }
        }
      }
    ]
  }
];

