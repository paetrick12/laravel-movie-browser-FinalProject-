export default function AuthWelcome({ registering = false }) {
  return (
    <aside className="flex flex-col items-center justify-center gap-6 rounded-xl border border-line bg-meadow px-6 py-8 text-center md:px-8 lg:px-10">
      <img
        className="w-full max-w-80 object-contain"
        src={`${import.meta.env.BASE_URL}studio-ghibli-logo.png`}
        alt="Studio Ghibli — Totoro logo"
      />
      <div className="max-w-md">
        <p className="eyebrow">A LITTLE PLACE FOR WONDERFUL FILMS</p>
        <h2>{registering ? 'Your next favorite story starts here.' : 'Return to a world of wonder.'}</h2>
        <p className="mb-0 text-leaf">
          {registering
            ? 'From forest spirits to flying castles, there is a Ghibli story for everyone. Make a little collection of the films you love.'
            : 'Revisit familiar favorites, discover a new adventure, and keep the stories you love close by.'}
        </p>
      </div>
      <ul className="grid w-full gap-4 border-t border-line pt-6 text-sm sm:grid-cols-3">
        <li><strong className="block text-forest">Explore stories</strong><span className="text-muted">Discover the Ghibli collection.</span></li>
        <li><strong className="block text-forest">Save favorites</strong><span className="text-muted">Keep your own movie collection.</span></li>
        <li><strong className="block text-forest">Share a review</strong><span className="text-muted">Tell us what moved you.</span></li>
      </ul>
    </aside>
  );
}
