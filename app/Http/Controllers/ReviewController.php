<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Movie $movie): JsonResponse
    {
        return response()->json($movie->reviews()->with('user:id,name')->latest('id')->get());
    }

    public function store(Request $request, Movie $movie): JsonResponse
    {
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);
        $review = new Review($data);
        $review->user()->associate($request->user());
        $movie->reviews()->save($review);

        return response()->json([
            'message' => 'Review created successfully.',
            'data' => $review->load('user:id,name'),
        ], 201);
    }

    public function update(Request $request, Review $review): JsonResponse
    {
        abort_unless($review->user_id === $request->user()->id, 403);
        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:1000'],
        ]);
        $review->update($data);

        return response()->json([
            'message' => 'Review updated successfully.',
            'data' => $review->load('user:id,name'),
        ]);
    }

    public function destroy(Request $request, Review $review): JsonResponse
    {
        abort_unless($review->user_id === $request->user()->id, 403);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
