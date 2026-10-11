<?php

namespace Tests\Feature;

use App\Models\Movie;
use App\Models\Review;
use App\Models\User;
use Database\Seeders\MovieSeeder;
use Illuminate\Foundation\Testing\LazilyRefreshDatabase;
use Illuminate\Support\Facades\Hash;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class MovieBrowserTest extends TestCase
{
    use LazilyRefreshDatabase;

    public function test_guests_can_read_movies_and_movie_details(): void
    {
        $movie = Movie::factory()->create();

        $this->getJson('/api/movies')->assertOk()->assertJsonPath('0.title', 'My Neighbor Totoro');
        $this->getJson("/api/movies/{$movie->id}")->assertOk()->assertJsonPath('original_title', 'となりのトトロ');
        $this->getJson('/api/movies/9999')->assertNotFound();
    }

    public function test_guests_can_read_reviews_without_private_user_fields(): void
    {
        $movie = Movie::factory()->create();
        $owner = User::factory()->create();
        $review = new Review(['rating' => 5, 'comment' => 'A lovely story.']);
        $review->user()->associate($owner);
        $movie->reviews()->save($review);

        $this->getJson("/api/movies/{$movie->id}/reviews")
            ->assertOk()->assertJsonPath('0.user.name', $owner->name)
            ->assertJsonPath('0.comment', 'A lovely story.')
            ->assertJsonMissingPath('0.user.email')->assertJsonMissingPath('0.user.password');
    }

    public function test_guests_receive_401_for_protected_actions(): void
    {
        $movie = Movie::factory()->create();

        $this->getJson('/api/user')->assertUnauthorized();
        $this->getJson('/api/favorites')->assertUnauthorized();
        $this->postJson('/api/favorites', ['movie_id' => $movie->id])->assertUnauthorized();
        $this->postJson("/api/movies/{$movie->id}/reviews", ['rating' => 4, 'comment' => 'Nice'])->assertUnauthorized();
        $this->putJson('/api/reviews/1', ['rating' => 4, 'comment' => 'Nice'])->assertUnauthorized();
        $this->deleteJson('/api/reviews/1')->assertUnauthorized();
        $this->deleteJson('/api/favorites/1')->assertUnauthorized();
        $this->postJson('/api/logout')->assertUnauthorized();
        $this->assertDatabaseCount('reviews', 0);
        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_registration_hashes_password_and_ignores_submitted_role(): void
    {
        $response = $this->withHeader('Origin', 'http://127.0.0.1:8000')->postJson('/api/register', [
            'name' => 'New Student', 'email' => 'student@example.com',
            'password' => 'password123', 'password_confirmation' => 'password123',
            'role' => 'admin',
        ]);

        $response->assertCreated()->assertJsonPath('data.role', 'user')->assertJsonMissingPath('data.password');
        $user = User::where('email', 'student@example.com')->firstOrFail();
        $this->assertTrue(Hash::check('password123', $user->password));
        $this->assertAuthenticatedAs($user, 'web');
    }

    public function test_registration_requires_fields_and_matching_passwords(): void
    {
        $this->withHeader('Origin', 'http://127.0.0.1:8000')->postJson('/api/register', [])
            ->assertUnprocessable()->assertJsonValidationErrors(['name', 'email', 'password']);
        $this->postJson('/api/register', [
            'name' => 'Student', 'email' => 'student@example.com',
            'password' => 'password123', 'password_confirmation' => 'different',
        ])->assertUnprocessable()->assertJsonValidationErrors('password');
        $this->assertDatabaseCount('users', 0);
    }

    public function test_registration_rejects_duplicate_email_and_short_password(): void
    {
        User::factory()->create(['email' => 'existing@example.com']);

        $this->withHeader('Origin', 'http://127.0.0.1:8000')->postJson('/api/register', [
            'name' => 'Student', 'email' => 'existing@example.com',
            'password' => 'short', 'password_confirmation' => 'short',
        ])->assertUnprocessable()->assertJsonValidationErrors(['email', 'password']);
        $this->assertDatabaseCount('users', 1);
    }

    public function test_login_returns_current_user_and_logout_ends_session(): void
    {
        $user = User::factory()->create(['password' => 'password123']);

        $this->withHeader('Origin', 'http://127.0.0.1:8000')->postJson('/api/login', [
            'email' => $user->email, 'password' => 'password123',
        ])->assertOk()->assertJsonPath('data.id', $user->id)->assertJsonMissingPath('data.password');
        $this->getJson('/api/user')->assertOk()->assertJsonPath('id', $user->id);
        $this->postJson('/api/logout')->assertOk()->assertJsonPath('message', 'Logged out successfully.');
        $this->assertGuest('web');
    }

    public function test_bad_login_returns_validation_message(): void
    {
        $user = User::factory()->create();

        $this->withHeader('Origin', 'http://127.0.0.1:8000')->postJson('/api/login', [
            'email' => $user->email, 'password' => 'wrong-password',
        ])->assertUnprocessable()->assertJsonPath('errors.email.0', 'These credentials do not match our records.');
        $this->assertGuest();
    }

    public function test_favorites_belong_to_current_user_and_duplicates_are_prevented(): void
    {
        $movie = Movie::factory()->create();
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $otherUser->favorites()->create(['movie_id' => $movie->id]);
        $this->actingAs($user);

        $response = $this->postJson('/api/favorites', ['movie_id' => $movie->id, 'user_id' => $otherUser->id]);
        $response->assertCreated()->assertJsonPath('data.user_id', $user->id);
        $this->postJson('/api/favorites', ['movie_id' => $movie->id])->assertOk();
        $this->getJson('/api/favorites')->assertOk()->assertJsonCount(1)->assertJsonPath('0.movie.title', $movie->title);
        $this->assertDatabaseCount('favorites', 2);
        $this->deleteJson('/api/favorites/'.$response->json('data.id'))->assertOk();
        $this->assertDatabaseMissing('favorites', ['user_id' => $user->id]);
        $this->assertDatabaseHas('favorites', ['user_id' => $otherUser->id]);
    }

    public function test_invalid_favorite_returns_422_without_inserting_record(): void
    {
        $this->actingAs(User::factory()->create());

        $this->postJson('/api/favorites', ['movie_id' => 9999])
            ->assertUnprocessable()->assertJsonValidationErrors('movie_id');
        $this->postJson('/api/favorites', [])->assertUnprocessable()->assertJsonValidationErrors('movie_id');
        $this->assertDatabaseCount('favorites', 0);
    }

    public function test_other_users_favorites_cannot_be_deleted(): void
    {
        $movie = Movie::factory()->create();
        $owner = User::factory()->create();
        $favorite = $owner->favorites()->create(['movie_id' => $movie->id]);

        $this->actingAs(User::factory()->create())->deleteJson("/api/favorites/{$favorite->id}")->assertForbidden();
        $this->assertModelExists($favorite);
    }

    public function test_review_crud_persists_changes_and_ignores_forged_ownership(): void
    {
        $movie = Movie::factory()->create();
        $user = User::factory()->create();
        $otherUser = User::factory()->create();
        $this->actingAs($user);

        $response = $this->postJson("/api/movies/{$movie->id}/reviews", [
            'rating' => 5, 'comment' => 'A wonderful film.', 'user_id' => $otherUser->id, 'movie_id' => 9999,
        ]);
        $response->assertCreated()->assertJsonPath('data.user_id', $user->id)->assertJsonPath('data.movie_id', $movie->id);
        $reviewId = $response->json('data.id');
        $this->assertDatabaseHas('reviews', ['id' => $reviewId, 'user_id' => $user->id, 'rating' => 5]);
        $this->putJson("/api/reviews/{$reviewId}", [
            'rating' => 4, 'comment' => 'Updated opinion.', 'user_id' => $otherUser->id, 'movie_id' => 9999,
        ])->assertOk()->assertJsonPath('data.comment', 'Updated opinion.');
        $this->assertDatabaseHas('reviews', ['id' => $reviewId, 'rating' => 4, 'user_id' => $user->id, 'movie_id' => $movie->id]);
        $this->deleteJson("/api/reviews/{$reviewId}")->assertOk();
        $this->assertDatabaseMissing('reviews', ['id' => $reviewId]);
    }

    public function test_another_user_cannot_edit_or_delete_review(): void
    {
        $movie = Movie::factory()->create();
        $owner = User::factory()->create();
        $review = new Review(['rating' => 5, 'comment' => 'Original comment.']);
        $review->user()->associate($owner);
        $movie->reviews()->save($review);
        $this->actingAs(User::factory()->create());

        $this->putJson("/api/reviews/{$review->id}", ['rating' => 1, 'comment' => 'Changed'])->assertForbidden();
        $this->deleteJson("/api/reviews/{$review->id}")->assertForbidden();
        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'rating' => 5, 'comment' => 'Original comment.']);
    }

    public static function invalidReviews(): array
    {
        return [
            'required rating' => ['', 'Valid comment', 'rating', 'The rating field is required.'],
            'integer rating' => [1.5, 'Valid comment', 'rating', 'The rating field must be an integer.'],
            'rating minimum' => [0, 'Valid comment', 'rating', 'The rating field must be at least 1.'],
            'rating maximum' => [6, 'Valid comment', 'rating', 'The rating field must not be greater than 5.'],
            'required comment' => [4, '', 'comment', 'The comment field is required.'],
            'string comment' => [4, ['invalid'], 'comment', 'The comment field must be a string.'],
            'comment length' => [4, str_repeat('a', 1001), 'comment', 'The comment field must not be greater than 1000 characters.'],
        ];
    }

    #[DataProvider('invalidReviews')]
    public function test_invalid_reviews_return_422_without_writing(mixed $rating, mixed $comment, string $field, string $message): void
    {
        $movie = Movie::factory()->create();
        $owner = User::factory()->create();
        $this->actingAs($owner);

        $this->postJson("/api/movies/{$movie->id}/reviews", compact('rating', 'comment'))
            ->assertUnprocessable()->assertJsonPath("errors.{$field}.0", $message);
        $this->assertDatabaseCount('reviews', 0);
    }

    public function test_invalid_update_keeps_original_review(): void
    {
        $movie = Movie::factory()->create();
        $owner = User::factory()->create();
        $review = new Review(['rating' => 5, 'comment' => 'Keep this.']);
        $review->user()->associate($owner);
        $movie->reviews()->save($review);

        $this->actingAs($owner)->putJson("/api/reviews/{$review->id}", ['rating' => 6, 'comment' => 'Changed'])
            ->assertUnprocessable()->assertJsonValidationErrors('rating');
        $this->assertDatabaseHas('reviews', ['id' => $review->id, 'rating' => 5, 'comment' => 'Keep this.']);
    }

    public function test_movie_seeder_is_repeatable_and_keeps_original_ui_fields(): void
    {
        $this->seed(MovieSeeder::class);
        $this->seed(MovieSeeder::class);

        $this->assertDatabaseCount('movies', 22);
        $this->assertDatabaseHas('movies', ['title' => 'My Neighbor Totoro', 'original_title' => 'となりのトトロ']);
        $this->assertNotEmpty(Movie::where('title', 'My Neighbor Totoro')->firstOrFail()->movie_banner);
    }
}
