import { Link, useParams } from 'react-router-dom';
import DataState from '../components/DataState';
import Poster from '../components/Poster';
import FavoriteButton from '../components/FavoriteButton';
import ReviewList from '../components/ReviewList';

export default function MovieDetails({
  movies,
  loading,
  error,
  retry,
  favorites,
  favoritesLoading,
  toggleFavorite,
}) {
  const { id } = useParams();
  const movie = movies.find((item) => String(item.id) === id);
  if (loading || error) {
    return (
      <div className="page">
        <DataState loading={loading} error={error} retry={retry} />
      </div>
    );
  }
  if (!movie) {
    return (
      <div className="state-panel">
        <h1>Movie not found</h1>
        <Link
          className="button"
          to="/browse"
        >
          Back to movies
        </Link>
      </div>
    );
  }
  return (
    <div className="page">
      <Link
        className="text-link"
        to="/browse"
      >
        &larr; Back to movies
      </Link>
      <section className="mt-9 grid grid-cols-1 items-start gap-8 md:grid-cols-[230px_1fr] lg:grid-cols-[280px_1fr] lg:gap-14">
        <Poster
          className="mx-auto max-w-70 rounded-xl"
          key={movie.id}
          src={movie.image}
          title={movie.title}
          eager
        />
        <div>
          <p className="eyebrow">
            STUDIO GHIBLI
          </p>
          <h1>{movie.title}</h1>
          <p className="text-xl text-muted">{movie.original_title}</p>
          <p className="my-6 text-leaf">
            {movie.release_date} &middot; {movie.running_time} minutes &middot;{' '}
            {movie.rt_score}% score
          </p>
          <h2>The story</h2>
          <p className="leading-loose">{movie.description}</p>
          <dl className="my-7 grid grid-cols-1 gap-5 border-t border-line pt-6 min-[361px]:grid-cols-2">
            <div>
              <dt className="text-sm text-muted">Director</dt>
              <dd className="mt-1">{movie.director}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Producer</dt>
              <dd className="mt-1">{movie.producer}</dd>
            </div>
          </dl>
          <FavoriteButton movie={movie} favorites={favorites} favoritesLoading={favoritesLoading} toggleFavorite={toggleFavorite} />
        </div>
      </section>
      <ReviewList key={movie.id} movieId={movie.id} />
    </div>
  );
}
