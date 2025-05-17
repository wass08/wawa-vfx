import { useEffect, useState } from "react";

const examples = [
  {
    label: "Simple particle emissions",
    href: "#",
  },
  {
    label: "Follow emitter",
    href: "#emitter",
  },
  {
    label: "Multiple emitters",
    href: "#multiple-emitters",
  },
  {
    label: "Alpha map",
    href: "#alpha-map",
  },
  // {
  //   label: "Stretched billboard",
  //   href: "#stretched-billboard",
  // },
  {
    label: "Custom geometry",
    href: "#custom-geometry",
  },
];

export const UI = () => {
  const [currentHash, setCurrentHash] = useState(
    window.location.hash.replace("#", "")
  );

  useEffect(() => {
    // When hash in the url changes, update the href state
    const handleHashChange = () => {
      setCurrentHash(window.location.hash.replace("#", ""));
    };
    window.addEventListener("hashchange", handleHashChange);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
      <div className="absolute left-12 md:left-32 flex flex-col items-start gap-4 animation-delay-1500 animate-fade-in-down opacity-0">
        {examples.map((example, index) => (
          <a
            key={index}
            href={example.href}
            className={`${
              currentHash === example.href.replace("#", "")
                ? "text-amber-300/80 border-b-amber-300/80 "
                : "text-white/60 border-b-white/60 "
            } text-sm font-medium pointer-events-auto select-none py-3 border-b  hover:text-white hover:border-b-white transition-all duration-200 ease-in-out`}
          >
            {example.label}
          </a>
        ))}
      </div>
    </section>
  );
};
