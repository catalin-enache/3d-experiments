import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Pane } from 'tweakpane';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent
} from 'react';
import { buildBindings } from '@src/components/Inspector/buildBindings.ts';
import classes from './Inspector.module.css';

interface InspectorProps {
  object: THREE.Object3D | null;
}

export function Inspector({ object }: InspectorProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const paneRef = useRef<Pane | null>(null);
  const refreshTimer = useRef(0);
  const pointerOwnedRef = useRef<PointerEvent | null>(null);
  const pointerEnteredRef = useRef<PointerEvent | null>(null);

  useEffect(() => {
    if (!object || !container) {
      return;
    }

    const pane = new Pane({
      container,
      title: object.name || object.type
    });
    paneRef.current = pane;

    buildBindings({ pane, object });

    container.querySelectorAll('.tp-lblv_l').forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.title = htmlElement.textContent;
    });

    return () => {
      pane.dispose();
      paneRef.current = null;
    };
  }, [object, container]);

  const handlePointerDown = useCallback((evt: PointerEvent) => {
    evt.stopPropagation();
    pointerOwnedRef.current = evt;
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerOwnedRef.current = null;
  }, []);

  const handlePointerMove = useCallback((evt: PointerEvent) => {
    if (pointerOwnedRef.current) {
      evt.stopPropagation();
    }
  }, []);

  const handlePointerEnter = useCallback((evt: PointerEvent) => {
    pointerEnteredRef.current = evt;
  }, []);

  const handlePointerLeft = useCallback(() => {
    pointerEnteredRef.current = null;
  }, []);

  const handleWheel = useCallback((evt: WheelEvent) => {
    if (pointerEnteredRef.current) {
      evt.stopPropagation();
    }
  }, []);

  useFrame((_, delta) => {
    refreshTimer.current += delta;

    if (refreshTimer.current >= 0.1) {
      paneRef.current?.refresh();
      refreshTimer.current = 0;
    }
  });

  if (!object) {
    return null;
  }

  return (
    <Html calculatePosition={() => [12, 12]} className={classes.html}>
      <div
        className={classes.pane}
        ref={setContainer}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeft}
        onWheel={handleWheel}
      />
    </Html>
  );
}
