import { CameraControls, Stars, Stats } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef } from "react";
import { Basic } from "./Basic";
import { GradientSky } from "./GradientSky";

export const Experience = () => {
  const controls = useRef();

  useEffect(() => {
    controls.current.setLookAt(0, 15, 10, 0, 25, 0);
    controls.current.setLookAt(12, 8, 26, 0, 0, 0, true);
  }, []);

  return (
    <>
      <Stats />
      <CameraControls ref={controls} />
      <directionalLight
        position={[1, 0.5, -10]}
        intensity={2}
        color="#ffe7ba"
      />

      <Stars fade speed={3} count={2000} />
      <GradientSky />

      <Basic />

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};
