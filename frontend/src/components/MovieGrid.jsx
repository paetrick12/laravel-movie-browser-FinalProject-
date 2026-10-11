import MovieCard from './MovieCard';

export default function MovieGrid({ movies, favorites, favoritesLoading, toggleFavorite }) {
  return (
    <div className="grid grid-cols-1 gap-4 min-[361px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          favorites={favorites}
          favoritesLoading={favoritesLoading}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
