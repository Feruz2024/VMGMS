# Project Update Log

This log tracks all major updates, pushes, and accomplishments for the VMGMS project, including which machine performed the push, the date/time, and categorized tasks (Frontend/Backend/Features).

---

## [2025-06-08, Office]
**Push by:** Office Machine
**Time:** [Please fill in actual push time]

### Frontend
- Work Order table: Added row selection, master delete, and search functionality.
- Added inline Edit and Delete buttons for each work order row (always enabled).
- Added Work Order ID column to the table.
- Added selector to show/hide cancelled (soft-deleted) work orders.
- Cancelled work orders are hidden by default, but can be shown via selector.
- Edit popup now always sends required fields (customer, vehicle, customer_complaint) to backend.
- Fixed all validation errors for editing and saving work orders.

### Backend
- WorkOrderViewSet: Soft delete implemented (status set to 'Cancelled' on delete).
- Cancelled work orders are retained in the database for audit/history.

### Features
- Multi-row selection and master delete for work orders.
- Search/filter for work orders by customer, vehicle, status, or technician.
- Soft delete (cancel) with UI filtering and selector for cancelled work orders.
- Edit popup for work orders with validation fixes.

---

**Instructions:**
- When pushing from a different machine, add a new dated entry with the machine name, time, and categorized accomplishments.
- Keep this log up to date for all major pushes and merges.
