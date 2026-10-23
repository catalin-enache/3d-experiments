import { useEffect, useRef, useState } from "react";
import { Scenario } from "@components";
import { projectLongLatOnSphere } from "@lib/math";
import { createGui, type Params } from "./gui";

const radius = 10;

const initialDirection = {
  x: 0,
  y: 1.6
};

export function ProjectLongLatOnSphere() {
  const [direction, setDirection] = useState(() =>
    projectLongLatOnSphere({
      ...initialDirection,
      r: radius
    })
  );

  const guiValues = useRef<Params>({
    longitude: initialDirection.x,
    latitude: initialDirection.y
  });

  useEffect(() => {
    const updateDirection = () => {
      setDirection(
        projectLongLatOnSphere({
          x: guiValues.current.longitude,
          y: guiValues.current.latitude,
          r: radius
        })
      );
    };

    const gui = createGui(guiValues.current, {
      onDirectionChange: updateDirection
    });

    return () => {
      gui.destroy();
    };
  }, []);

  return (
    <Scenario
      unselectableChildren={
        <>
          <group name="lights group">
            <ambientLight
              color="#ffffff"
              intensity={3.5}
              position={[0, 1, 0]}
            />
          </group>

          <mesh name="sphere">
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial color="#ffffff" wireframe />
          </mesh>

          <mesh position={direction} name="projection">
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#ff0000" />
          </mesh>
        </>
      }
    />
  );
}
