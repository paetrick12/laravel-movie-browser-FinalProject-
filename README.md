# Studio Ghibli Movie Browser

A full-stack Studio Ghibli Movie Browser built with React, Tailwind CSS, Laravel, and MySQL. Users can browse movies, search, filter, sort, register, log in, save favorites, and create, update, or delete their own reviews.

## Requirements

Install the following before running the project:

- PHP 8.3 or newer
- Composer
- Node.js and npm
- MySQL, such as XAMPP MySQL

## Installation

Open a terminal in the main project folder and install the Laravel dependencies:

```powershell
composer install
```

Install the React frontend dependencies:

```powershell
cd frontend
npm install
cd ..
```

Create the Laravel environment file and application key:

```powershell
Copy-Item .env.example .env
php artisan key:generate
```

Start MySQL. In phpMyAdmin, create an empty database. The default name is:

```text
finaltermlaravel
```

Open `.env` in the main project folder and set the database values to match your local MySQL setup. For a standard XAMPP installation, use:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=finaltermlaravel
DB_USERNAME=root
DB_PASSWORD=
```

If you use a different database name, create that database in phpMyAdmin and use the same name for `DB_DATABASE`.

Create the tables and insert the movie seed data:

```powershell
php artisan migrate --seed
```

Build the React frontend:

```powershell
npm run build
```

## Run the application

From the main project folder, run:

```powershell
composer run dev
```

Open the application at:

```text
http://127.0.0.1:8000
```

`composer run dev` builds the React frontend and starts the Laravel server. Do not run it inside the `frontend` folder.

## Demo accounts

After running the database seeder, these local demo accounts are available:

| Account | Email | Password |
| --- | --- | --- |
| Normal user | `user@example.com` | `password123` |
| Admin role | `admin@example.com` | `password123` |

The admin role does not have a separate dashboard. Review ownership rules apply to every account.

## Project structure

```text
app/          Laravel controllers and Eloquent models
database/     Migrations, seeders, factories, and movie data
frontend/     React and Tailwind source code
routes/       Laravel web and API routes
resources/    Laravel view that loads the React application
tests/        Automated tests
```

## Useful commands

Build the frontend after changing React files:

```powershell
npm run build
```

Run the backend test suite:

```powershell
php -d extension=pdo_sqlite vendor/bin/phpunit
```

Run the frontend linter:

```powershell
npm --prefix frontend run lint
```
