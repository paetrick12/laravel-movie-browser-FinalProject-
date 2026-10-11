import { useState } from 'react';
import DataState from '../components/DataState';
import MovieGrid from '../components/MovieGrid';

export default function Browse({
  movies,
  loading,
  error,
  retry,
  favorites,
  favoritesLoading,
  toggleFavorite,
}) {
  const [search, setSearch] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');
  const [sort, setSort] = useState('title');

  const directors = [];
  movies.forEach((movie) => {
    if (!directors.includes(movie.director)) {
      directors.push(movie.director);
    }
  });
  directors.sort();

  const searchText = search.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchText) ||
      movie.director.toLowerCase().includes(searchText);
    const matchesDirector =
      selectedDirector === '' || movie.director === selectedDirector;

    return matchesSearch && matchesDirector;
  });
  filteredMovies.sort((a, b) => {
    if (sort === 'newest') {
      return Number(b.release_date) - Number(a.release_date);
    }
    if (sort === 'oldest') {
      return Number(a.release_date) - Number(b.release_date);
    }
    return a.title.localeCompare(b.title);
  });

  function resetFilters() {
    setSearch('');
    setSelectedDirector('');
    setSort('title');
  }

  return (
    <div className="page">
      <p className="eyebrow">
        THE GHIBLI COLLECTION
      </p>
      <h1>Browse movies</h1>
      <p className="max-w-xl text-muted">
        Flying castles, forest spirits, and everyday adventures. Find your next
        film.
      </p>
      <div className="mt-8 mb-5 grid grid-cols-1 gap-5 rounded-xl border border-line bg-soft p-5 md:grid-cols-[2fr_1fr_1fr] md:p-6">
        <label className="input-label">
          Search movies
          <input
            type="search"
            placeholder="Movie title or director"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <label className="input-label">
          Director
          <select
            value={selectedDirector}
            onChange={(event) => setSelectedDirector(event.target.value)}
          >
            <option value="">All directors</option>
            {directors.map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label className="input-label">
          Sort by
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="title">Title A-Z</option>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>
      <DataState loading={loading} error={error} retry={retry} />
      {!loading && !error && (
        <>
          <p className="my-6 text-sm text-muted" role="status">
            {filteredMovies.length} movies found
          </p>
          {filteredMovies.length ? (
            <MovieGrid
              movies={filteredMovies}
              favorites={favorites}
              favoritesLoading={favoritesLoading}
              toggleFavorite={toggleFavorite}
            />
          ) : (
            <div className="state-panel">
              <h2>No movies found</h2>
              <p>Try another title or director.</p>
              <button
                className="button"
                onClick={resetFilters}
              >
                Reset filters
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
