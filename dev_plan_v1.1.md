

## **VMGMS \- AI Development Plan (Leveraging MCP)**

**Version:** 1.0  
**Date:** 03/05/2025

**Goal:** To systematically build the VMGMS using an AI agent within VS Code Insiders, leveraging MCP for context and aiming for a high-quality codebase based on SRS v1.1 (Compiled Final) and HLD v1.1.

**Target Environment:** VS Code Insiders with integrated AI agent supporting Model Context Protocol (MCP). Windows development and deployment machine.

**Prerequisites:**

1. VS Code Insiders installed.  
2. AI Agent extension installed and configured within VS Code.  
3. MCP support verified within the AI agent.  
4. Python 3.10+ installed and added to system PATH.  
5. Node.js (LTS version recommended) & NPM installed and added to system PATH.  
6. PostgreSQL 16 installed, server running. Database created (e.g., vmgms\_db) with a dedicated user/password configured. Ensure connection details are readily available.  
7. Git installed.  
8. Project repository initialized (git init) in the main project folder. Create initial backend and frontend subdirectories if desired for organization.

**Development Workflow:**

1. **Task Definition:** Identify the next task from the plan below (e.g., T1.1).  
2. **Context Gathering & Prompt Preparation:** Prepare the prompt for the AI agent. Crucially, include:  
   * **Specific Task Instruction:** Clearly state what needs to be done (e.g., "Create the Customer model").  
   * **Relevant SRS/HLD:** Reference specific sections using MCP file context (e.g., "@file:srs\_v1.2.md\#FR-CUST-100", "@file:hld\_v1.1.md\#5.2"). Ensure the SRS, HLD, and Best Practices documents are accessible in the workspace.  
   * **Workspace Context:** Use @workspace to give the AI awareness of the current project structure.  
   * **Specific Files:** Use @file:path/to/target/file.ext to specify exactly which file(s) the AI should create or modify.  
   * **Schemas/APIs (if applicable):** Use @schema for database model context or @api for related API endpoints when relevant.  
   * **Terminal Commands:** Use @terminal to instruct the AI to run specific commands (e.g., migrations, tests, installs).  
   * **Best Practices Reference:** Include reminders like "Ensure code adheres to @file:best\_practices\_policy.md including PEP 8 / ESLint standards and add necessary comments/docstrings."

3. **AI Prompting:** Submit the well-contextualized prompt to the AI agent within VS Code.  
4. **Code Review (Human Oversight):** Carefully review the AI-generated code:  
   * **Correctness:** Does it fulfill the requirements of the task and the referenced SRS/HLD sections?  
   * **Adherence:** Does it follow the HLD architecture, chosen tech stack patterns (Django MVT/DRF, React/MUI/Context), and the Best Practices Policy?  
   * **Quality:** Is the code clear, readable, well-formatted, and appropriately commented/documented?  
   * **Security:** Are security best practices being followed (e.g., using ORM, proper validation, no hardcoded secrets)?  
5.   
6. **Testing:**  
   * Instruct the AI (via @terminal) to run the unit tests it generated (e.g., @terminal: python manage.py test backend/customers or @terminal: npm test \-- frontend/src/components/CustomerList.test.jsx).  
   * Perform brief manual functional checks where appropriate (e.g., run the dev server and interact with the new feature).  
7. **Refinement/Correction:** If issues are found during review or testing:  
   * Provide feedback to the AI, including the problematic code snippet (@file:path/to/file.ext) and explain the issue. Ask for a correction referencing the policies or requirements.  
   * Alternatively, make manual corrections if faster/simpler. Re-test after corrections.  
8. **Commit:** Once the task is verified as complete and correct, commit the changes to Git using a clear, conventional commit message referencing the Task ID (e.g., git commit \-m "feat(backend): Implement Customer model and tests (T2.2)").

**Code Quality MCP Strategy:**

* **Python/Django:** Include "Ensure code adheres to PEP 8 standards as defined in @file:best\_practices\_policy.md\#3." in prompts. Use linters (Flake8) via @terminal for verification if needed.  
* **React/JS:** Include "Ensure code follows standard React practices and ESLint rules as defined in @file:best\_practices\_policy.md\#4." Use ESLint/Prettier via @terminal for verification/formatting if needed.  
* **Documentation:** Require docstrings/comments. Prompt: "Add clear docstrings/comments explaining the purpose and usage of this function/component/model as per @file:best\_practices\_policy.md."

**Testing MCP Strategy:**

* **Backend Features:** Prompt "Implement the feature defined in @file:srs\_v1.2.md\#FR\_ID. Also, create comprehensive unit tests for this logic/model/API view in the corresponding test file (@file:backend/app\_name/tests.py) using Python's unittest or pytest, following testing guidelines in @file:best\_practices\_policy.md\#5."  
* **Frontend Features:** Prompt "Implement the React component described in @file:srs\_v1.2.md\#FR\_ID using @file:frontend/src/path/component.jsx and MUI components. Also, create unit tests for this component using Jest and React Testing Library in @file:frontend/src/path/component.test.jsx, following testing guidelines in @file:best\_practices\_policy.md\#5. Mock necessary API calls."

---

**Phase 1: Setup & Core Backend Foundation (Sprint 1\)**

* **Goal:** Initialize project structures, setup database connection, implement basic user model and authentication API.  
* **Tasks:**  
  * **T1.1:** Initialize Django Project & Core App.  
    * *Prompt:* Using @terminal in the project root, run django-admin startproject vmgms\_backend backend. Then, navigate into the backend directory (cd backend) and run python manage.py startapp core. Add 'core' to INSTALLED\_APPS in @file:backend/vmgms\_backend/settings.py. Add requirements.txt file (@file:backend/requirements.txt) and include Django\~=4.2 (or latest compatible 4.x).  
  * **T1.2:** Configure Database Connection.  
    * *Prompt:* Edit @file:backend/vmgms\_backend/settings.py. Configure the DATABASES setting for PostgreSQL using the details (DB name vmgms\_db, user, password, host, port) provided in the prerequisites. Add psycopg2-binary to @file:backend/requirements.txt. Using @terminal in the backend directory, create a virtual environment (python \-m venv venv), activate it (.\\venv\\Scripts\\activate on Windows), and install dependencies (pip install \-r requirements.txt).  
  * **T1.3:** Setup Django REST Framework (DRF) & Simple JWT.  
    * *Prompt:* Add rest\_framework and rest\_framework\_simplejwt to INSTALLED\_APPS in @file:backend/vmgms\_backend/settings.py. Configure DRF default settings (e.g., DEFAULT\_AUTHENTICATION\_CLASSES, DEFAULT\_PERMISSION\_CLASSES) and JWT settings (e.g., SIMPLE\_JWT \= {'ACCESS\_TOKEN\_LIFETIME': timedelta(minutes=60)}) as per DRF/SimpleJWT documentation, referencing @file:hld\_v1.1.md\#8.1. Add URLs for JWT endpoints (path('api/token/', TokenObtainPairView.as\_view()), path('api/token/refresh/', TokenRefreshView.as\_view())) in @file:backend/vmgms\_backend/urls.py. Add djangorestframework and djangorestframework-simplejwt to @file:backend/requirements.txt. Install using @terminal: pip install \-r requirements.txt.  
  * **T1.4:** Implement Custom User Model & Roles via Groups.  
    * *Prompt:* Using @terminal, create a users app (python manage.py startapp users). Define a custom User model in @file:backend/users/models.py inheriting from AbstractUser as described in @file:hld\_v1.1.md\#5.2. Add the users app to INSTALLED\_APPS. Update AUTH\_USER\_MODEL \= 'users.User' in @file:backend/vmgms\_backend/settings.py. Using @terminal, run python manage.py makemigrations users and python manage.py migrate. Write basic model tests in @file:backend/users/tests.py. Create Django Groups 'Admin', 'ServiceAdvisor', 'Technician' using Django admin or a data migration.  
  * **T1.5:** Implement Basic API Permissions.  
    * *Prompt:* Create permission classes in @file:backend/core/permissions.py (e.g., IsAdmin, IsServiceAdvisor, IsTechnician) that check user group membership using user.groups.filter(name='GroupName').exists(), referencing @file:srs\_v1.2.md\#FR-USER-202. Ensure base DRF permissions in settings.py default to IsAuthenticated.  
  *   
  * **T1.6:** Run Initial Checks & Tests.  
    * *Prompt:* Using @terminal in the backend directory (with venv activated), run python manage.py check and python manage.py test. Commit initial setup to Git: git add ., git commit \-m "feat(backend): Initial Django setup, user model, auth API (Phase 1)".

**Phase 2: Backend Feature Modules (Sprints 2-4)**

* **Goal:** Implement core business logic and API endpoints for each major module. Focus on API contract (serializers, views, URLs) and unit testing.  
* **Sprint 2: Customer & Vehicle Management**  
  * **T2.1:** Create customers Django App.  
    * *Prompt:* Using @terminal, run python manage.py startapp customers. Add 'customers' to INSTALLED\_APPS in @file:backend/vmgms\_backend/settings.py.  
  * **T2.2:** Implement Customer Model.  
    * *Prompt:* Define the Customer model in @file:backend/customers/models.py based on @file:hld\_v1.1.md\#5.2 and @file:srs\_v1.2.md\#FR-CUST-103. Include fields, types (e.g., EmailField(unique=True)), constraints (null=False/True, blank=False/True), is\_active flag, timestamps, and \_\_str\_\_ method. Write model tests in @file:backend/customers/tests.py covering field constraints and basic creation, following @file:best\_practices\_policy.md\#5.  
  * **T2.3:** Implement Customer Serializer.  
    * *Prompt:* Create CustomerSerializer in @file:backend/customers/serializers.py using DRF ModelSerializer based on the Customer model (@schema). Ensure all necessary fields are included/excluded. Add validation for email format and required fields as per @file:srs\_v1.2.md\#FR-CUST-105. Reference @file:best\_practices\_policy.md\#3.  
  * **T2.4:** Implement Customer API ViewSet.  
    * *Prompt:* Create CustomerViewSet in @file:backend/customers/views.py using DRF ModelViewSet based on @file:hld\_v1.1.md\#4.2. Use CustomerSerializer. Set permission\_classes based on @file:srs\_v1.2.md\#FR-USER-204 (e.g., Admin/SA for write, Authenticated for read). Add filtering backend (DjangoFilterBackend, SearchFilter) and define filterset\_fields/search\_fields for filtering by status (is\_active) and searching name/email/phone as per @file:srs\_v1.2.md\#FR-CUST-203. Implement soft delete for destroy method (set is\_active=False). Write API tests in @file:backend/customers/tests.py covering CRUD, permissions, filtering, and soft delete, following @file:best\_practices\_policy.md\#5.  
  * **T2.5:** Register Customer API URLs.  
    * *Prompt:* Create @file:backend/customers/urls.py. Register the CustomerViewSet using DRF DefaultRouter. Include these URLs in @file:backend/vmgms\_backend/urls.py under an /api/ prefix (e.g., path('api/', include('customers.urls'))).  
  * **T2.6-T2.10:** Repeat steps T2.1-T2.5 for **Vehicle Management**.  
    * App: vehicles.  
    * Model (@file:backend/vehicles/models.py): Vehicle model based on @file:hld\_v1.1.md\#5.2 and @file:srs\_v1.2.md\#FR-VEH-103. Link to Customer via ForeignKey. Ensure vin and license\_plate have unique constraints where appropriate. Add is\_active flag. Write model tests.  
    * Serializer (@file:backend/vehicles/serializers.py): VehicleSerializer. Validate fields (year, vin format).  
    * ViewSet (@file:backend/vehicles/views.py): VehicleViewSet. Handle permissions (Admin/SA). Implement filtering/search (license\_plate, vin). Implement soft delete. Write API tests covering CRUD, permissions, linking to customer.  
    * URLs (@file:backend/vehicles/urls.py, @file:backend/vmgms\_backend/urls.py): Register VehicleViewSet under /api/vehicles/.  
  * **T2.11:** Run Migrations & Tests.  
    * *Prompt:* Using @terminal, run python manage.py makemigrations customers vehicles and python manage.py migrate. Run all tests (python manage.py test). Commit Sprint 2 work: git add ., git commit \-m "feat(backend): Implement Customer and Vehicle CRUD APIs (Sprint 2)".  
* **Sprint 3: Scheduling & Work Order Core**  
  * **T3.1-T3.5:** Implement **Appointment Scheduling**.  
    * App: appointments. Model (@file:backend/appointments/models.py): Appointment based on @file:srs\_v1.2.md\#FR-APP-202. Link to Customer, Vehicle, User (Technician, null=True). Include status (CharField with choices), appointment\_time, reason. Write tests. Serializer (@file:backend/appointments/serializers.py): AppointmentSerializer. ViewSet (@file:backend/appointments/views.py): AppointmentViewSet. Permissions: Admin/SA write, Tech read? Filter by date range (start\_date, end\_date) and technician. Write API tests. URLs.  
  *   
  * **T3.6:** Create workorders Django App.  
    * *Prompt:* Using @terminal, run python manage.py startapp workorders. Add to INSTALLED\_APPS.  
  * **T3.7:** Implement WorkOrder Model.  
    * *Prompt:* Define WorkOrder model in @file:backend/workorders/models.py based on @file:hld\_v1.1.md\#5.2 and @file:srs\_v1.2.md\#FR-WO-103. Link to Customer, Vehicle, User (Technician, null=True). Add status (CharField with choices from @file:srs\_v1.2.md\#FR-WO-702), customer\_complaint (TextField), technician\_notes (TextField, nullable). Write tests.  
  * **T3.8:** Implement WorkOrderItem Model.  
    * *Prompt:* Define WorkOrderItem model in @file:backend/workorders/models.py based on @file:hld\_v1.1.md\#5.2 and @file:srs\_v1.2.md\#FR-WO-400/\#FR-WO-500. Link to WorkOrder (ForeignKey). Include item\_type (Choices: LABOR, PART), description, quantity (DecimalField), unit\_price (DecimalField). Add nullable ForeignKeys to Part and Service (to be created later). Write tests.  
  * **T3.9:** Implement WorkOrder & Item Serializers.  
    * *Prompt:* Create WorkOrderItemSerializer and WorkOrderSerializer in @file:backend/workorders/serializers.py. Use nested serialization (WorkOrderItemSerializer(many=True)) in WorkOrderSerializer for reading items. WorkOrderSerializer should also handle nested Customer/Vehicle/Technician details (read-only) and calculate totals (use SerializerMethodField).  
  * **T3.10:** Implement WorkOrder API ViewSet (Core CRUD & Actions).  
    * *Prompt:* Create WorkOrderViewSet in @file:backend/workorders/views.py using ModelViewSet. Use WorkOrderSerializer. Implement permissions based on @file:srs\_v1.2.md\#FR-USER-204. Add filtering/search (status, technician, customer). Implement custom @action(detail=True, methods=\['patch'\]) for updating status and assigning technician, taking appropriate payload. Write API tests covering CRUD, actions, permissions, filtering.  
  * **T3.11:** Implement WorkOrderItem API View/Action.  
    * *Prompt:* Create WorkOrderItemViewSet (or add actions to WorkOrderViewSet) in @file:backend/workorders/views.py to handle POST /api/workorders/{id}/items/, PUT/PATCH/DELETE /api/workorders/{id}/items/{item\_id}/. Use WorkOrderItemSerializer. Ensure permissions allow only Admin/SA to modify items. Write API tests.  
  *   
  * **T3.12:** Register WorkOrder URLs. Register WorkOrderViewSet and item endpoints.  
  * **T3.13:** Run Migrations & Tests. Commit Sprint 3 work.  
* **Sprint 4: Inventory, Services & Billing Core**  
  * **T4.1-T4.5:** Implement **Service Catalog**.  
    * App: inventory. Model (@file:backend/inventory/models.py): Service based on @file:hld\_v1.1.md\#5.2. Serializer (@file:backend/inventory/serializers.py): ServiceSerializer. ViewSet (@file:backend/inventory/views.py): ServiceViewSet (Admin only permissions). URLs (@file:backend/inventory/urls.py, main urls). Tests.  
  *   
  * **T4.6-T4.10:** Implement **Parts Inventory**.  
    * Model (@file:backend/inventory/models.py): Part based on @file:hld\_v1.1.md\#5.2. Include quantity\_on\_hand (IntegerField, default=0). Model: StockAdjustmentLog linking to Part, User, storing adjustment details. Serializer (@file:backend/inventory/serializers.py): PartSerializer, StockAdjustmentLogSerializer. ViewSet (@file:backend/inventory/views.py): PartViewSet (Admin only). Add @action for stock adjustment (POST /api/parts/{id}/adjust\_stock/) which updates QoH and creates log entry. URLs. Tests covering CRUD and stock adjustment.  
  * **T4.11:** Implement **Inventory Decrement Logic**.  
    * *Prompt:* Implement the logic described in @file:srs\_v1.2.md\#FR-INV-300. Use Django Signals (listen to post\_save on WorkOrder) or override WorkOrder.save() method in @file:backend/workorders/models.py. Check if status changed to 'Invoiced'. If so, query related WorkOrderItems, filter for catalog parts, decrement Part.quantity\_on\_hand using F() expressions for atomicity. Wrap logic in transaction.atomic. Write specific tests for this signal/logic in @file:backend/workorders/tests.py.  
  *   
  * **T4.12-T4.16:** Implement **Invoicing Core**.  
    * App: billing. Model (@file:backend/billing/models.py): Invoice (OneToOne to WorkOrder), Payment (ForeignKey to Invoice) based on @file:hld\_v1.1.md\#5.2. Include status, totals, tax amount on Invoice. Serializer (@file:backend/billing/serializers.py): PaymentSerializer, InvoiceSerializer (read-only nested items/payments). ViewSet (@file:backend/billing/views.py): InvoiceViewSet (read-only list/retrieve, add @action POST /api/invoices/?workOrderId={id} to generate invoice from WO), PaymentViewSet (nested under Invoice for POST /api/invoices/{id}/payments/). Implement invoice generation logic (copy items, calculate tax based on setting, update statuses) within the generate action, ensuring it's transactional. Implement payment recording logic updating Invoice status/totals. Permissions: Admin/SA. URLs. Tests covering generation, payment recording, status updates.  
  * **T4.17:** Implement **Tax Rate Configuration**.  
    * *Prompt:* Add a DEFAULT\_TAX\_RATE setting (e.g., Decimal('0.085')) to @file:backend/vmgms\_backend/settings.py. Ensure the Invoice generation logic in @file:backend/billing/views.py (T4.12) references settings.DEFAULT\_TAX\_RATE for calculations. Update tests.  
  * **T4.18:** Run Migrations & Tests. Commit Sprint 4 work.  
* 

**Phase 3: Frontend Foundation & Core UI (Sprint 5\)**

* **Goal:** Setup React project, implement routing, basic layout, authentication flow, and connect to backend auth endpoints.  
* **Tasks:**  
  * **T5.1:** Initialize React Project.  
    * *Prompt:* Using @terminal in the project root, run npx create-react-app frontend.

  * **T5.2:** Install Core Dependencies.  
    * *Prompt:* Using @terminal, navigate into the frontend directory (cd frontend) and run npm install react-router-dom axios @mui/material @emotion/react @emotion/styled.  
  *   
  * **T5.3:** Setup Basic Project Structure.  
    * *Prompt:* Create directories inside @file:frontend/src/: components, pages, services, contexts, utils, assets. Organize existing files appropriately. Reference @file:best\_practices\_policy.md\#4.  
  *   
  * **T5.4:** Implement Routing.  
    * *Prompt:* Setup BrowserRouter in index.js. Define routes in App.js (@file:frontend/src/App.js) using Routes, Route. Create placeholder components for main pages (Login, Dashboard, Customers, WorkOrders, etc.). Implement a ProtectedRoute component that checks auth state (from context T5.6) and redirects to login if not authenticated. Apply ProtectedRoute to non-login routes.  
  * **T5.5:** Implement Basic Layout Component.  
    * *Prompt:* Create a Layout component in @file:frontend/src/components/Layout.jsx using MUI components (AppBar, Drawer, List, ListItem, Box, etc.) for navigation (sidebar/topbar) and a main content area (\<Outlet /\> from react-router-dom). Apply this Layout to protected routes in App.js.  
  * **T5.6:** Implement Authentication Context/Service.  
    * *Prompt:* Create @file:frontend/src/services/authService.js with login(username, password) function calling POST /api/token/ using axios. Create @file:frontend/src/contexts/AuthContext.jsx using React.createContext. Implement an AuthProvider component that manages auth state (token, user info \[decode JWT?\], isAuthenticated flag), provides login/logout functions, and wraps the application in App.js. Store token in localStorage.

    

  * **T5.7:** Implement Login Page.  
    * *Prompt:* Create LoginPage component in @file:frontend/src/pages/LoginPage.jsx using MUI TextField, Button. On form submit, call the login function from AuthContext. Handle loading state and display errors from API response. On success, navigate to dashboard. Write basic component tests using Jest/RTL (@file:frontend/src/pages/LoginPage.test.jsx).

    

  * **T5.8:** Implement Logout Functionality.  
    * *Prompt:* Add a Logout button in the Layout component (@file:frontend/src/components/Layout.jsx). On click, call the logout function from AuthContext (which should clear token from localStorage and update context state), then navigate to /login.  
  *   
  * **T5.9:** Configure Axios Instance & Interceptors.  
    * *Prompt:* Create an Axios instance in @file:frontend/src/services/api.js (or similar). Configure an interceptor to automatically add the Authorization: Bearer \<token\> header to outgoing requests, retrieving the token from localStorage. Handle potential 401 errors globally (e.g., trigger logout).

    

  * **T5.10:** Test Authentication Flow. Run frontend (@terminal: npm start) and backend (@terminal: python manage.py runserver). Test login, logout, accessing protected routes. Run frontend tests (@terminal: npm test). Commit Sprint 5 work.


**Phase 4: Frontend Feature Implementation (Sprints 6-8)**

* **Goal:** Build React components for each module, connect them to the backend APIs, and implement UI logic using MUI and Context API.  
* **General Task Structure (Repeat for each module \- e.g., Customers):**  
  * Create API service functions (@file:frontend/src/services/customerService.js) wrapping axios calls for backend endpoints (list with filters, getById, create, update, delete).  
  * Create page component (@file:frontend/src/pages/CustomerPage.jsx).  
  * Create list component (@file:frontend/src/components/CustomerList.jsx) using MUI DataGrid. Fetch data using service function in useEffect. Implement pagination, sorting, filtering controls calling the appropriate API service functions. Handle loading/error states. Link rows to detail view. Include "Add" button.  
  * Create form component (@file:frontend/src/components/CustomerForm.jsx) using MUI inputs within a Modal or separate page for Create/Edit. Handle form state, validation, and submission calling API service functions.  
  * Implement routing/navigation in App.js and links between components.  
  * Manage state using local component state (useState) or Context API if shared state is needed across components within the module.  
  * Write component unit/integration tests (\*.test.jsx) mocking service functions.


* **Sprint 6: Customer & Vehicle UI**  
  * **T6.1-T6.7:** Implement Customer UI based on structure above, referencing @file:srs\_v1.2.md\#FR-CUST. Include List/Search/Pagination, Detail View (showing basic info \+ lists of related Vehicles/WOs), Create/Edit Forms/Modals.  
  * **T6.8-T6.14:** Implement Vehicle UI, referencing @file:srs\_v1.2.md\#FR-VEH. Display vehicles within Customer Detail. Implement Add/Edit Vehicle forms/modals linked from Customer Detail. Potentially add standalone Vehicle Search page.


* **Sprint 7: Scheduling & Work Order UI**  
  * **T7.1-T7.5:** Implement Appointment Calendar UI referencing @file:srs\_v1.2.md\#FR-APP. Use a suitable React calendar library compatible with MUI. Fetch/display appointments. Implement modals for viewing details and creating/editing appointments.  
  * **T7.6-T7.12:** Implement Work Order UI referencing @file:srs\_v1.2.md\#FR-WO. List page with filtering/pagination. Detail View showing all sections (Customer/Vehicle, Status, Technician, Items, Notes). Modals/forms for adding/editing Labor/Part items (search catalogs via API). UI controls for changing Status/Technician based on role permissions. Technician Notes editing.  
*   
* **Sprint 8: Inventory, Services & Billing UI**  
  * **T8.1-T8.5:** Implement Admin UI for Service Catalog (@file:srs\_v1.2.md\#FR-SVC). List/Table, Add/Edit forms/modals.  
  * **T8.6-T8.10:** Implement Admin UI for Parts Inventory (@file:srs\_v1.2.md\#FR-INV). List/Table with search. Add/Edit forms. Stock Adjustment modal/form.  
  * **T8.11-T8.15:** Implement Invoicing UI (@file:srs\_v1.2.md\#FR-BILL). Invoice List with filtering. Read-only Invoice Detail View (displaying data from generated invoice). "Generate Invoice" button on completed WO view. Record Payment modal/form on Invoice Detail view. Print Invoice button triggering browser print.


**Phase 5: Integration & Reporting (Sprint 9\)**

* **Goal:** Ensure smooth data flow between modules, implement reporting features, perform end-to-end testing.  
* **Tasks:**  
  * **T9.1-T9.3:** Manual Workflow Testing: Test Appointment \-\> Work Order \-\> Invoice generation \-\> Payment Recording \-\> Inventory Decrement flows thoroughly. Document bugs.  
  * **T9.4:** Implement Sales Report UI (@file:srs\_v1.2.md\#FR-RPT-100). Create page, add date pickers, call backend report API via service, display summary, add CSV export for details.  
  * **T9.5:** Implement Work Order Status Report UI (@file:srs\_v1.2.md\#FR-RPT-200). Create page, add filters, call API, display results in table, add CSV export.  
  * **T9.6:** Implement Inventory Level Report UI (@file:srs\_v1.2.md\#FR-RPT-300). Create page, call API, display results in table, add CSV export.  
  * **T9.7:** Perform Comprehensive Manual End-to-End Testing: Create multiple customers/vehicles/WOs/Invoices covering various scenarios. Test all user roles. Verify all reports. Document bugs meticulously.


**Phase 6: Refinement & Deployment Prep (Sprint 10\)**

* **Goal:** Fix bugs identified in testing, perform final code cleanup, prepare for local deployment.  
* **Tasks:**  
  * **T10.1:** Address Bugs: Prioritize and fix bugs documented in T9.7. Use AI prompts with specific @file context and bug descriptions. Retest fixes.  
  * **T10.2:** Final UI/UX Review & Polish: Check for consistency, alignment issues, confusing labels, missing loading/success indicators across the application. Prompt AI for minor UI adjustments.  
  * **T10.3:** Code Cleanup: Prompt AI to review specific backend (@file:backend/...) and frontend (@file:frontend/...) files for unused variables/imports, potential small optimizations, or areas needing better comments/docstrings based on @file:best\_practices\_policy.md. Run linters/formatters (@terminal).  
  * **T10.4:** Prepare Deployment Documentation (README.md).  
    * *Prompt:* Create/Update the main README.md file (@file:README.md) with clear, step-by-step instructions for setting up and running the application locally on Windows as described in @file:hld\_v1.1.md\#7. Include sections for prerequisites, backend setup (venv, install, migrate, runserver/waitress), and frontend setup (install, build, serve).

    

  * **T10.5:** Final Build & Local Deployment Test: Run npm run build in the frontend directory (@terminal). Configure backend (if needed) to serve static files from the build directory (or use separate static server). Follow the README.md instructions to run the entire application on the target local Windows machine. Perform final smoke test. Commit final version.

