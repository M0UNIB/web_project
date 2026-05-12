# Personal Notes Project

This workspace contains the complete project requested in the PDF brief:

- `backend`: Laravel API with Sanctum token authentication and notes CRUD
- `frontend`: React 18 SPA with protected routes, Axios calls, responsive UI, search, and priority filtering

## Tech stack

- Laravel 12 API with Sanctum
- React 18 + Vite
- MySQL via XAMPP / phpMyAdmin

## Demo account

- Email: `demo@example.com`
- Password: `password123`

## Backend setup

```bash
cd backend
copy .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

The API runs on `http://127.0.0.1:8000`.

## XAMPP database setup

1. Start `Apache` and `MySQL` in XAMPP.
2. Open phpMyAdmin and create a database named `personal_notes`.
3. Keep the default local credentials:
   - Host: `127.0.0.1`
   - Port: `3306`
   - Username: `root`
   - Password: empty by default in many XAMPP installs
4. Run the backend migration command to create the tables:

```bash
cd backend
php artisan migrate:fresh --seed
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on `http://127.0.0.1:5173` and proxies `/api` requests to Laravel.

## Main features

- User registration, login, and logout with Sanctum bearer tokens
- Private `/notes` page protected on the client side
- Create, list, update, and delete personal notes without page reloads
- Validation feedback and API error handling for 401, 404, and 422 responses
- Priority badges, readable dates, responsive layout, search, and priority filter
