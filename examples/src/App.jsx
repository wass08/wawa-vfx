import { Loader, PositionalAudio } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Suspense } from "react";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";

function App() {
  return (
    <>
      <Leva collapsed />
      <Loader />
      <UI />
      <Canvas shadows camera={{ position: [12, 8, 26], fov: 30 }}>
        <color attach="background" args={["#110511"]} />
        <Suspense>
          <Preloader />
          <Experience />
        </Suspense>
      </Canvas>
    </>
  );
}

const Preloader = () => {
  return (
    <>
      <PositionalAudio
        url="sfxs/firework-whistle-190306.mp3"
        autoplay={false}
      />
      <PositionalAudio
        url="sfxs/firecracker-corsair-4-95046.mp3"
        autoplay={false}
      />
    </>
  );
};

export default App;
