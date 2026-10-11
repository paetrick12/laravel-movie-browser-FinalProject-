# Studio Ghibli Movie Browser

The original React + Tailwind Movie Browser is in `frontend/`. The existing Laravel 13 project supplies its MySQL movie data, session authentication, account favorites, and review CRUD.

Start MySQL, then run this from the main Laravel project folder:

```powershell
# Laravel project root
composer run dev
```

Open http://127.0.0.1:8000. This command builds React and starts Laravel; Laravel serves both the application and its API. `npm run dev` from the project root does the same thing.

The React source remains in `frontend/`. When you edit it, restart the root command or run `npm run build` and refresh the browser. If assets are already built, `php artisan serve` alone works too.

Demo login: `user@example.com` / `password123`. A second account, `admin@example.com`, uses the same password and follows the same review ownership rules.

This workspace's dependencies and MySQL migrations/seed data are already installed. For fresh setup, database configuration, every API route, the requirement checklist, manual tests, presentation script, and professor questions, read [PROJECT_GUIDE.md](PROJECT_GUIDE.md).

Checks from the project root:

```powershell
php -d extension=pdo_sqlite vendor/bin/phpunit
npm --prefix frontend run lint
npm --prefix frontend run build
```

The SQLite extension flag enables the existing XAMPP extension only for tests; the running app uses MySQL. The original frontend design and browsing logic are retained.
