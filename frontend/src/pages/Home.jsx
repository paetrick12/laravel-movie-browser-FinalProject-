import { Link } from 'react-router-dom';
import MovieGrid from '../components/MovieGrid';
import DataState from '../components/DataState';

export default function Home({
  movies,
  loading,
  error,
  retry,
  favorites,
  favoritesLoading,
  toggleFavorite,
}) {
  const featured =
    movies.find((movie) => movie.title === 'My Neighbor Totoro') || movies[0];
  return (
    <div className="page">
      <section className="grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-meadow md:grid-cols-2">
        <div className="px-6 py-8 md:px-7 md:py-9 lg:px-10 lg:py-14">
          <p className="eyebrow">
            WELCOME TO THE WORLD OF GHIBLI
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl">
            Small moments.
            <br />
            Magical worlds.
          </h1>
          <p className="mb-7 max-w-sm text-leaf">
            Find a story to get lost in. Explore Studio Ghibli movies, meet
            their creators, and save your favorites for another day.
          </p>
          <Link
            className="button"
            to="/browse"
          >
            Explore the movies <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
        <div className="relative min-h-64 bg-sage md:min-h-88">
          {featured ? (
            <>
              <img
                className="absolute h-full w-full object-cover"
                src={featured.movie_banner || featured.image}
                alt={`A scene from ${featured.title}`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
              <Link
                className="absolute right-4 bottom-4 left-4 flex flex-wrap justify-between gap-2 rounded-md bg-paper/95 px-4 py-3 text-sm"
                to={`/movie/${featured.id}`}
              >
                {featured.title}{' '}
                <span className="text-leaf">View film &rarr;</span>
              </Link>
            </>
          ) : (
            <img
              className="absolute h-full w-full object-contain p-20 opacity-25"
              src={`${import.meta.env.BASE_URL}studio-ghibli-symbol.png`}
              alt=""
            />
          )}
        </div>
      </section>
      <section className="mt-13">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">
              A GOOD PLACE TO START
            </p>
            <h2 className="mb-0">Stories to discover</h2>
          </div>
          <Link
            className="text-link"
            to="/browse"
          >
            View all movies &rarr;
          </Link>
        </div>
        <DataState loading={loading} error={error} retry={retry} />
        {!loading && !error && (
          <MovieGrid
            movies={movies.slice(0, 4)}
            favorites={favorites}
            favoritesLoading={favoritesLoading}
            toggleFavorite={toggleFavorite}
          />
        )}
      </section>
    </div>
  );
}
