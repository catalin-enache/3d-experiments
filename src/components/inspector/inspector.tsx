import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

interface SelectedObjectInfoProps {
  object: THREE.Object3D | null;
}

export function SelectedObjectInfo({ object }: SelectedObjectInfoProps) {
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
    <Html
      calculatePosition={(_, __, ___) => [12, 12]}
      style={{
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          padding: '12px 14px',
          minWidth: 280,

          color: '#eee',
          background: 'rgba(20, 20, 20, 0.92)',
          border: '1px solid #444',
          borderRadius: 6,

          fontFamily:
            '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
          fontSize: 12,
          lineHeight: 1.5,

          boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
        }}
      >
        <div
          style={{
            marginBottom: 10,
            fontWeight: 600
          }}
        >
          {object.name || object.type}
        </div>

        <div>
          <strong>Position</strong>
          <div ref={positionRef} />
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>Rotation</strong>
          <div ref={rotationRef} />
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>Scale</strong>
          <div ref={scaleRef} />
        </div>
      </div>
    </Html>
  );
}
