ICS 2609 LAB-ACT 4: Auth + SQL Joins

> Authentication

Protects routes with JWT. All /api/reports/... endpoints require a Bearer Token in the Authorization header.

> SQL Joins

INNER JOIN: Matches records in both tables.

LEFT JOIN: All left table records + matching right table records (NULL if no match).

RIGHT JOIN: All right table records + matching left table records (NULL if no match).

FULL OUTER JOIN: All records from both tables, with NULLs for unmatched rows.

> API Endpoints

All endpoints require a valid JWT token.

Endpoint	Description
GET /api/reports/users-with-roles	Users and their roles (INNER JOIN)
GET /api/reports/users-with-profiles	Users and profiles (LEFT JOIN)
GET /api/reports/roles-with-users	Roles with users (RIGHT JOIN)
GET /api/reports/users-profiles-roles	Combined user, profile, and role data (multi-join)
GET /api/reports/users-full-join	All users and roles (FULL OUTER JOIN)

> How to Run
# Install dependencies
npm install

# Start server
npm run dev


Default server: http://localhost:3000

Health check: GET /api/health
