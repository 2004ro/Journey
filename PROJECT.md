# PROJECT REPORT
(Project Term January–May 2026)

TITLE: JourneyGenie — Containerized Transport Booking System

Submitted by

RONAK	Registration Number : 12314910

Course Code: INT-332

Under the Guidance of

Mrs. Jatinder Kaur
School of Computer Science and Engineering


## DECLARATION
I hereby declare that the project work entitled JourneyGenie is an authentic record of my own work carried out as requirements of Project for the award of B.Tech Degree in Computer Science And Engineering from Lovely Professional University, Phagwara, under the guidance of Mrs. Jatinder Kaur, during January to May 2026. All the information furnished in this project report is based on my own intensive work and is genuine.

Name of Student: Ronak  
Registration Number: 12314910

(Signature of Student)  
Date: May 21, 2026


## CERTIFICATE
This is to certify that the declaration statement made by the student is correct to the best of my knowledge and belief. He has completed this Project under my guidance and supervision. The present work is the result of his original investigation, effort and study. No part of the work has ever been submitted for any other degree at any University. The Project is fit for submission and partial fulfillment of the conditions for the award of B.Tech Degree in Computer Science and Engineering from Lovely Professional University, Phagwara.

(Signature and Name of the Mentor)  
Designation  
School of Computer Science and Engineering, Lovely Professional University, Phagwara, Punjab.

Date:


## ACKNOWLEDGEMENT
I would like to express my profound gratitude to my mentor, Mrs. Jatinder Kaur, for continuous support, technical guidance, and encouragement throughout the development of this project. I also extend thanks to the School of Computer Science and Engineering at Lovely Professional University for providing the necessary infrastructure and environment to successfully complete this microservices-based CI/CD implementation.


## TABLE OF CONTENTS
- Declaration
- Certificate
- Acknowledgement
- Table of Contents
- 1. Introduction
- 2. Existing System
- 3. Problem Analysis
- 4. Software Requirement Analysis
- 5. Design
- 6. Testing
- 7. Implementation and Deployment
- 8. Project Legacy
- 9. Bibliography


## 1. INTRODUCTION
JourneyGenie is a state-of-the-art, full-stack Transport Booking System built using modern web frameworks, containerized deployment (Docker), and automated CI/CD pipelines. The system provides a responsive Single Page Application (React) frontend, a RESTful Spring Boot backend (Java 17), and PostgreSQL for persistent storage. The application demonstrates a three-step booking flow, server-side price calculation (based on geographic distance), booking persistence across sessions, and DevOps automation.


### 1.1 Scope and Problem Statement
The project aims to replace legacy monolithic booking systems with a modular architecture that provides:
- Responsive user experience (SPA) for booking journeys.
- Reliable persistence of bookings across logins/logouts.
- Server-side price calculation using geographic distance between seeded cities.
- Containerized deployment enabling consistent environments for dev/test/prod.
- CI/CD pipelines for automated build, test, and deployment.


## 2. EXISTING SYSTEM
Legacy systems often combine UI rendering, business logic and DB access in one process causing low fault-tolerance and difficult upgrades. JourneyGenie separates concerns across frontend, backend, and database, communicating over REST APIs and running in isolated containers.


## 3. PROBLEM ANALYSIS
Key functional objectives implemented in this project:
- User authentication (demo/local signup currently; server-side auth is a planned next step).
- Multi-step booking UI: Journey Details → Seat Selection → Passenger Details.
- City database seeded at startup (Indian cities with lat/lon) and a price endpoint that uses haversine distance and transport-type multipliers.
- Bookings persisted in PostgreSQL and retrieved by user email (email normalized to lowercase).
- Dashboard shows booking history; cancellation endpoint available.


## 4. SOFTWARE REQUIREMENTS
Backend:
- Java 17 (Eclipse Temurin)
- Spring Boot 3.2.3
- Spring Data JPA, PostgreSQL driver
- Maven build (Apache Maven)

Frontend:
- React (Vite)
- Axios, React Router
- Nginx (for production static serving)

Infrastructure / DevOps:
- Docker, Docker Compose
- Jenkins (Jenkinsfile present)
- GitHub (repository)
- Optional: GitHub Actions (CI), see repository for workflows


## 5. DESIGN
High level architecture:
- Frontend (React + Vite) served by NGINX in `travel_frontend` container (port 80).
- Backend (Spring Boot) in `travel_backend` container (internal port 8080, host mapped 8081).
- PostgreSQL `travel_db` container (5432) with persistent volume `pgdata`.

Container network: `travel_network` (bridge)

Sequence diagram (conceptual):
User → Frontend → Backend → PostgreSQL


### 5.1 Data model (Ticket table - highlights)
- id: bigint, auto-increment
- type: string (BUS/TRAIN/FLIGHT)
- source, destination: stored as IDs or names
- sourceName, destinationName: human-readable names (persisted)
- date, status, userEmail, price, passengerName, passengerAge


## 6. TESTING
Functional and integration testing performed manually and with lightweight scripts during development.
Key endpoints verified:
- POST /api/cities (seeded data available via GET /api/cities)
- POST /api/cities/price — returns price and currency (INR)
- POST /api/bookings/book — persists ticket
- GET /api/bookings/user/{email} — returns bookings for the given user
- PUT /api/bookings/cancel/{id} — cancels a booking

(Insert functional test screenshots at places marked below.)


## 7. IMPLEMENTATION AND DEPLOYMENT
Project root contains:
- `backend/` — Spring Boot application (Maven)
- `frontend/` — React (Vite) app
- `docker-compose.yml` — orchestration manifest
- `Dockerfile` / `Dockerfile.jenkins` / `Jenkinsfile` — automation and CI

Important commands to run locally (paste screenshot after running each):

1) Build and run containers (development)

```bash
# from project root
docker-compose up --build -d
```

Paste screenshot: <<SS: docker-compose-up>>

2) Stop and remove containers (preserve volume):

```bash
docker-compose down
```

Paste screenshot: <<SS: docker-compose-down>>

3) Backend build (local / CI uses Maven):

```bash
cd backend
mvn clean package
```

Paste screenshot: <<SS: maven-build>>


### 7.1 Jenkins & CI
- `Jenkinsfile` (in repo root) defines pipeline steps to build backend (Maven), build frontend, build Docker images and deploy via docker-compose. In the report place a screenshot of the Jenkins pipeline run where indicated.

Paste screenshot: <<SS: jenkins-pipeline>>

Notes to paste next to screenshot: branch name, pipeline duration, any failed/unstable steps.


### 7.2 Docker and Images
- Backend Dockerfile: multi-stage Maven build → final image with Eclipse Temurin JRE; exposes 8080.
- Frontend Dockerfile: builds static assets with Node and serves with NGINX; exposes 80.

Paste screenshot: <<SS: docker-images-list>> (output of `docker images`)


### 7.3 GitHub / CI Workflow
- Repository: https://github.com/2004ro/Journey
- A Git push triggers CI. If using GitHub Actions, include the action run screenshot here.

Paste screenshot: <<SS: github-actions-run>>


## 8. PROJECT LEGACY AND FUTURE WORK
Completed:
- Three-step booking flow implemented and wired to backend.
- Indian cities seeded at startup; server-side distance-based pricing implemented.
- Bookings persist in PostgreSQL and survive logout/login.
- Profile UI improved and currency normalized to INR across UI.

Planned / To-do:
- Implement server-side user accounts with secure password storage and JWT-based authentication.
- Add automated integration tests and include them in CI pipeline.
- Harden production config (CORS, secrets management, remove demo localStorage auth).
- Add e2e tests (Cypress) and monitoring (Prometheus/Grafana) for observability.


## 9. BIBLIOGRAPHY
- Spring Boot Reference Guide — https://spring.io/projects/spring-boot
- React Documentation — https://react.dev/
- Docker Documentation — https://docs.docker.com/
- Project Repository — https://github.com/2004ro/Journey


---

Appendix: Where to paste screenshots for submission
- After `docker-compose up --build -d` → <<SS: docker-compose-up>>
- After successful `mvn package` → <<SS: maven-build>>
- Jenkins pipeline run view → <<SS: jenkins-pipeline>>
- GitHub Actions run (if used) → <<SS: github-actions-run>>
- Dashboard booking history showing persisted booking → <<SS: booking-history>>



