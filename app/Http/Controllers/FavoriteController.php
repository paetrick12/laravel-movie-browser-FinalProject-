<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json($request->user()->favorites()->with('movie')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate(['movie_id' => ['required', 'integer', 'exists:movies,id']]);
        $favorite = $request->user()->favorites()->firstOrCreate($data);

        return response()->json([
            'message' => 'Favorite saved successfully.',
            'data' => $favorite->load('movie'),
        ], $favorite->wasRecentlyCreated ? 201 : 200);
    }

    public function destroy(Request $request, Favorite $favorite): JsonResponse
    {
        abort_unless($favorite->user_id === $request->user()->id, 403);
        $favorite->delete();

        return response()->json(['message' => 'Favorite removed successfully.']);
    }
}
