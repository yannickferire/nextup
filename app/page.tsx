export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <header className="px-8 py-4 border-b border-foreground/20">
        <p className="logo text-4xl tracking-wider">next<span className="relative -top-[3px]">u</span>p<span className="opacity-20">.build</span></p>
      </header>
      <section className="flex-1 mx-8 py-4 border-l border-r border-foreground/20">
        <article className="px-8 max-w-3xl flex flex-col gap-4">
          <h2 className="text-5xl tracking-wide text-balance">Your next move is no longer a question. It&apos;s a priority.</h2>
          <p className="opacity-60 text-lg tracking-wide">Nextup analyzes your real growth data to forge the features your users are actually searching for. Every single week.</p>

        </article>
      </section>
      <footer className="px-8 py-4 border-t border-foreground/20"></footer>
    </main>
  );
}
