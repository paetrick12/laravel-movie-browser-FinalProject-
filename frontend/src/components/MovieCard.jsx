import { Link } from 'react-router-dom';
import Poster from './Poster';
import FavoriteButton from './FavoriteButton';

export default function MovieCard({ movie, favorites, favoritesLoading, toggleFavorite }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-paper">
      <Link className="block hover:underline" to={`/movie/${movie.id}`}>
        <Poster src={movie.image} title={movie.title} />
      </Link>
      <div className="p-3 md:p-4">
        <p className="mb-2.5 flex flex-wrap justify-between gap-1 text-xs text-muted">
          {movie.release_date} <span>{movie.running_time} min</span>
        </p>
        <h3 className="min-h-[2.4em]">
          <Link className="block hover:underline" to={`/movie/${movie.id}`}>
            {movie.title}
          </Link>
        </h3>
        <p className="mb-4 text-sm text-muted">{movie.director}</p>
        <FavoriteButton movie={movie} favorites={favorites} favoritesLoading={favoritesLoading} toggleFavorite={toggleFavorite} compact />
      </div>
    </article>
  );
}
