

## **High-Level Design (HLD) \- Vehicle Maintenance Garage Management System (VMGMS)**

**Version:** 1.1 (AI Dev Focused)  
**Date:** \[Current Date\]  
**Changes from v1.0:** Incorporated specific tech stack (Django/React/PostgreSQL/Windows), detailed API design approach, provided more specific data schema examples, emphasized standard framework practices for AI implementation.

**Table of Contents:**

1. Introduction  
   1.1 Purpose  
   1.2 Scope  
   1.3 Definitions, Acronyms, and Abbreviations  
   1.4 References  
   1.5 Overview  
2. System Architecture  
   2.1 Architectural Style  
   2.2 Architecture Diagram  
3. Major Components  
   3.1 Component Summary  
   3.2 Component Details  
   3.2.1 Frontend (React)  
   3.2.2 Backend (Django/DRF)  
   3.2.3 Data Access Layer (DAL) / Django ORM  
   3.2.4 Database (PostgreSQL)  
4. Component Interaction / API Specification  
   4.1 API Design Philosophy  
   4.2 Key API Endpoints (Examples)  
5. Data Design  
   5.1 Database Type  
   5.2 High-Level Schema / Key Django Models (Conceptual)  
6. Technology Stack  
   6.1 Language(s) & Framework(s)  
   6.2 Database  
   6.3 Operating System / Environment  
   6.4 Other Key Libraries/Tools  
7. Deployment Strategy  
   7.1 Server Configuration (Local Windows)  
   7.2 Deployment Process Overview (Local Windows)  
8. Security Considerations  
   8.1 Authentication  
   8.2 Authorization  
   8.3 Data Protection  
9. Error Handling & Logging Strategy

---

**1\. Introduction**

* **1.1 Purpose:** This document provides a high-level design overview for the VMGMS, translating the requirements specified in the SRS v1.2 (@file:srs\_v1.2.md) into an architectural blueprint. It outlines the major components, their interactions, data structures, and technology choices, with specific details tailored for implementation by an AI development agent.  
* **1.2 Scope:** This HLD covers the design for the core features outlined in the SRS v1.2. Detailed design of individual algorithms or specific UI screen layouts (beyond component choice) is outside the scope of this document.  
* **1.3 Definitions, Acronyms, and Abbreviations:**  
  * VMGMS: Vehicle Maintenance Garage Management System  
  * SRS: Software Requirements Specification  
  * HLD: High-Level Design  
  * API: Application Programming Interface  
  * REST: Representational State Transfer  
  * JSON: JavaScript Object Notation  
  * SPA: Single Page Application  
  * ORM: Object-Relational Mapper  
  * DRF: Django REST Framework  
  * JWT: JSON Web Token  
  * MUI: Material UI (React Component Library)  
  * DAL: Data Access Layer  
  * MVT/MTV: Model-View-Template / Model-Template-View (Django Patterns)  
* **1.4 References:**  
  * SRS VMGMS v1.2 (@file:srs\_v1.2.md)  
  * Best Practices Policy VMGMS v1.0 (@file:best\_practices\_policy.md)  
  * Development Plan VMGMS v1.0 (@file:dev\_plan\_v1.0.md)  
* **1.5 Overview:** Section 2 describes the overall architecture. Section 3 details the major system components. Section 4 outlines component interactions via the API. Section 5 outlines the data design. Sections 6-9 cover the specific technology stack, local deployment strategy, security considerations, and error handling/logging strategies, all framed for AI agent implementation.

**2\. System Architecture**

* **2.1 Architectural Style:** A **Layered Architecture** implemented as:  
  * **Frontend (Presentation):** React Single Page Application (SPA). Handles all UI rendering and user interaction using the Material UI (MUI) library. Communicates exclusively with the Backend via a REST API.  
  * **Backend (Business Logic \+ Data Access):** Django application using **Django REST Framework (DRF)** to provide the REST API. Follows Django's Model-View-Template (MVT) pattern, specifically using DRF Views/ViewSets for API endpoints. Uses the integrated Django ORM for all Data Access.  
  * **Database:** PostgreSQL 16 relational database.  
  * *Justification:* This separation promotes modularity, independent development/testing of frontend and backend, and leverages standard, well-documented frameworks suitable for AI-driven development.

**2.2 Architecture Diagram:**  
      graph LR  
    A\[Browser (React SPA with MUI)\] \-- HTTPS/JSON \--\> B(REST API);  
    B \-- Django Views/Serializers \--\> C{Django Backend (Business Logic)};  
    C \-- Django ORM \--\> D\[(PostgreSQL DB)\];

    subgraph Frontend  
        A  
    end  
    subgraph Backend  
        B  
        C  
        D  
    end

    style B fill:\#f9f,stroke:\#333,stroke-width:2px  
    style C fill:\#ccf,stroke:\#333,stroke-width:2px

*   
   *(Diagram shows React SPA in browser making API calls (JSON over HTTPS) to the Django Backend. The backend uses DRF Views/Serializers to handle requests, implements business logic, and interacts with the PostgreSQL DB via the Django ORM.)*

**3\. Major Components**

* **3.1 Component Summary:** The system is logically divided into the Frontend Application (React) and the Backend Application (Django). The Backend is further divided into multiple Django 'apps' based on domain functionality (e.g., customers, workorders, inventory).  
* **3.2 Component Details:**  
  * **3.2.1 Frontend (React):**  
    * *Responsibility:* Render user interfaces based on application state and user interaction, manage client-side state, handle user input, make asynchronous API calls to the backend, provide visual feedback (loading, errors, success).  
    * *Structure:* Component-based architecture using functional components and Hooks. Organized into folders: pages (top-level route components), components (reusable UI elements), services (API call wrappers), contexts (global state management \- AuthContext), utils (helper functions). Use react-router-dom for routing.  
    * *Key Libraries:* React 18+, react-router-dom, axios, Material UI (@mui/material, @emotion/react, @emotion/styled), React Context API.  
  * **3.2.2 Backend (Django/DRF):**  
    * *Responsibility:* Define the REST API endpoints, handle incoming API requests, authenticate and authorize users, execute business logic (validations, calculations, status transitions), interact with the database via the ORM, serialize data to/from JSON.  
    * *Structure:* Django project (vmgms\_backend) containing functional apps (core, users, customers, vehicles, appointments, workorders, inventory, billing, reports). Each app typically contains: models.py (database schema), views.py (DRF APIViews/ViewSets), serializers.py (DRF ModelSerializers), urls.py (API endpoint routing), tests.py (unit/integration tests). Business logic may reside in views, serializers, model methods, or dedicated services.py modules if complex.  
    * *Key Libraries:* Django 4.x+, Django REST Framework, djangorestframework-simplejwt, psycopg2-binary, django-filter.  
  * **3.2.3 Data Access Layer (DAL) / Django ORM:**  
    * *Responsibility:* Abstract database interactions. Provide an object-oriented way to query and manipulate data. Enforce data integrity at the model level. Translate Python objects to database rows.  
    * *Implementation:* Handled entirely by the **Django ORM**. All database operations MUST use ORM methods (e.g., Model.objects.create(), Model.objects.filter(), instance.save(), instance.delete()). Define models in each app's models.py. Use migrations (makemigrations, migrate) to manage schema changes.  
  * **3.2.4 Database (PostgreSQL):**  
    * *Responsibility:* Persistently store application data. Enforce low-level data constraints (types, uniqueness, relationships via foreign keys). Handle concurrent access and transactions. Provide backup/recovery capabilities.  
    * *Technology:* PostgreSQL version 16\.

**4\. Component Interaction / API Specification**

* **4.1 API Design Philosophy:**  
  * Follow **REST principles** strictly.  
  * Use standard HTTP verbs: GET (retrieve), POST (create), PUT (update/replace), PATCH (partial update), DELETE (remove \- often soft delete).  
  * Stateless: Each request from frontend to backend must contain all necessary information (authentication via JWT token in header).  
  * Use meaningful resource URLs (e.g., /api/customers/, /api/workorders/{id}/).  
  * Use **JSON** for all request and response bodies.  
  * Use standard HTTP status codes for responses (200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 500 Internal Server Error).  
  * Leverage DRF ViewSets, Routers, and Serializers for rapid development of standard CRUD endpoints. Use APIView or @action decorators for custom logic/endpoints.  
  * Implement filtering, searching, and pagination via DRF standard mechanisms (django-filter, SearchFilter, PageNumberPagination).  
* **4.2 Key API Endpoints (Examples \- Full list implied by SRS):**  
  * **Authentication:**  
    * POST /api/token/ (Body: username, password \-\> Response: access, refresh tokens)  
    * POST /api/token/refresh/ (Body: refresh \-\> Response: new access token)  
  * **Customers:** (/api/customers/)  
    * GET / (List, Params: search, page, is\_active)  
    * POST / (Create, Body: Customer data)  
    * GET /{id}/ (Retrieve detail, includes nested vehicles/WO summaries)  
    * PUT /{id}/ (Update, Body: Full Customer data)  
    * PATCH /{id}/ (Partial Update, Body: Fields to update)  
    * DELETE /{id}/ (Deactivate \- sets is\_active=false)  
  * **Vehicles:** (/api/vehicles/) \- Similar CRUD, linked to Customer.  
  * **Appointments:** (/api/appointments/) \- CRUD, filter by date range/technician.  
  * **Work Orders:** (/api/workorders/)  
    * GET / (List, Params: status, technician\_id, customer\_id, search, page)  
    * POST / (Create)  
    * GET /{id}/ (Retrieve detail, nested items)  
    * PATCH /{id}/ (Update status, technician, notes)  
    * POST /{id}/items/ (Add line item \- labor/part)  
    * PUT/PATCH/DELETE /{id}/items/{item\_id}/ (Modify/Remove line item)  
  * **Parts:** (/api/parts/) \- CRUD (Admin), Search (SA/Admin).  
    * POST /{id}/adjust\_stock/ (Admin only, Body: adjustment details)  
  * **Services:** (/api/services/) \- CRUD (Admin), List/Search (SA/Admin).  
  * **Invoices:** (/api/invoices/)  
    * GET / (List, Params: status, customer\_id, date\_range, page)  
    * POST /?workOrderId={id} (Generate from WO)  
    * GET /{id}/ (Retrieve detail, nested items/payments)  
    * PATCH /{id}/ (e.g., Void invoice \- Admin only)  
    * POST /{id}/payments/ (Record payment, Body: payment details)  
  * **Users:** (/api/users/) \- CRUD (Admin only).  
  * **Reports:** (/api/reports/)  
    * GET /sales/?start\_date=...\&end\_date=...  
    * GET /workorders/?status=...\&technician\_id=...  
    * GET /inventory/

**5\. Data Design**

* **5.1 Database Type:** **PostgreSQL 16** (Relational Database Management System \- RDBMS).  
  * *Justification:* Robust, open-source, excellent support for Django ORM features, ACID compliant, suitable for structured data with relationships.  
* **5.2 High-Level Schema / Key Django Models (Conceptual):**  
  *(Defined in models.py within respective Django apps. Referencing @file:srs\_v1.2.md\#DATA-05 and functional requirements for specific fields, types, and constraints)*  
  * users.User(AbstractUser): Extends base user, links to Django Groups for roles.  
  * customers.Customer: name, address, primary\_phone, email (unique), is\_active, timestamps.  
  * vehicles.Vehicle: customer (FK-\>Customer), make, model, year, vin (unique), license\_plate (unique?), is\_active, timestamps.  
  * appointments.Appointment: customer (FK), vehicle (FK), technician (FK-\>User, null), appointment\_time, reason, status (choices).  
  * workorders.WorkOrder: customer (FK), vehicle (FK), technician (FK-\>User, null), status (choices), customer\_complaint, technician\_notes, timestamps.  
  * workorders.WorkOrderItem: work\_order (FK), item\_type (choices), description, quantity, unit\_price, catalog\_part (FK-\>Part, null), catalog\_service (FK-\>Service, null).  
  * inventory.Service: name, description, default\_hours, default\_rate.  
  * inventory.Part: part\_number (unique), description, selling\_price, cost\_price, quantity\_on\_hand.  
  * inventory.StockAdjustmentLog: part (FK), user (FK), adjustment\_amount, new\_qoh, reason, timestamp.  
  * billing.Invoice: work\_order (OneToOne), status (choices), total\_amount, tax\_amount, timestamps.  
  * billing.Payment: invoice (FK), amount, payment\_method (choices), payment\_date.  
  * *Relationships enforced via ORM (ForeignKey, OneToOneField, etc.) translating to DB constraints.*  
  * *Use DecimalField(max\_digits=10, decimal\_places=2) for currency values.*  
  * *Use DateTimeField(auto\_now\_add=True) / DateTimeField(auto\_now=True) for timestamps where appropriate.*

**6\. Technology Stack**

* **6.1 Language(s) & Framework(s):**  
  * *Backend:* **Python 3.10+**, **Django 4.x+**, **Django REST Framework (DRF)**  
  * *Frontend:* **JavaScript (ES6+)**, **React 18+**, **React Router**, **Axios**, **Material UI (MUI)**, **React Context API**  
* **6.2 Database:** **PostgreSQL 16**  
* **6.3 Operating System / Environment:**  
  * *Development:* **Windows**  
  * *Deployment Server (Initial):* **Windows Local Machine**  
*   
* **6.4 Other Key Libraries/Tools:**  
  * *Backend:* psycopg2-binary (Postgres driver), djangorestframework-simplejwt (JWT Auth), django-filter (API filtering).  
  * *Frontend:* npm (package manager), Jest & React Testing Library (testing).  
  * *General:* Git (version control), VS Code (IDE).

**7\. Deployment Strategy**

* **7.1 Server Configuration (Local Windows):**  
  1. Target: Single local Windows machine.  
  2. Requires installation of: Python 3.10+, Node.js LTS, PostgreSQL 16, Git.  
  3. PostgreSQL server must be running and database created/configured.  
* **7.2 Deployment Process Overview (Local Windows):**  
  *(Suitable for development/testing/demo only. Described in detail in README.md)*  
  1. Ensure prerequisites are installed.  
  2. Clone project from Git repository.  
  3. **Backend:**  
     * Navigate to backend directory.  
     * Create/activate Python virtual environment (venv).  
     * Install dependencies: pip install \-r requirements.txt.  
     * Set environment variables (DB credentials, SECRET\_KEY).  
     * Run migrations: python manage.py migrate.  
     * Start backend server (e.g., python manage.py runserver or using waitress-serve).  
  4.   
  5. **Frontend:**  
     * Navigate to frontend directory.  
     * Install dependencies: npm install.  
     * Create production build: npm run build.  
  6.   
  7. **Serving:** Configure Django (settings.py, urls.py) to serve the static files from the frontend build directory OR use a separate simple static file server. Ensure backend API is accessible from the frontend (CORS configuration in Django if needed).  
  8. Access via browser (e.g., http://localhost:8000).

**8\. Security Considerations**

* **8.1 Authentication:** Implement token-based authentication using **DRF Simple JWT**. Frontend stores tokens (e.g., localStorage) and sends them in the Authorization: Bearer \<token\> header. Login API (/api/token/) validates credentials using Django's auth system.  
* **8.2 Authorization:** Implement **Role-Based Access Control (RBAC)** using Django Groups and custom DRF Permission classes (IsAdmin, IsServiceAdvisor, IsTechnician, IsAuthenticated). Apply appropriate permissions to all API ViewSets/Views. Backend logic must always verify permissions before executing actions.  
* **8.3 Data Protection:**  
  * **In Transit:** Use HTTPS (requires setup even for local deployment, e.g., self-signed certificate or configuring a reverse proxy like Caddy/Nginx).  
  * **At Rest:** Protect database credentials. Consider filesystem permissions. Encrypt backups if stored off-machine.  
  * **Input Validation:** Use DRF serializers for rigorous backend validation of all incoming API data. Use frontend validation for better UX.  
  * **SQL Injection:** Prevented by exclusive use of Django ORM.  
  * **XSS:** Prevented by React's default behavior and careful use of MUI. Avoid dangerouslySetInnerHTML.  
  * **CSRF:** Less critical for pure API/SPA, but ensure API accepts only expected content types and potentially check Origin header. If Django serves any forms directly, use standard CSRF protection.  
  * **Secrets:** Manage Django SECRET\_KEY, DB password, JWT keys via environment variables (use libraries like python-dotenv for local development). Do not commit secrets.

**9\. Error Handling & Logging Strategy**

* **Error Handling:**  
  * **Backend:** Use DRF's built-in exception handling, which maps common Django exceptions (ValidationErrors, Http404, PermissionDenied) to appropriate HTTP status codes and JSON error responses. Add custom exception handling if needed for specific business logic errors. Do not expose detailed stack traces in production API responses (Django DEBUG=False).  
  * **Frontend:** Wrap API calls (axios) in try...catch blocks or use promise .catch(). Handle errors gracefully, update UI state (e.g., setError(true)), display user-friendly messages (e.g., using MUI Alert or Snackbar). Log detailed errors to the browser console during development.  
* **Logging:**  
  * **Backend:** Configure Django's logging framework (settings.py LOGGING) to output logs to files (with rotation) or the console. Use different log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL). Log key events (logins, critical actions like invoice generation, stock adjustments) at INFO level. Log all unhandled exceptions at ERROR/CRITICAL level with stack traces (for server logs only, not API responses). Use structured logging (e.g., JSON format) for easier parsing if needed.  
  * **Frontend:** Use console.log, console.warn, console.error appropriately during development. For production, consider integrating a third-party error tracking/logging service (e.g., Sentry, LogRocket) \- outside scope of v1.

