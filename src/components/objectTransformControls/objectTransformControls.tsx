import * as THREE from 'three';
import { TransformControls } from '@react-three/drei';
import { useEffect, useState, useRef } from 'react';

type TransformMode = 'translate' | 'rotate' | 'scale';
type TransformSpace = 'world' | 'local';

export function ObjectTransformControls({
  selectedObject
}: {
  selectedObject: THREE.Object3D | null;
}) {
  const [mode, setMode] = useState<TransformMode>('translate');
  const [space, setSpace] = useState<TransformSpace>('world');
  const mouseDown = useRef(false);

  useEffect(() => {
    const onMouseDown = () => {
      mouseDown.current = true;
    };

    const onMouseUp = () => {
      mouseDown.current = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // Navigation mode is active — don't process transform hotkeys
      if (mouseDown.current) return;

      switch (event.code) {
        case 'KeyW':
          setMode('translate');
          break;

        case 'KeyE':
          setMode('rotate');
          break;

        case 'KeyR':
          setMode('scale');
          break;

        case 'KeyQ':
          setSpace((current) => (current === 'world' ? 'local' : 'world'));
          break;
      }
    };
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  if (!selectedObject) return null;

  return (
    <TransformControls object={selectedObject} mode={mode} space={space} />
  );
}
