<?php

namespace Tests\Feature;

use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class MovieBrowserPageTest extends TestCase
{
    #[TestWith(['/'])]
    #[TestWith(['/browse'])]
    #[TestWith(['/movie/1'])]
    #[TestWith(['/favorites'])]
    #[TestWith(['/login'])]
    public function test_laravel_serves_react_for_direct_page_requests(string $path): void
    {
        $response = $this->get($path);

        $response->assertOk()
            ->assertSee('Studio Ghibli Movie Browser')
            ->assertSee('id="root"', false)
            ->assertSee('/movie-browser/assets/main-');
    }

    public function test_unknown_api_routes_return_json_404_instead_of_react_html(): void
    {
        $this->getJson('/api/not-a-route')->assertNotFound()->assertJsonStructure(['message']);
    }
}
