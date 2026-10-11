<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $movies = json_decode(file_get_contents(database_path('data/ghibli-movies.json')), true, 512, JSON_THROW_ON_ERROR);
        foreach ($movies as $movie) {
            $data = Arr::only($movie, [
                'title', 'original_title', 'description', 'director', 'producer',
                'release_date', 'running_time', 'rt_score', 'image', 'movie_banner',
            ]);
            Movie::updateOrCreate(['ghibli_id' => $movie['id']], $data);
        }
    }
}
