# Travel DevOps — Local development and run guide

Quick steps to run the project (Docker compose):

1. Clean previous Docker state (optional but recommended):

   docker-compose down --rmi all --volumes --remove-orphans
   docker system prune -af

2. Build and start (rebuild images):

   docker-compose up --build -d

3. Wait for services to start (Postgres, backend, frontend). Backend will seed cities at startup.

4. Open the frontend in your browser: http://localhost

API notes and test scripts:

- Backend API (default in compose): http://localhost:8081
- Example scripts are in `scripts/`:
  - `scripts/test_api.ps1` — PowerShell helper (Windows). Run in PowerShell:
      .\scripts\test_api.ps1
  - `scripts/test_api.sh` — Bash helper (Linux/macOS/Docker). Make executable and run:
      chmod +x scripts/test_api.sh
      ./scripts/test_api.sh

If you hit HTTP 400 on POST endpoints from curl/PowerShell, use the provided scripts — they avoid common quoting/escaping issues.

How to run without Docker:

- Backend:
  - Install JDK 17 and Maven.
  - cd backend
  - mvn spring-boot:run
- Frontend:
  - Install Node.js 18+
  - cd frontend
  - npm install
  - npm run dev

Notes and troubleshooting:
- The backend seeds ~16 Indian cities at startup. Check logs for "insert into cities" statements.
- If bookings or price calls return 400, ensure Content-Type: application/json is set and that the body is valid JSON. Use the PowerShell or shell script above to avoid quoting issues.

Contact: maintainers in repo.
