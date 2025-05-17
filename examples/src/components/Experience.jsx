import { CameraControls, Stars, Stats } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { AlphaMap } from "./demo-components/AlphaMap";
import { Basic } from "./demo-components/Basic";
import { CustomGeometry } from "./demo-components/CustomGeometry";
import { Emitter } from "./demo-components/Emitter";
import { MultipleEmitters } from "./demo-components/MultipleEmitters";
import { StretchedBillboard } from "./demo-components/StretchedBillboard";
import { GradientSky } from "./GradientSky";

export const Experience = () => {
  const controls = useRef();

  useEffect(() => {
    controls.current.setLookAt(0, 15, 10, 0, 25, 0);
    controls.current.setLookAt(12, 8, 26, 0, 0, 0, true);
  }, []);

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

      {currentHash === "" && <Basic />}
      {currentHash === "emitter" && <Emitter />}
      {currentHash === "multiple-emitters" && <MultipleEmitters />}
      {currentHash === "alpha-map" && <AlphaMap />}
      {currentHash === "custom-geometry" && <CustomGeometry />}
      {currentHash === "stretched-billboard" && <StretchedBillboard />}

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={1} mipmapBlur />
      </EffectComposer>
    </>
  );
};
