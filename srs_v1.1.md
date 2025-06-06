

## **Software Requirements Specification (SRS) \- Vehicle Maintenance Garage Management System (VMGMS)**

**Version:** 1.2 (Compiled Final)  
**Date:** 02/05/2025  
**Changes from v1.1:** Final compilation including User Stories within functional requirements sections.

**Table of Contents:**

1. Introduction  
   1.1 Purpose  
   1.2 Scope  
   1.3 Definitions, Acronyms, and Abbreviations  
   1.4 References  
   1.5 Overview  
2. Overall Description  
   2.1 Product Perspective  
   2.2 Product Functions (Summary)  
   2.3 User Characteristics  
   2.4 Constraints  
   2.5 Assumptions and Dependencies  
3. Specific Requirements  
   3.1 Functional Requirements  
   3.1.1 Customer Management (FR-CUST)  
   3.1.2 Vehicle Management (FR-VEH)  
   3.1.3 Appointment Scheduling (FR-APP)  
   3.1.4 Work Order Management (FR-WO)  
   3.1.5 Service & Labor Catalog (FR-SVC)  
   3.1.6 Parts Inventory Management (FR-INV)  
   3.1.7 Invoicing & Billing (FR-BILL)  
   3.1.8 User Management & Permissions (FR-USER)  
   3.1.9 Basic Reporting (FR-RPT)  
   3.2 Non-Functional Requirements  
   3.2.1 Performance  
   3.2.2 Security  
   3.2.3 Usability  
   3.2.4 Reliability  
   3.2.5 Maintainability  
   3.2.6 Testability  
   3.3 Interface Requirements  
   3.3.1 User Interfaces (UI)  
   3.3.2 Hardware Interfaces  
   3.3.3 Software Interfaces  
   3.4 Data Requirements  
4. Appendices (Optional)

---

**1\. Introduction**

* **1.1 Purpose:** This document specifies the requirements for the Vehicle Maintenance Garage Management System (VMGMS). It aims to provide a clear, detailed, and unambiguous understanding of the system's functionalities and constraints for stakeholders, AI and human developers, designers, and testers.  
* **1.2 Scope:** The VMGMS will manage core operations for a medium-sized vehicle maintenance garage, including customer and vehicle tracking, appointment scheduling, work order processing, basic parts inventory, invoicing, user roles, and essential reporting. Features explicitly excluded are advanced accounting integration, payroll, online customer portal, advanced VIN decoding services (beyond basic structure validation), and automated SMS/complex email notifications for this version.  
* **1.3 Definitions, Acronyms, and Abbreviations:**  
  * VMGMS: Vehicle Maintenance Garage Management System  
  * WO: Work Order  
  * VIN: Vehicle Identification Number  
  * UI: User Interface  
  * API: Application Programming Interface  
  * CRUD: Create, Read, Update, Delete  
  * DRF: Django REST Framework  
  * JWT: JSON Web Token  
  * MUI: Material UI (React Component Library)  
  * QoH: Quantity on Hand  
  * Admin: System Administrator role  
  * SA: Service Advisor role  
  * Tech: Technician role  
*   
* **1.4 References:**  
  * HLD VMGMS v1.1 (hld\_v1.1.md)  
  * Best Practices Policy VMGMS v1.0 (best\_practices\_policy.md)  
  * Knowledge Base & User Tutorial VMGMS v1.0 (kb\_tutorial.md)  
  * Development Plan VMGMS v1.0 (dev\_plan\_v1.0.md)  
*   
* **1.5 Overview:** This document details the functional and non-functional requirements. Section 2 provides a high-level overview. Section 3 contains the detailed specific requirements, broken down to a level suitable for implementation by an AI development agent, emphasizing clarity, explicit definition of inputs, processes, outputs, and including user stories for context. Section 3 also covers non-functional, interface, and data aspects.

**2\. Overall Description**

* **2.1 Product Perspective:** The VMGMS will be a self-contained web application. The frontend (React) interacts with the backend (Django) via a RESTful API. It replaces manual or spreadsheet-based garage management methods. Future integrations (e.g., accounting software) may be considered in later versions but are out of scope for v1.  
* **2.2 Product Functions (Summary):**  
  * Manage customer and vehicle records with service history tracking.  
  * Schedule service appointments via a calendar interface.  
  * Create, track, and manage work orders through their lifecycle, including adding parts and labor line items.  
  * Maintain a catalog of standard services and labor rates.  
  * Manage basic parts inventory (catalog, stock levels, adjustments) and link parts to work orders, automatically decrementing stock upon invoicing.  
  * Generate invoices from completed work orders and record payments.  
  * Control system access through distinct user roles (Admin, SA, Tech) and permissions.  
  * Provide basic operational reports (Sales, WO Status, Inventory).  
*   
* **2.3 User Characteristics:** The primary users will be:  
  * **Administrators (Admin):** Full system access, user management, configuration (services, parts, tax rate). Assumed to have basic computer literacy and understanding of garage operations.  
  * **Service Advisors (SA):** Handle customer interactions, scheduling, work order creation/management, invoicing. Assumed proficient with typical office software and web applications.  
  * **Technicians (Tech):** View assigned work orders, log notes, update work order status. May have varying levels of computer literacy but must be able to interact with basic web forms and lists.  
*   
* **2.4 Constraints:**  
  * **Technology:** Backend: Python 3.x/Django 4.x+; Frontend: JavaScript/React 18+/Material UI/Context API; Database: PostgreSQL 16\.  
  * **Development Process:** Primarily developed by an AI agent using VS Code Insiders with MCP support. Requirements must be explicit and unambiguous. Adherence to @file:best\_practices\_policy.md is mandatory.  
  * **Deployment Environment:** Initial deployment target is a local Windows machine (suitable for testing/demo only).  
  * **Budget/Schedule:** \[Specify if applicable\].  
  * **Regulatory:** Compliance with local data privacy regulations regarding customer data storage and handling is required.  
*   
* **2.5 Assumptions and Dependencies:**  
  * Users will have access to compatible Windows PCs with modern web browsers (Chrome, Firefox, Edge) installed.  
  * Users will be provided with login credentials and basic instructions (referencing @file:kb\_tutorial.md).  
  * Accurate data entry (customer details, part numbers, quantities) is the responsibility of the users.  
  * A stable network connection between the frontend browser and the locally hosted backend server is required.  
  * The PostgreSQL database server is running and accessible to the Django backend.  
  * The development environment (VS Code, AI agent, Python, Node, Git, PSQL) is correctly set up as per prerequisites in @file:dev\_plan\_v1.0.md.  
* 

**3\. Specific Requirements**

* **3.1 Functional Requirements:**  
  * **3.1.1 Customer Management (FR-CUST)**  
    * **User Stories:**  
      * As a Service Advisor, I want to quickly find a customer by phone number when they call, so that I can access their records efficiently.  
      * As a Service Advisor, I want to add a new customer's details accurately, so that we have correct contact information and service history linkage.  
      * As a Service Advisor, I want to view a customer's past service history easily from their record, so that I can understand their vehicle's maintenance background.  
    *   
    * **Detailed Requirements:**  
      * **FR-CUST-100: Create Customer Functionality**  
        * FR-CUST-101: The system UI shall provide a button/link labeled "Add New Customer" accessible only to Admin/SA roles, typically located on the Customer List view.  
        * FR-CUST-102: Clicking "Add New Customer" shall navigate the user to a dedicated "Create Customer" form/modal view.  
        * FR-CUST-103: The "Create Customer" form shall display the following input fields using appropriate MUI components:  
          * Name (Text Input, Max Length: 100 chars, **Required**)  
          * Address (Text Area Input, Max Length: 500 chars, Optional)  
          * Primary Phone (Text Input, Max Length: 20 chars, **Required**)  
          * Secondary Phone (Text Input, Max Length: 20 chars, Optional)  
          * Email (Text Input, Type: email, Max Length: 254 chars, **Required**)  
        *   
        * FR-CUST-104: The form shall include a "Save Customer" button and a "Cancel" button.  
        * FR-CUST-105: Input Validation (Client-side using React state/form libraries and Server-side via DRF Serializer):  
          * Name: Must not be empty.  
          * Primary Phone: Must not be empty. Basic format check allowing digits, spaces, ()-+.  
          * Email: Must not be empty. Must adhere to standard email format (e.g., user@domain.com). Uniqueness (case-insensitive) must be enforced server-side against existing Customer.email fields.  
        *   
        * FR-CUST-106: Clicking "Save Customer":  
          * IF client-side validation passes: Send customer data via API call (POST /api/customers/) to the backend. Backend performs server-side validation. IF server validation passes: Backend saves data to Customers table. Frontend displays success message (e.g., "Customer '\[Name\]' created successfully.") and typically navigates to the Customer List view or closes the modal.  
          * IF client-side or server-side validation fails: Display clear, field-specific error messages next to the invalid fields (e.g., "Email format is invalid", "Name is required", "Email already exists"). Retain user-entered data in the form. Do not save data.  
        *   
        * FR-CUST-107: Clicking "Cancel" shall discard all entered data in the form and navigate the user back to the previous view (e.g., Customer List) or close the modal without saving.  
      *   
      * **FR-CUST-200: View/Search Customer Functionality**  
        * FR-CUST-201: The system shall display a "Customer List" view/page accessible to Admin/SA roles.  
        * FR-CUST-202: The Customer List view shall display customers in a table format (e.g., MUI DataGrid) with columns: Name, Primary Phone, Email. The table should support sorting by columns.  
        * FR-CUST-203: The Customer List view shall include a search input field. Typing in the search field shall filter the displayed list based on partial matches (case-insensitive) in the Name, Phone, or Email fields. Filtering should occur client-side (if dataset is small) or server-side via API parameter (e.g., GET /api/customers/?search=...). The backend API must support this search parameter. Pagination must be implemented for large datasets (e.g., 10-25 customers per page).  
        * FR-CUST-204: Each row in the Customer List table shall be clickable (or have a dedicated 'View' button) to navigate the user to the "Customer Detail" view for that specific customer, passing the customer ID.  
      *   
      * **FR-CUST-300: View/Edit Customer Detail Functionality**  
        * FR-CUST-301: The "Customer Detail" view (accessible via FR-CUST-204) shall display all customer information (Name, Address, Phones, Email).  
        * FR-CUST-302: This view shall provide an "Edit" button accessible only to Admin/SA roles.  
        * FR-CUST-303: Clicking "Edit" shall make the customer fields editable within the same view or navigate to a separate "Edit Customer" form, pre-filled with existing data. Validation rules from FR-CUST-105 apply.  
        * FR-CUST-304: A "Save Changes" button shall trigger an API call (PUT or PATCH /api/customers/{id}/) to update the customer record in the backend. Upon success, display a success message and return to the read-only detail view. Handle validation errors as in FR-CUST-106.  
        * FR-CUST-305: A "Cancel" button during editing shall discard changes and return to the read-only detail view.  
        * FR-CUST-306: The Customer Detail view shall display a list/table summarizing vehicles associated with this customer (License Plate, Make, Model, Year). Clicking an item should navigate to the Vehicle Detail view (FR-VEH-300). An "Add Vehicle" button should be present here (See FR-VEH-101).  
        * FR-CUST-307: The Customer Detail view shall display a list/table summarizing the service history (Work Orders/Invoices) for this customer (Date, WO\#, Service Summary, Status, Total). Clicking an item should navigate to the corresponding Work Order or Invoice detail view.  
      *   
      * **FR-CUST-400: Deactivate Customer Functionality**  
        * FR-CUST-401: The Customer Detail view (or Edit view) shall provide a "Deactivate" button accessible only to Admin roles.  
        * FR-CUST-402: Clicking "Deactivate" shall prompt the user for confirmation (e.g., "Are you sure you want to deactivate this customer? They will be hidden from active lists but their records will be retained.").  
        * FR-CUST-403: Upon confirmation, the system shall make an API call (DELETE /api/customers/{id}/ or PATCH /api/customers/{id}/ with is\_active=false). The backend should set an is\_active flag on the customer record to false (soft delete). Physically deleting customers with associated vehicles or work orders is prohibited.  
        * FR-CUST-404: Deactivated customers shall not appear in the default Customer List view (FR-CUST-202) or in dropdowns for selecting customers, but their records must be retained in the database. An Admin view to see/reactivate customers might be added later if needed (optional).  
      *   
    *   
  *   
  * **3.1.2 Vehicle Management (FR-VEH)**  
    * **User Stories:**  
      * As a Service Advisor, I want to associate multiple vehicles with a single customer, so that I can manage all their cars under one account.  
      * As a Service Advisor, I want to record specific vehicle details like VIN and engine size, so that technicians have accurate information for ordering parts and performing repairs.  
      * As an Administrator, I want to ensure VIN numbers are unique in the system, so that we avoid duplicate vehicle records.  
    *   
    * **Detailed Requirements:**  
      * **FR-VEH-100: Add Vehicle Functionality**  
        * FR-VEH-101: The system shall provide an "Add Vehicle" button on the Customer Detail view (FR-CUST-306), accessible to Admin/SA roles.  
        * FR-VEH-102: Clicking "Add Vehicle" opens a form/modal to input vehicle details. The associated Customer should be pre-selected/linked.  
        * FR-VEH-103: The form shall include fields: Make (Text, Required), Model (Text, Required), Year (Number, 4 digits, Required), VIN (Text, 17 chars, Required, Basic format check \[alphanumeric\]), License Plate (Text, Required), Color (Text, Optional), Engine Size (Text, Optional), Notes (Text Area, Optional).  
        * FR-VEH-104: Input Validation (Client & Server): Required fields non-empty. Year format. VIN length/basic format (detailed external VIN decoding is out of scope). VIN and License Plate uniqueness enforced server-side.  
        * FR-VEH-105: "Save Vehicle" button triggers API call (POST /api/vehicles/ or nested under customer /api/customers/{id}/vehicles/). Backend saves vehicle linked to the customer. Handle success/errors as in FR-CUST-106.  
        * FR-VEH-106: "Cancel" button discards input and closes form/modal.  
      *   
      * **FR-VEH-200: View Vehicle List/Search**  
        * FR-VEH-201: Vehicles associated with a customer shall be listed on the Customer Detail view (FR-CUST-306).  
        * FR-VEH-202: An optional dedicated "Vehicle Search" page accessible to Admin/SA might exist, allowing search by License Plate or VIN across all customers. API (GET /api/vehicles/?search=...) must support this.  
      *   
      * **FR-VEH-300: View/Edit Vehicle Detail Functionality**  
        * FR-VEH-301: Clicking a vehicle in a list navigates to the "Vehicle Detail" view, displaying all stored details.  
        * FR-VEH-302: An "Edit" button (Admin/SA only) allows modification of vehicle details (similar flow to FR-CUST-303 to FR-CUST-305), triggering PUT/PATCH /api/vehicles/{id}/.  
        * FR-VEH-303: The Vehicle Detail view shall display a summary list of service history (Work Orders/Invoices) specifically for this vehicle. Clicking an item navigates to the WO/Invoice detail.  
      *   
      * **FR-VEH-400: Delete/Deactivate Vehicle Functionality**  
        * FR-VEH-401: Similar to customer deactivation (FR-CUST-400), provide a "Deactivate" (or potentially "Delete" if no history exists) option for vehicles, accessible to Admins.  
        * FR-VEH-402: Deactivation via API (DELETE /api/vehicles/{id}/ or PATCH) should set an is\_active flag. Physical deletion prohibited if linked WOs/Invoices exist. Deactivated vehicles hidden from selection lists.  
      *   
    *   
  *   
  * **3.1.3 Appointment Scheduling (FR-APP)**  
    * **User Stories:**  
      * As a Service Advisor, I want to view the shop's schedule on a calendar, so that I can see availability and book new appointments efficiently.  
      * As a Service Advisor, I want to link an appointment directly to a customer and their specific vehicle, so that everyone knows who is coming and for which car.  
      * As a Technician, I want to easily see which appointments/jobs are assigned to me for the day, so that I can plan my work.  
    *   
    * **Detailed Requirements:**  
      * **FR-APP-100: View Calendar Functionality**  
        * FR-APP-101: The system shall provide a "Scheduler" or "Calendar" view accessible to Admin/SA/Tech roles.  
        * FR-APP-102: The calendar shall support Day, Week, and Month views using a standard React calendar component compatible with MUI (e.g., FullCalendar with adapters, or built with MUI components).  
        * FR-APP-103: Existing appointments shall be fetched via API (GET /api/appointments/?start\_date=...\&end\_date=...) for the displayed date range and rendered as blocks on the calendar, showing key info (Customer Name, Time, Service Reason).  
        * FR-APP-104: Visual indication of technician assignment/status on the calendar event block is desirable (e.g., color-coding).  
      *   
      * **FR-APP-200: Create Appointment Functionality**  
        * FR-APP-201: Allow creating appointments by clicking a time slot on the calendar or an "Add Appointment" button (Admin/SA only).  
        * FR-APP-202: An appointment form/modal appears, requiring:  
          * Customer selection (Searchable Dropdown/Autocomplete linked to GET /api/customers/).  
          * Vehicle selection (Dropdown filtered by selected customer, linked to GET /api/customers/{id}/vehicles/ or similar).  
          * Date & Time (pre-filled from calendar click or Date/Time pickers).  
          * Reason/Service Request (Text Area, Required).  
          * Assign Technician (Dropdown of users with 'Tech' role, Optional).  
        *   
        * FR-APP-203: Initial appointment status shall be set to 'Booked'.  
        * FR-APP-204: "Save Appointment" button triggers API call (POST /api/appointments/). Handle success/errors as in FR-CUST-106. Saved appointment appears on the calendar.  
      *   
      * **FR-APP-300: View/Update Appointment Functionality**  
        * FR-APP-301: Clicking an existing appointment block on the calendar shall open a detail view/modal displaying all appointment information.  
        * FR-APP-302: Allow updating appointment details (Customer, Vehicle, Reason, Technician, Time) via an "Edit" button/flow (Admin/SA only).  
        * FR-APP-303: Provide controls (e.g., a Status dropdown) to update the appointment status (Admin/SA only). Statuses must include: Booked, Confirmed, Arrived, Completed, Cancelled, No-Show.  
        * FR-APP-304: Saving changes to status or details triggers an API call (PUT or PATCH /api/appointments/{id}/).  
      *   
      * **FR-APP-400: Basic Availability Check**  
        * FR-APP-401: The calendar views (Day/Week) should provide a basic visual cue regarding shop load (e.g., simple count of appointments per day/technician displayed, or subtle background color change based on threshold). Logic based on counts from GET /api/appointments/.  
      *   
    *   
  *   
  * **3.1.4 Work Order Management (FR-WO)**  
    * **User Stories:**  
      * As a Service Advisor, I want to create a detailed work order based on a customer's request or appointment, so that the technician knows exactly what needs to be done.  
      * As a Technician, I want to add labor and parts used directly to the work order, so that billing is accurate.  
      * As a Technician, I want to log my diagnostic notes and work performed on the work order, so that there is a record of the repair process.  
      * As a Service Advisor, I want to track the status of a work order (e.g., 'In Progress', 'Waiting for Parts'), so that I can inform the customer about the progress.  
    *   
    * **Detailed Requirements:**  
      * **FR-WO-100: Create Work Order Functionality**  
        * FR-WO-101: Provide a button "Create Work Order" on the Appointment detail view (FR-APP-301) (Admin/SA only). This should pre-fill Customer, Vehicle, and Reason from the appointment.  
        * FR-WO-102: Provide a standalone "Add New Work Order" button in the "Work Orders" section (Admin/SA only), requiring manual selection of Customer and Vehicle.  
        * FR-WO-103: The Work Order creation view requires: Customer, Vehicle, Customer Complaint/Request (Text Area). Initial status set to 'New'.  
        * FR-WO-104: Saving triggers API call (POST /api/workorders/). Upon success, navigate to the newly created Work Order Detail view.  
      *   
      * **FR-WO-200: View Work Order List/Search**  
        * FR-WO-201: Provide a "Work Orders" list view displaying WOs in a table (MUI DataGrid) with columns: WO\#, Date Created, Customer, Vehicle (Make/Model/Plate), Status, Technician, Total (calculated). Allow sorting.  
        * FR-WO-202: Implement filtering by Status (Dropdown), Technician (Dropdown), Customer (Search/Select), Date Range. Backend API (GET /api/workorders/?status=...\&technician\_id=...\&customer\_id=...\&date\_after=...\&date\_before=...) must support these filters. Implement pagination.  
        * FR-WO-203: Clicking a WO row navigates to the Work Order Detail view.  
      *   
      * **FR-WO-300: View Work Order Detail Functionality**  
        * FR-WO-301: The Work Order Detail view shall display all WO information: WO\#, Customer, Vehicle, Status, Assigned Technician, Customer Complaint.  
        * FR-WO-302: A section shall display Line Items (Labor and Parts) associated with the WO in a table format (Description, Type, Quantity/Hours, Unit Price, Line Total).  
        * FR-WO-303: A section shall display Technician Notes (read-only for SA/Admin, editable for Techs \- see FR-WO-700).  
        * FR-WO-304: Display calculated sub-totals for Labor and Parts, Tax amount, and Grand Total based on added line items and configured tax rate. API (GET /api/workorders/{id}/) should return calculated totals or frontend calculates them.  
      *   
      * **FR-WO-400: Add/Edit Labor Line Item Functionality**  
        * FR-WO-401: On the WO Detail view, provide an "Add Labor" button (Admin/SA only).  
        * FR-WO-402: Form/modal appears allowing:  
          * Selection from Service Catalog (FR-SVC) via searchable dropdown (API GET /api/services/). Selecting fills Description, Hours, Rate.  
          * OR entry of Custom Labor: Description (Text, Required), Billed Hours (Number, Required), Rate (Number, Required).  
        *   
        * FR-WO-403: Save triggers API call (POST /api/workorders/{id}/items/ with item\_type='LABOR'). Backend creates WorkOrderItem record. Line item appears in the WO detail list.  
        * FR-WO-404: Allow editing/deleting existing labor line items (Admin/SA only) via API (PUT/PATCH/DELETE /api/workorders/{wo\_id}/items/{item\_id}/).  
      *   
      * **FR-WO-500: Add/Edit Part Line Item Functionality**  
        * FR-WO-501: On the WO Detail view, provide an "Add Part" button (Admin/SA only).  
        * FR-WO-502: Form/modal appears allowing:  
          * Selection from Parts Catalog (FR-INV) via searchable dropdown (Part Number/Description) (API GET /api/parts/?search=...). Selecting fills Description, Unit Price. Requires Quantity input. Optionally show QoH.  
          * OR entry of Custom Part: Description (Text, Required), Quantity (Number, Required), Unit Price (Number, Required).  
        *   
        * FR-WO-503: Save triggers API call (POST /api/workorders/{id}/items/ with item\_type='PART'). Backend creates WorkOrderItem record. Line item appears in the WO detail list.  
        * FR-WO-504: Allow editing/deleting existing part line items (Admin/SA only) via API (PUT/PATCH/DELETE /api/workorders/{wo\_id}/items/{item\_id}/).  
      *   
      * **FR-WO-600: Assign/Change Technician Functionality**  
        * FR-WO-601: On the WO Detail view, display the currently assigned technician (if any).  
        * FR-WO-602: Provide a dropdown list of users with the 'Tech' role to assign or change the technician (Admin/SA only).  
        * FR-WO-603: Selecting a technician triggers an API call (PATCH /api/workorders/{id}/ with technician\_id=...).  
      *   
      * **FR-WO-700: Update Work Order Status Functionality**  
        * FR-WO-701: On the WO Detail view, display the current status.  
        * FR-WO-702: Provide a dropdown list to change the status (Admin/SA/Tech roles, though Techs might have restricted options, e.g., cannot set to 'Invoiced'). Statuses must include: New, Diagnosis, Waiting Approval, Waiting Parts, In Progress, Ready for Pickup, Completed, Invoiced, Cancelled.  
        * FR-WO-703: Selecting a new status triggers an API call (PATCH /api/workorders/{id}/ with status=...). Backend logic may trigger other actions based on status change (e.g., inventory decrement on 'Invoiced').  
      *   
      * **FR-WO-800: Log Technician Notes Functionality**  
        * FR-WO-801: On the WO Detail view, provide a text area labeled "Technician Notes".  
        * FR-WO-802: Technicians assigned to the WO shall be able to add/edit text in this area. SA/Admin view is read-only.  
        * FR-WO-803: A "Save Notes" button triggers an API call (PATCH /api/workorders/{id}/ with technician\_notes=...). Notes should ideally be timestamped or appended if multiple entries are needed (define behavior \- simple overwrite or append log).  
      *   
    *   
  *   
  * **3.1.5 Service & Labor Catalog (FR-SVC)**  
    * **User Stories:**  
      * As an Administrator, I want to pre-define common services with standard labor times and rates, so that service advisors can add them to work orders quickly and consistently.  
      * As a Service Advisor, I want to easily add standard services from the catalog to a work order, speeding up the write-up process.  
    *   
    * **Detailed Requirements:**  
      * **FR-SVC-100: Manage Services Functionality (Admin Only)**  
        * FR-SVC-101: Provide an "Admin" \-\> "Service Catalog" section.  
        * FR-SVC-102: Display existing standard services in a list/table (Name, Description, Default Hours, Default Rate).  
        * FR-SVC-103: Provide an "Add New Service" button opening a form: Name (Text, Required), Description (Text Area, Optional), Default Hours (Number, Required), Default Rate (Number, Required). Save triggers POST /api/services/.  
        * FR-SVC-104: Allow Editing existing services via API (PUT/PATCH /api/services/{id}/).  
        * FR-SVC-105: Allow Deleting services via API (DELETE /api/services/{id}/). Deletion should be prevented if the service is actively used (consider soft delete/deactivation).  
      *   
      * **FR-SVC-200: Use Services in Work Orders**  
        * FR-SVC-201: The Service Catalog shall be searchable/selectable when adding Labor Line Items to Work Orders (FR-WO-402). Backend API (GET /api/services/) must support retrieval for this dropdown/search.  
      *   
    *   
  *   
  * **3.1.6 Parts Inventory Management (FR-INV)**  
    * **User Stories:**  
      * As an Administrator, I want to maintain a catalog of parts with selling prices and quantity on hand, so that we know what we stock and how to price it.  
      * As a Service Advisor, I want to add parts from the inventory to a work order, so that the price is automatically pulled and inventory can be tracked.  
      * As an Administrator, I want the system to automatically decrease the quantity on hand when a part is used and invoiced, so that inventory levels are accurate.  
      * As an Administrator, I want to manually adjust stock levels after a physical count, so that the system reflects actual inventory.  
    *   
    * **Detailed Requirements:**  
      * **FR-INV-100: Manage Parts Catalog Functionality (Admin Only)**  
        * FR-INV-101: Provide an "Admin" \-\> "Parts Inventory" section.  
        * FR-INV-102: Display existing catalog parts in a list/table (Part Number, Description, Selling Price, Cost Price \[Admin only view?\], Quantity on Hand). Allow searching/filtering by Part Number or Description.  
        * FR-INV-103: Provide "Add New Part" button opening a form: Part Number (Text, Required, Unique), Description (Text, Required), Selling Price (Number, Required), Cost Price (Number, Optional/Required?), Initial Quantity on Hand (Number, Required, Default 0). Save triggers POST /api/parts/.  
        * FR-INV-104: Allow Editing existing parts via API (PUT/PATCH /api/parts/{id}/). QoH should only be editable via Stock Adjustment (FR-INV-200).  
        * FR-INV-105: Allow Deleting parts via API (DELETE /api/parts/{id}/). Prevent deletion if part has history or stock (use soft delete/deactivation).  
      *   
      * **FR-INV-200: Adjust Stock Functionality (Admin Only)**  
        * FR-INV-201: On the Parts Inventory list or Part Detail view, provide an "Adjust Stock" button.  
        * FR-INV-202: Form/modal requires: Adjustment Amount (Number, positive or negative) OR New Quantity on Hand (Number). A Reason for adjustment (Text, Required).  
        * FR-INV-203: Save triggers API call (POST /api/parts/{id}/adjust\_stock/). Backend updates Part.quantity\_on\_hand and logs the adjustment (User, Part, Timestamp, Old QoH, New QoH, Reason) in StockAdjustmentLog table.  
      *   
      * **FR-INV-300: Automatic Inventory Decrement**  
        * FR-INV-301: When a Work Order status is changed to **'Invoiced'** (Trigger Status), the backend system MUST automatically decrement the quantity\_on\_hand for each Part linked to the WorkOrderItems on that WO.  
        * FR-INV-302: The decrement amount for each part is the quantity specified on the corresponding WorkOrderItem.  
        * FR-INV-303: This operation must occur within a database transaction along with the WO status update to ensure atomicity.  
        * FR-INV-304: This applies only to items added from the Parts Catalog (where WorkOrderItem.catalog\_part is linked), not custom parts.  
      *   
      * **FR-INV-400: Use Parts in Work Orders**  
        * FR-INV-401: The Parts Catalog shall be searchable/selectable when adding Part Line Items to Work Orders (FR-WO-502). Backend API (GET /api/parts/) must support retrieval. Optionally display QoH in the selection UI.  
      *   
    *   
  *   
  * **3.1.7 Invoicing & Billing (FR-BILL)**  
    * **User Stories:**  
      * As a Service Advisor, I want to generate an accurate invoice directly from a completed work order with one click, so that the billing process is fast and error-free.  
      * As a Service Advisor, I want to record customer payments (cash, card, check) against an invoice, so that we can track outstanding balances.  
      * As an Administrator, I want to set the sales tax rate for the system, so that it is applied correctly to all invoices.  
    *   
    * **Detailed Requirements:**  
      * **FR-BILL-100: Generate Invoice Functionality**  
        * FR-BILL-101: On the Work Order Detail view where status is 'Completed', provide a "Generate Invoice" button (Admin/SA only).  
        * FR-BILL-102: Clicking this button triggers an API call (POST /api/invoices/?workOrderId={id}).  
        * FR-BILL-103: Backend logic: Creates an Invoice record linked (OneToOne) to the WorkOrder. Copies relevant details (Customer, Vehicle). Creates InvoiceItem records mirroring the WorkOrderItems. Calculates Tax amount based on taxable items and the configured Tax Rate (FR-BILL-500). Calculates Total Amount. Sets Invoice status (e.g., 'Draft' or 'Sent'). Updates related Work Order status to 'Invoiced'. This must be transactional.  
        * FR-BILL-104: Upon success, navigate the user to the newly created Invoice Detail view.  
      *   
      * **FR-BILL-200: View Invoice List/Search**  
        * FR-BILL-201: Provide an "Invoices" list view displaying invoices in a table (Invoice \#, Date, Customer, Vehicle, Status \[Draft, Sent, Partially Paid, Paid, Void\], Amount). Allow sorting.  
        * FR-BILL-202: Implement filtering by Status, Customer, Date Range. Backend API (GET /api/invoices/?status=...) must support this. Implement pagination.  
        * FR-BILL-203: Clicking an invoice row navigates to the Invoice Detail view.  
      *   
      * **FR-BILL-300: View/Print Invoice Detail Functionality**  
        * FR-BILL-301: The Invoice Detail view shall display all invoice information: Invoice \#, Date, Customer, Vehicle, Line Items (Description, Qty/Hrs, Unit Price, Total), Sub-totals, Tax Amount, Grand Total, Amount Paid, Amount Due.  
        * FR-BILL-302: Provide a "Print" button that formats the invoice details in a clean layout and triggers the browser's print dialog. Include garage business information (Name, Address, Phone \- configurable).  
        * FR-BILL-303: Editing of finalized/paid invoices is prohibited. Provide a "Void" button (Admin only) for correction purposes, which marks the invoice status as 'Void' via API (PATCH /api/invoices/{id}/). Voided invoices remain visible but are clearly marked and excluded from sales totals.  
      *   
      * **FR-BILL-400: Record Payment Functionality**  
        * FR-BILL-401: On the Invoice Detail view (for non-Paid/Void invoices), provide a "Record Payment" button/section (Admin/SA only).  
        * FR-BILL-402: Form requires: Amount Paid (Number, Required, cannot exceed Amount Due), Payment Method (Dropdown: Cash, Card, Check \- Required), Payment Date (Date Picker, defaults to today, Required).  
        * FR-BILL-403: Save triggers API call (POST /api/invoices/{id}/payments/). Backend creates Payment record linked to the Invoice. Updates Invoice amount\_paid and status (e.g., to 'Partially Paid' or 'Paid' if amount paid equals total). Transactional update needed.  
        * FR-BILL-404: The Invoice Detail view shall display a list of payments recorded against it.  
      *   
      * **FR-BILL-500: Configurable Tax Rate**  
        * FR-BILL-501: Provide an "Admin" \-\> "Settings" section.  
        * FR-BILL-502: Allow Admin to input and save a default Sales Tax Rate (percentage, e.g., 8.5). This value must be stored (e.g., in Django settings or a dedicated configuration model).  
        * FR-BILL-503: The Invoice generation logic (FR-BILL-103) MUST use this configured rate to calculate the tax\_amount. Define which items are taxable (e.g., parts and labor, or just parts \- specify).  
      *   
    *   
  *   
  * **3.1.8 User Management & Permissions (FR-USER)**  
    * **User Stories:**  
      * As an Administrator, I want to create user accounts for new employees and assign them the correct role (Admin, SA, Tech), so that they have appropriate access to the system.  
      * As a Technician, I should only be able to view and update work orders assigned to me, so that I don't accidentally modify other jobs.  
      * As a Service Advisor, I should not be able to access user management functions, so that system security is maintained.  
    *   
    * **Detailed Requirements:**  
      * **FR-USER-100: Manage Users Functionality (Admin Only)**  
        * FR-USER-101: Provide an "Admin" \-\> "User Management" section.  
        * FR-USER-102: Display existing users in a list (Username, Email, Role(s), Active Status).  
        * FR-USER-103: Provide "Add New User" button opening a form: Username (Required, Unique), Email (Required, Unique), Password (input twice for confirmation, Required), Role(s) (Checkboxes/Multi-select: Admin, Service Advisor, Technician \- At least one Required). Save triggers API (POST /api/users/). Backend creates user and assigns roles (using Django's Group system is recommended).  
        * FR-USER-104: Allow Editing user details (Email, Roles, Active Status) via API (PUT/PATCH /api/users/{id}/). Password reset mechanism needed (e.g., Admin sets temporary password).  
        * FR-USER-105: Allow Deactivating users via API (PATCH /api/users/{id}/ setting is\_active=false). Deactivated users cannot log in.  
      *   
      * **FR-USER-200: Role-Based Access Control (RBAC)**  
        * FR-USER-201: System access MUST be strictly controlled based on assigned roles.  
        * FR-USER-202: Backend API endpoints MUST use permission classes (e.g., DRF IsAdminUser, IsAuthenticated, custom role checks) to verify the requesting user has the appropriate role for the attempted action (View, Create, Edit, Delete, specific actions like Generate Invoice, Adjust Stock). Return HTTP 403 Forbidden if access is denied.  
        * FR-USER-203: Frontend UI elements (buttons, menu items, form fields) MUST be conditionally rendered or disabled based on the logged-in user's role(s) to provide a clear user experience matching their permissions. Role information should be available in the AuthContext.  
        * FR-USER-204: Specific Role Restrictions (Examples):  
          * Tech: Can primarily view assigned WOs, add notes, update status (limited scope). Cannot view financials, manage users/inventory/services, create customers/vehicles/invoices.  
          * SA: Can manage customers, vehicles, appointments, WOs (full lifecycle except delete?), invoices/payments. Cannot manage users, services, parts catalog, system settings.  
          * Admin: Full access.  
        *   
      *   
    *   
  *   
  * **3.1.9 Basic Reporting (FR-RPT)**  
    * **User Stories:**  
      * As an Administrator, I want to run a sales report for a specific period, so that I can understand the garage's revenue.  
      * As a Service Advisor, I want to see a list of all work orders currently 'Ready for Pickup', so that I can contact customers.  
      * As an Administrator, I want to view current inventory levels, so that I know which parts might need reordering.  
    *   
    * **Detailed Requirements:**  
      * **FR-RPT-100: Sales Report Functionality**  
        * FR-RPT-101: Provide a "Reports" \-\> "Sales Report" section (Admin/SA access).  
        * FR-RPT-102: UI requires Date Range selection (Start Date, End Date).  
        * FR-RPT-103: "Generate Report" button triggers API call (GET /api/reports/sales/?start\_date=...\&end\_date=...).  
        * FR-RPT-104: Backend calculates total sales based on **Paid** invoices within the date range (sum of Payment.amount where Payment.payment\_date is in range, or sum of Invoice.total\_amount where Invoice.status is 'Paid' and date falls in range \- clarify calculation basis). The API returns aggregated data (e.g., total sales, potentially broken down by day/week/month or service type if needed later).  
        * FR-RPT-105: Frontend displays the summary results clearly. Provide a button to export the underlying detailed data (e.g., list of paid invoices in range) to CSV format.  
      *   
      * **FR-RPT-200: Work Order Status Report Functionality**  
        * FR-RPT-201: Provide a "Reports" \-\> "Work Order Report" section (Admin/SA/Tech access).  
        * FR-RPT-202: UI provides filters: Status (Multi-select dropdown), Assigned Technician (Dropdown), Date Range (Optional).  
        * FR-RPT-203: "Generate Report" button triggers API call (GET /api/reports/workorders/?status=...\&technician\_id=...).  
        * FR-RPT-204: Backend retrieves WOs matching filters. API returns the list of matching WOs.  
        * FR-RPT-205: Frontend displays the results in a table similar to the main WO list (FR-WO-201). Provide CSV export.  
      *   
      * **FR-RPT-300: Inventory Level Report Functionality**  
        * FR-RPT-301: Provide a "Reports" \-\> "Inventory Report" section (Admin/SA access).  
        * FR-RPT-302: UI may include filters (e.g., show items below certain QoH \- optional). "Generate Report" button triggers API call (GET /api/reports/inventory/).  
        * FR-RPT-303: Backend retrieves all parts from the catalog. API returns the list including Part Number, Description, Selling Price, Cost Price (Admin only?), Quantity on Hand.  
        * FR-RPT-304: Frontend displays the inventory list in a table. Provide CSV export.  
      *   
      * **FR-RPT-400: Customer Service History (Integrated)**  
        * FR-RPT-401: This report is integrated into the Customer Detail view (FR-CUST-307) and Vehicle Detail view (FR-VEH-303).  
        * FR-RPT-402: The backend API calls for customer (GET /api/customers/{id}/) and vehicle (GET /api/vehicles/{id}/) details should include nested serialization of their associated Work Orders/Invoices (summary level: Date, WO/Inv \#, Status, Total).  
        * FR-RPT-403: Frontend displays this historical list within the respective detail views.  
      *   
    *   
  *   
*   
* **3.2 Non-Functional Requirements:**  
  * **3.2.1 Performance:**  
    * NFR-PERF-01: Common UI screen loads (e.g., Customer list with search, WO list, Calendar view) shall render completely within 3 seconds under typical load (defined as 5 concurrent users performing standard operations on the local deployment server).  
    * NFR-PERF-02: API response times for typical data retrieval (e.g., GET /api/customers/, GET /api/workorders/{id}/) shall be under 500ms (excluding network latency) under typical load.  
    * NFR-PERF-03: Core data saving operations (e.g., Create Customer, Update WO Status, Record Payment) API calls shall complete processing within 2 seconds under typical load.  
    * NFR-PERF-04: Database queries generated by the ORM should be efficient. Use tools like django-debug-toolbar during development to identify and optimize slow queries (N+1 problems). Use database indexing appropriately on frequently queried fields (e.g., foreign keys, status fields, search fields).  
  *   
  * **3.2.2 Security:**  
    * NFR-SEC-01: All API endpoints (except potentially static file serving and /api/token/) MUST require authentication via valid JWT Bearer token.  
    * NFR-SEC-02: Passwords MUST be stored securely using Django's default hashing mechanism (PBKDF2).  
    * NFR-SEC-03: Role-Based Access Control (RBAC) MUST be strictly enforced on all relevant API endpoints via DRF permission classes, preventing unauthorized data access or modification.  
    * NFR-SEC-04: The system MUST be protected against common web vulnerabilities (OWASP Top 10\) including:  
      * SQL Injection (Mitigated by exclusive use of Django ORM).  
      * Cross-Site Scripting (XSS) (Mitigated by React's default encoding and proper use of MUI components; avoid dangerouslySetInnerHTML).  
      * Cross-Site Request Forgery (CSRF) (Mitigated by using JWT auth for API and potentially Django's CSRF protection if forms post directly).  
      * Insecure Direct Object References (IDOR) (Mitigated by checking object ownership/permissions in API views).  
    *   
    * NFR-SEC-05: Sensitive configuration data (Django SECRET\_KEY, Database credentials, JWT signing keys) MUST NOT be hardcoded or committed to version control. Use environment variables or a secure configuration method.  
    * NFR-SEC-06: Dependency Management: Regularly check libraries (pip, npm) for known vulnerabilities using tools like pip-audit, npm audit.  
  *   
  * **3.2.3 Usability:**  
    * NFR-USAB-01: The UI shall employ a consistent look and feel across all modules, enforced by the exclusive use of the Material UI (MUI) component library and consistent layout patterns.  
    * NFR-USAB-02: Navigation shall be clear and intuitive via sidebar menu or top navigation bar. Key functions shall be easily accessible.  
    * NFR-USAB-03: Data entry forms shall provide clear labels, placeholders where appropriate, and immediate client-side validation feedback for required fields and format errors. Server-side error messages returned by the API must be clearly displayed to the user near the relevant field.  
    * NFR-USAB-04: Loading indicators (e.g., spinners) shall be displayed during API calls or long operations. Success messages shall confirm successful actions.  
    * NFR-USAB-05: Tables displaying lists of data shall support sorting and basic filtering/searching as specified in functional requirements.  
  *   
  * **3.2.4 Reliability:**  
    * NFR-REL-01: The system should operate without crashing or producing incorrect data during normal usage patterns defined by the functional requirements.  
    * NFR-REL-02: Data integrity must be enforced via database constraints (NOT NULL, UNIQUE, FOREIGN KEY) defined in Django models and through application-level validation (DRF serializers).  
    * NFR-REL-03: A mechanism for regular automated daily backups of the PostgreSQL database MUST be implemented using standard tools (e.g., pg\_dump). Backup retention policy should be defined (e.g., keep last 7 daily backups).  
    * NFR-REL-04: Backend API calls involving multiple database write operations (e.g., Invoice generation, Stock decrement) MUST use database transactions (@transaction.atomic) to ensure atomicity.  
  *   
  * **3.2.5 Maintainability:**  
    * NFR-MAIN-01: Backend code MUST adhere to PEP 8 style guidelines enforced by linters (Flake8). Frontend code MUST adhere to standard React/ESLint rules enforced by linters (ESLint) and formatters (Prettier).  
    * NFR-MAIN-02: Code MUST be well-commented. Use docstrings for Python modules, classes, functions. Add inline comments for complex logic. Use JSDoc or similar for React component props and complex functions.  
    * NFR-MAIN-03: The system architecture MUST remain modular (Django apps, React components) as defined in the HLD, promoting separation of concerns.  
    * NFR-MAIN-04: Configuration values (e.g., API base URLs, pagination size, tax rate) should be centralized and easily modifiable (e.g., Django settings, environment variables, React context/config files). Avoid magic numbers/strings.  
    * NFR-MAIN-05: Adherence to the @file:best\_practices\_policy.md is mandatory.  
  *   
  * **3.2.6 Testability:**  
    * NFR-TEST-01: Unit tests MUST be written for critical backend logic (services, signals, complex model methods, API view logic) and frontend components (rendering, state changes, user interactions).  
    * NFR-TEST-02: Backend tests should use Python's unittest or pytest and Django's testing framework. Frontend tests should use Jest and React Testing Library.  
    * NFR-TEST-03: Aim for a minimum unit test code coverage of 70% for backend logic and frontend components.  
    * NFR-TEST-04: Tests MUST be runnable via simple commands (python manage.py test, npm test) and integrated into the development workflow described in @file:dev\_plan\_v1.0.md.  
  *   
*   
* **3.3 Interface Requirements:**  
  * **3.3.1 User Interfaces (UI):**  
    * UI-01: The primary interface shall be a graphical web-based UI implemented as a React Single Page Application (SPA).  
    * UI-02: The UI must be functional and display correctly on the latest stable versions of modern desktop web browsers (Google Chrome, Mozilla Firefox, Microsoft Edge) running on Windows.  
    * UI-03: The UI must be responsive and usable on standard desktop resolutions (minimum 1366x768). Tablet responsiveness is desirable but secondary.  
    * UI-04: The UI shall use the Material UI (MUI) component library exclusively for all interactive elements, layout, and styling to ensure consistency.  
  *   
  * **3.3.2 Hardware Interfaces:**  
    * HW-01: The system must support printing invoices (FR-BILL-302) and potentially reports using the standard browser print functionality connecting to locally configured printers. No direct hardware integration is required.  
  *   
  * **3.3.3 Software Interfaces:**  
    * SW-01: **Frontend-Backend API:** A RESTful API provided by the Django backend using Django REST Framework is the sole interface between the React frontend and backend logic. Communication MUST use JSON payloads over HTTPS (HTTPS setup required for deployment). API specification outlined in HLD v1.1 Section 4\.  
    * SW-02: **Database Interface:** The Django backend MUST interact with the PostgreSQL 16 database exclusively via the Django ORM. No direct SQL should be used unless absolutely necessary and approved.  
    * SW-03: **Operating System:** Development and initial deployment target is Windows. Backend Python/Django code and Frontend Node/React code must be compatible with Windows environment.  
    * SW-04: **Web Server:** For local deployment, Django can be run using manage.py runserver (development only) or a simple WSGI server like Waitress. React static files served by Django (in dev) or a simple static server.  
  *   
*   
* **3.4 Data Requirements:**  
  * DATA-01: The system must persistently store all data related to customers, vehicles, appointments, work orders (including line items and notes), services, parts inventory (including stock adjustment logs), invoices, payments, users, and roles in the PostgreSQL database.  
  * DATA-02: Data relationships defined in HLD v1.1 Section 5.2 (Foreign Keys, OneToOne, etc.) must be enforced by the database schema generated by Django migrations. Referential integrity must be maintained.  
  * DATA-03: Data validation rules (required fields, unique constraints, data types, formats) specified in functional requirements must be enforced at both the database level (where possible via model definitions) and the application level (via DRF serializers).  
  * DATA-04: The system must retain historical data (customers, vehicles, WOs, invoices) indefinitely unless explicitly archived or deleted according to defined procedures (soft delete preferred for records with dependencies). A minimum retention period of 7 years for financial records (invoices, payments) is recommended for compliance.  
  * DATA-05: Key data fields shall have appropriate data types defined in Django models (e.g., CharField, TextField, IntegerField, DecimalField(max\_digits=10, decimal\_places=2), DateField, DateTimeField, BooleanField, EmailField, ForeignKey, OneToOneField).  
* 

---

**4\. Appendices (Optional)**

* \[Placeholder for diagrams, detailed state transition tables, or other supplementary information if needed later\].

---

