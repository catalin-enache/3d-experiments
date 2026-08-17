import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import classes from './inspector.module.css';

interface SelectedObjectInfoProps {
  object: THREE.Object3D | null;
}

export function Inspector({ object }: SelectedObjectInfoProps) {
  const positionRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!object) return;

    if (positionRef.current) {
      positionRef.current.textContent =
        `X ${object.position.x.toFixed(2)}  ` +
        `Y ${object.position.y.toFixed(2)}  ` +
        `Z ${object.position.z.toFixed(2)}`;
    }

    if (rotationRef.current) {
      rotationRef.current.textContent =
        `X ${THREE.MathUtils.radToDeg(object.rotation.x).toFixed(1)}°  ` +
        `Y ${THREE.MathUtils.radToDeg(object.rotation.y).toFixed(1)}°  ` +
        `Z ${THREE.MathUtils.radToDeg(object.rotation.z).toFixed(1)}°`;
    }

    if (scaleRef.current) {
      scaleRef.current.textContent =
        `X ${object.scale.x.toFixed(2)}  ` +
        `Y ${object.scale.y.toFixed(2)}  ` +
        `Z ${object.scale.z.toFixed(2)}`;
    }
  });

  if (!object) return null;

  return (
    <Html calculatePosition={() => [12, 12]} className={classes.html}>
      <div className={classes.inspector}>
        <div className={classes.title}>{object.name || object.type}</div>

        <div>
          <strong>Position</strong>
          <div ref={positionRef} />
        </div>

        <div className={classes.section}>
          <strong>Rotation</strong>
          <div ref={rotationRef} />
        </div>

        <div className={classes.section}>
          <strong>Scale</strong>
          <div ref={scaleRef} />
        </div>
      </div>
    </Html>
  );
}
