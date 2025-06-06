**\#\# Best Practices Policy for VMGMS AI Agent (v1.0)**

\*\*Based on SRS v1.2 and Standard Development Principles\*\*

This document outlines the best practices the AI development agent must adhere to while building the Vehicle Maintenance Garage Management System (VMGMS). Compliance with these practices is mandatory, as referenced in SRS 2.4 and NFR-MAIN-05.

\*\*1. General Principles:\*\*  
    \*   \*\*SRS Adherence:\*\* All development must strictly follow the requirements outlined in \`srs\_v1.1 (1).md\`. If a prompt seems to conflict with the SRS, prioritize the SRS or seek clarification.  
    \*   \*\*Explicitness (Constraint 2.4):\*\* Implement features exactly as prompted. Avoid making assumptions beyond the provided context or SRS. If ambiguity exists, it should be flagged.  
    \*   \*\*Modularity:\*\*  
        \*   \*\*Backend:\*\* Create separate Django apps for major features (e.g., \`users\`, \`customers\`, \`vehicles\`, \`appointments\`, \`workorders\`, \`inventory\`, \`invoicing\`, \`reports\`, \`services\`). Each app should contain its own \`models.py\`, \`serializers.py\`, \`views.py\`, \`urls.py\`, \`admin.py\`, and \`tests.py\`.  
        \*   \*\*Frontend:\*\* Create modular React components. Group components by feature (e.g., \`src/features/customers/components/CustomerForm.js\`). Utilize shared components for common UI elements (e.g., \`src/components/ui/StyledButton.js\`).  
    \*   \*\*Readability & Simplicity:\*\* Write clear, concise, and understandable code. Avoid overly complex logic where simpler alternatives exist.

\*\*2. Backend (Django/Python):\*\*  
    \*   \*\*Style:\*\* Adhere strictly to PEP 8 style guidelines. Use a linter like Flake8 (configuration will be provided or assume defaults).  
    \*   \*\*ORM Usage (SW-02):\*\* Use the Django ORM exclusively for database interactions. Avoid raw SQL queries unless explicitly instructed for a highly specific, optimized reason.  
    \*   \*\*Models (DATA-05):\*\* Define models in \`models.py\` for each app. Use appropriate Django model fields. Implement \`\_\_str\_\_\` methods for all models for better readability in Django Admin and debugging.  
    \*   \*\*Serializers (DRF):\*\* Use Django REST Framework (DRF) serializers (\`serializers.py\`) for data validation and representation. Define explicit fields. Implement \`validate\_\<field\_name\>\` methods for custom validation logic.  
    \*   \*\*Views (DRF):\*\* Use DRF ViewSets (e.g., \`ModelViewSet\`) or generic APIViews (\`APIView\`, \`ListCreateAPIView\`, etc.) in \`views.py\`. Keep view logic focused on request/response handling and business logic orchestration. Complex business logic should be in service layers or model methods if appropriate.  
    \*   \*\*URLs:\*\* Define API endpoints in \`urls.py\` within each app and include them in the project's main \`urls.py\`. Use consistent naming conventions for URL paths (e.g., \`/api/v1/customers/\`, \`/api/v1/customers/\<int:pk\>/\`).  
    \*   \*\*Authentication & Permissions (NFR-SEC-01, NFR-SEC-03, FR-USER-200):\*\*  
        \*   Use JWT for authentication (e.g., \`djangorestframework-simplejwt\`).  
        \*   Implement robust permission classes (custom if necessary, building on DRF's \`BasePermission\`) for all API endpoints to enforce RBAC.  
    \*   \*\*Database (DATA-02, NFR-REL-04):\*\*  
        \*   Ensure all database relationships (ForeignKey, OneToOneField, ManyToManyField) are correctly defined with appropriate \`on\_delete\` behavior (e.g., \`models.PROTECT\` or \`models.SET\_NULL\` where appropriate, avoid \`models.CASCADE\` on User FKs if soft deletes are preferred for data integrity).  
        \*   Use \`django.db.transaction.atomic\` for operations that involve multiple database writes to ensure atomicity (e.g., creating an invoice and updating WO status).  
        \*   Generate and apply database migrations for any model changes (\`python manage.py makemigrations\` & \`python manage.py migrate\`).  
    \*   \*\*Error Handling:\*\* Implement comprehensive error handling. Return appropriate HTTP status codes (e.g., 400 for bad request, 401 for unauthorized, 403 for forbidden, 404 for not found, 500 for server errors). API error responses should be in a consistent JSON format (DRF default is good).  
    \*   \*\*Security (NFR-SEC):\*\*  
        \*   Store passwords securely using Django's default hashing.  
        \*   Protect against common web vulnerabilities (ORM helps with SQLi, DRF with CSRF for APIs. Be mindful of XSS if serving Django templates, though primary frontend is React).  
        \*   Do not hardcode sensitive data (use environment variables via \`python-decouple\` or similar).  
    \*   \*\*Comments & Docstrings (NFR-MAIN-02):\*\* Write clear docstrings for all modules, classes, and functions. Use inline comments for complex or non-obvious logic.  
    \*   \*\*Testing (NFR-TEST):\*\* Write unit tests for models, serializers, views, and any complex logic using Django's testing framework or \`pytest\`.

\*\*3. Frontend (React/JavaScript/MUI):\*\*  
    \*   \*\*Style:\*\* Adhere to common JavaScript/React best practices. Use ESLint and Prettier (configurations will be provided or assume defaults).  
    \*   \*\*Component Structure:\*\*  
        \*   Organize components by feature.  
        \*   Separate presentational (dumb) components from container (smart) components where appropriate.  
        \*   Use functional components with Hooks.  
    \*   \*\*MUI Usage (UI-04, NFR-USAB-01):\*\* Use Material UI (MUI) components exclusively for all UI elements. Strive for consistency in look, feel, and layout.  
    \*   \*\*State Management (Constraint 2.4):\*\* Use React Context API for global state management (e.g., authenticated user, roles). Use component local state (\`useState\`) for form data and UI-specific state.  
    \*   \*\*API Interaction (SW-01):\*\*  
        \*   Use \`axios\` or \`fetch\` for API calls. Create a centralized API service/module (e.g., \`src/services/api.js\`) to handle base URL, headers (including JWT), and error handling.  
        \*   All communication with the backend MUST be via the RESTful API.  
    \*   \*\*Forms:\*\*  
        \*   Use controlled components for forms.  
        \*   Implement client-side validation (FR-CUST-105) for immediate feedback, but always rely on server-side validation as the source of truth.  
        \*   Display validation errors clearly next to the respective fields.  
    \*   \*\*Routing:\*\* Use \`react-router-dom\` for client-side routing.  
    \*   \*\*Error Handling (NFR-USAB-03):\*\* Display user-friendly error messages for API errors or unexpected issues. Avoid showing raw error objects to the user.  
    \*   \*\*Security (NFR-SEC-04):\*\*  
        \*   Be mindful of XSS: React's JSX anMUI components generally mitigate this, but avoid \`dangerouslySetInnerHTML\`.  
        \*   Store JWTs securely (e.g., \`localStorage\` or \`sessionStorage\` for simplicity in this context, though HttpOnly cookies are more secure for production web apps, this might be out of scope for local agent-driven dev).  
        \*   Implement route guards to protect routes based on authentication status and roles.  
    \*   \*\*Comments & Docstrings (NFR-MAIN-02):\*\* Use JSDoc-style comments for component props and complex functions.  
    \*   \*\*Loading States (NFR-USAB-04):\*\* Show loading indicators (e.g., MUI \`CircularProgress\`) during API calls.  
    \*   \*\*Testing (NFR-TEST):\*\* Write unit tests for components and utility functions using Jest and React Testing Library. Test component rendering, user interactions, and state changes.

\*\*4. Version Control (Git):\*\*  
    \*   Commit code frequently with clear, descriptive messages.  
    \*   Each prompt completion should ideally result in one or more related commits.  
    \*   Do not commit sensitive information (e.g., \`SECRET\_KEY\`, database passwords). Use a \`.gitignore\` file appropriately (standard Django/React \`.gitignore\` files are a good start).

\*\*5. Configuration (NFR-MAIN-04):\*\*  
    \*   Avoid hardcoding values. Use environment variables for backend settings (Django \`settings.py\`) and React build-time environment variables or a config file for frontend settings (e.g., API base URL).

\*\*6. Communication & Iteration:\*\*  
    \*   The AI agent will execute prompts sequentially.  
    \*   After each prompt, the AI will perform the specified tests. If tests fail, the AI should attempt to debug and fix the code related to the current prompt.

By adhering to these best practices, the AI agent will produce a VMGMS that is robust, maintainable, secure, and aligns with the specified requirements.

\---

Now, for the prompts. This will be a long list, broken down into phases. I will generate the first few phases to give you a good start.

\*\*Important Notes for the AI Agent (Copilot Plus):\*\*

\*   \*\*Follow Prompts Exactly:\*\* Execute the instructions in each prompt precisely.  
\*   \*\*Refer to SRS:\*\* The SRS (Software Requirements Specification v1.2) is your primary source of truth for feature details.  
\*   \*\*Use Best Practices:\*\* Adhere to the "Best Practices Policy for VMGMS AI Agent (v1.0)" document.  
\*   \*\*Iterative Development:\*\* You will build the application feature by feature. Ensure each step is complete and tested before moving to the next.  
\*   \*\*Code Examples:\*\* If code examples are provided, they are illustrative. Adapt them to the specific context and best practices. \*\*DO NOT COPY-PASTE BLINDLY.\*\*  
\*   \*\*File Paths:\*\* Suggested file paths are conventions. If your project structure differs slightly but logically, adapt as needed, maintaining consistency.  
\*   \*\*Testing:\*\* After implementing each prompt, \*\*YOU MUST\*\* perform the specified tests. If any test fails, debug and fix the issue before considering the prompt complete.  
