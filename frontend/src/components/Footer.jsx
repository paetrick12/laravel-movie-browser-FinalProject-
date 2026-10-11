export default function Footer() {
  return (
    <footer className="mx-auto mt-9 flex w-9/10 max-w-290 flex-wrap items-center justify-between gap-5 border-t border-line py-7 text-sm">
      <p className="mb-0 font-semibold">
        Studio Ghibli Movie Browser{' '}
        <span className="mt-1 block font-normal text-muted">
          A little place for wonderful films.
        </span>
      </p>
      <a
        className="underline underline-offset-4"
        href="https://ghibliapi.vercel.app"
        target="_blank"
        rel="noreferrer"
      >
        Data from the Studio Ghibli API
      </a>
    </footer>
  );
}



