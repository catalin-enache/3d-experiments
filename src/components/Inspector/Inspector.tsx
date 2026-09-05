import * as THREE from "three/webgpu";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Pane } from "tweakpane";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type WheelEvent
} from "react";
import clsx from "clsx";
import { buildBindings } from "./buildBindings.ts";
import classes from "./Inspector.module.css";

interface InspectorProps {
  object?: THREE.Object3D | null;
}

export function Inspector({ object }: InspectorProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const paneRef = useRef<Pane | null>(null);
  const refreshTimer = useRef(0);
  const pointerOwnedRef = useRef<PointerEvent | null>(null);
  const pointerEnteredRef = useRef<PointerEvent | null>(null);
  const { gl, camera } = useThree();
  const [_refresh, setRefresh] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const refresh = useCallback(() => {
    setRefresh((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (!container) {
      return;
    }

    const pane = new Pane({
      container,
      // eslint-disable-next-line
      title: object?.name || object?.type || "Inspector",
      expanded: isExpanded
    }).on("fold", (evt) => {
      setIsExpanded(evt.expanded);
    });
    paneRef.current = pane;

    buildBindings({
      pane,
      object,
      gl,
      refresh,
      camera
    });

    container.querySelectorAll(".tp-lblv_l").forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.title = htmlElement.textContent;
    });

    return () => {
      pane.dispose();
      paneRef.current = null;
    };
  }, [object, container, gl, camera, refresh, _refresh, isExpanded]);

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

  return (
    <Html
      calculatePosition={() => [4, 4]}
      className={classes.html}
      zIndexRange={[0, 0]}
      style={{ zIndex: "1 !important" }}
    >
      <div
        className={clsx(classes.pane, "overflow")}
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
