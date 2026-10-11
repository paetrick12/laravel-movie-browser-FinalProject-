<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="theme-color" content="#f7f8f2">
        <meta name="description" content="Explore Studio Ghibli movies, read their stories, and save your favorites.">
        <link rel="icon" type="image/png" href="{{ asset('movie-browser/studio-ghibli-symbol.png') }}">
        <title>Studio Ghibli Movie Browser</title>
        {{ Vite::useHotFile(public_path('movie-browser.hot'))->withEntryPoints(['src/main.jsx'])->useBuildDirectory('movie-browser') }}
    </head>
    <body>
        <div id="root"></div>
    </body>
</html>
