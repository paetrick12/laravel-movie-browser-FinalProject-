<?php

use Illuminate\Support\Facades\Route;

Route::view('/', 'movie-browser')->name('home');
Route::view('/{path}', 'movie-browser')
    ->where('path', '(?!api(?:/|$)|sanctum(?:/|$)|movie-browser(?:/|$)).*');
