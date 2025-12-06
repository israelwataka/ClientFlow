# ClientFlow

ClientFlow is a web-based platform designed to streamline the management of clients, their payments, requests, and associated projects. The system facilitates tracking, communication, and reminders between clients and staff (responsible persons). Admins oversee user access, task progress, and request approvals.

This repository contains a simple MySQL-backed web application implemented with Node.js and Express.

## Tech stack

- Node.js + Express
- EJS templates for server-side rendered views
- Sequelize ORM
- MySQL database

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the database

Create a MySQL database (default name: `clientflow`):

```sql
CREATE DATABASE clientflow CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your local MySQL credentials:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_NAME=clientflow
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
```

### 3. Sync the schema

This will create/update tables in the configured database:

```bash
npm run db:migrate
```

### 4. Start the app

```bash
npm start
```

Then open:

- http://localhost:3000

## Features

- **Dashboard:** high-level counts for clients, projects, requests, and payments.
- **Clients:**
  - Create, edit, delete, and view clients
  - See per-client projects, requests, and payments
- **Projects:**
  - Create projects linked to clients
  - Track status and due date
- **Requests:**
  - Create requests linked to clients and optionally to projects
  - Update status (open, in_review, approved, rejected, closed)
- **Payments:**
  - Track payments per client with amount, currency, due date, and reference
  - Mark payments as paid

This is an intentionally minimal implementation to serve as a foundation. Authentication, notifications, and richer workflows can be layered on top as needed.
