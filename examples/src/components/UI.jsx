export const UI = () => {
  return (
    <section className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
      <div className="absolute top-4 left-4 md:top-8 md:left-14 opacity-0 animate-fade-in-down animation-delay-200">
        <a
          className="pointer-events-auto select-none"
          href="https://wawasensei.dev"
          target="_blank"
        >
          <img
            src="/images/wawasensei-white.png"
            alt="Wawa Sensei logo"
            className="w-20 h-20 object-contain"
          />
        </a>
      </div>
      <div className="absolute left-4 md:left-15 -translate-x-1/2 -rotate-90 flex items-center gap-4 animation-delay-1500 animate-fade-in-down opacity-0">
        <div className="w-20 h-px bg-white/60"></div>
        <a
          href="https://lessons.wawasensei.dev/courses/react-three-fiber/"
          className="text-white/60 text-xs pointer-events-auto select-none"
        >
          Learn Three.js & React Three Fiber
        </a>
      </div>
    </section>
  );
};
