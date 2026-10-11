<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(MovieSeeder::class);

        if (app()->environment('local', 'testing')) {
            User::firstOrCreate(['email' => 'user@example.com'], [
                'name' => 'Demo User', 'password' => 'password123',
            ]);
            $admin = User::firstOrCreate(['email' => 'admin@example.com'], [
                'name' => 'Demo Admin', 'password' => 'password123',
            ]);
            if ($admin->wasRecentlyCreated) {
                $admin->role = 'admin';
                $admin->save();
            }
        }
    }
}
