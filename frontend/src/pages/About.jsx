import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page">
      <p className="eyebrow">
        ABOUT THIS BROWSER
      </p>
      <h1>A place for Ghibli stories.</h1>
      <p className="max-w-xl text-muted">
        Explore the imaginative films of Studio Ghibli, one movie at a time.
      </p>
      <section className="mt-9 grid grid-cols-1 items-center gap-7 rounded-xl bg-meadow p-7 md:grid-cols-[1fr_2fr] md:gap-12 md:p-10">
        <img
          className="mx-auto max-w-55 md:max-w-full"
          src={`${import.meta.env.BASE_URL}studio-ghibli-logo.png`}
          alt="Studio Ghibli"
        />
        <div>
          <h2>Find your next movie</h2>
          <p className="text-leaf">
            Browse the collection, search for a title or director, and read
            about each film. Create an account to save favorites and share reviews.
          </p>
          <p className="text-leaf">
            This is an independent fan project. Movie information comes from the{' '}
            <a
              className="underline"
              href="https://ghibliapi.vercel.app"
              target="_blank"
              rel="noreferrer"
            >
              Studio Ghibli API
            </a>
            . Film artwork belongs to its respective owners.
          </p>
          <Link
            className="button"
            to="/browse"
          >
            Browse the collection
          </Link>
        </div>
      </section>
    </div>
  );
}
