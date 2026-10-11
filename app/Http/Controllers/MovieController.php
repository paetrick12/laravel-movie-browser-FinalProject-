<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\JsonResponse;

class MovieController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Movie::query()->orderBy('id')->get());
    }

    public function show(Movie $movie): JsonResponse
    {
        return response()->json($movie);
    }
}
