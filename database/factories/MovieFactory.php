<?php

namespace Database\Factories;

use App\Models\Movie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Movie>
 */
class MovieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ghibli_id' => fake()->uuid(),
            'title' => 'My Neighbor Totoro',
            'original_title' => 'となりのトトロ',
            'description' => 'Two sisters meet forest spirits.',
            'director' => 'Hayao Miyazaki',
            'producer' => 'Hayao Miyazaki',
            'release_date' => 1988,
            'running_time' => 86,
            'rt_score' => 93,
        ];
    }
}
