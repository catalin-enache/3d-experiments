import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useCallback } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { isEditableTarget } from "@lib/utils";

const MOVE_SPEED_MIN = 0.5;
const MOVE_SPEED_MAX = 100;
const SPEED_FACTOR = 1.15;
const LOOK_SPEED = 0.002;
const LOOK_DAMPING = 24;
const MAX_PITCH = Math.PI / 2 - 0.01;

interface NavigationControlsProps {
  selectedObject: THREE.Object3D | null;
}

export function CameraControls({ selectedObject }: NavigationControlsProps) {
  const { camera, gl } = useThree();
  const orbitControlsRef = useRef<OrbitControlsImpl>(null);
  const activePointerId = useRef<number | null>(null);

  const rightMouseDown = useRef(false);
  const leftMouseDown = useRef(false);
  const middleMouseDown = useRef(false);

  const lookDirection = useRef(new THREE.Vector3());

  const movement = useRef(new THREE.Vector3());
  const moveSpeed = useRef(5);
  const moveForward = useRef(new THREE.Vector3());
  const moveRight = useRef(new THREE.Vector3());
  const lastHorizontalForward = useRef(new THREE.Vector3(0, 0, -1));

  const lookVelocity = useRef({
    x: 0,
    y: 0
  });

  const lookAngles = useRef({
    yaw: 0,
    pitch: 0
  });

  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  });

  const clearMovementKeys = useCallback(() => {
    keys.current.forward = false;
    keys.current.backward = false;
    keys.current.left = false;
    keys.current.right = false;
    keys.current.up = false;
    keys.current.down = false;
  }, []);

  const clearLookVelocity = useCallback(() => {
    lookVelocity.current.x = 0;
    lookVelocity.current.y = 0;
  }, []);

  const focusObject = useCallback((object: THREE.Object3D | null) => {
    const controls = orbitControlsRef.current;

    if (!controls) return;

    if (!object) {
      // controls.reset();
      controls.target.set(0, 0, 0);
      controls.update();
      return;
    }

    object.updateWorldMatrix(true, false);

    const box = new THREE.Box3().setFromObject(object, true);
    const center = new THREE.Vector3();

    if (!box.isEmpty()) {
      box.getCenter(center);
    } else {
      object.getWorldPosition(center);
    }

    controls.target.copy(center);
    controls.update();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return;
      }

      if (event.code === "KeyF") {
        if (!event.repeat && !rightMouseDown.current) {
          focusObject(selectedObject);
        }

        return;
      }

      if (!rightMouseDown.current) return;

      switch (event.code) {
        case "KeyW":
          keys.current.forward = true;
          break;
        case "KeyS":
          keys.current.backward = true;
          break;
        case "KeyA":
          keys.current.left = true;
          break;
        case "KeyD":
          keys.current.right = true;
          break;
        case "KeyE":
          keys.current.up = true;
          break;
        case "KeyQ":
          keys.current.down = true;
          break;
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case "KeyW":
          keys.current.forward = false;
          break;
        case "KeyS":
          keys.current.backward = false;
          break;
        case "KeyA":
          keys.current.left = false;
          break;
        case "KeyD":
          keys.current.right = false;
          break;
        case "KeyE":
          keys.current.up = false;
          break;
        case "KeyQ":
          keys.current.down = false;
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [focusObject, selectedObject]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      activePointerId.current = event.pointerId;
      if (event.button === 0) {
        leftMouseDown.current = true;
      } else if (event.button === 1) {
        middleMouseDown.current = true;
      } else if (event.button === 2) {
        const controls = orbitControlsRef.current;

        if (controls) {
          lookDirection.current
            .subVectors(controls.target, camera.position)
            .normalize();

          lookAngles.current.pitch = Math.asin(
            THREE.MathUtils.clamp(lookDirection.current.y, -1, 1)
          );

          lookAngles.current.yaw = Math.atan2(
            lookDirection.current.x,
            -lookDirection.current.z
          );
        }

        // rightMouseDown.current will be set to true async in pointerlock event;
        void gl.domElement.requestPointerLock();
      }
    };

    const onPointerUp = (event: PointerEvent) => {
      if (event.button === 0) {
        leftMouseDown.current = false;
      }

      if (event.button === 1) {
        middleMouseDown.current = false;
      }

      if (event.button === 2) {
        clearMovementKeys();

        if (document.pointerLockElement === gl.domElement) {
          document.exitPointerLock();
        }
      }
    };

    const onPointerLeave = () => {
      leftMouseDown.current = false;
      middleMouseDown.current = false;

      if (activePointerId.current !== null) {
        // Let OrbitControls think that pointer was released in order to stop dragging.
        // This is a workaround that plays well with ObjectTransformControls.
        // Before this workaround we swallowed pointerMove events which interfered with ObjectTransformControls
        // making it to jump when dragging.
        document.dispatchEvent(
          new PointerEvent("pointerup", {
            bubbles: true,
            pointerId: activePointerId.current
          })
        );

        activePointerId.current = null;
      }
    };

    const onPointerLockChange = () => {
      const locked = document.pointerLockElement === gl.domElement;
      rightMouseDown.current = locked;

      clearLookVelocity();

      if (!locked) {
        clearMovementKeys();
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!rightMouseDown.current) return;
      if (document.pointerLockElement !== gl.domElement) return;

      lookVelocity.current.x += event.movementX * LOOK_SPEED;
      lookVelocity.current.y += event.movementY * LOOK_SPEED;
    };

    const onContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    gl.domElement.addEventListener("contextmenu", onContextMenu);
    gl.domElement.addEventListener("pointerdown", onPointerDown);
    gl.domElement.addEventListener("pointerup", onPointerUp);
    gl.domElement.addEventListener("pointermove", onPointerMove, {
      capture: true
    });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("pointerlockchange", onPointerLockChange);

    return () => {
      gl.domElement.removeEventListener("contextmenu", onContextMenu);
      gl.domElement.removeEventListener("pointerdown", onPointerDown);
      gl.domElement.removeEventListener("pointerup", onPointerUp);
      gl.domElement.removeEventListener("pointermove", onPointerMove, {
        capture: true
      });
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("pointerlockchange", onPointerLockChange);

      if (document.pointerLockElement === gl.domElement) {
        document.exitPointerLock();
      }
    };
  }, [camera, clearLookVelocity, clearMovementKeys, gl.domElement]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (!rightMouseDown.current) return;

      event.preventDefault();
      event.stopPropagation();

      // wheel up = faster, wheel down = slower
      if (event.deltaY < 0) {
        moveSpeed.current *= SPEED_FACTOR;
      } else {
        moveSpeed.current /= SPEED_FACTOR;
      }

      moveSpeed.current = THREE.MathUtils.clamp(
        moveSpeed.current,
        MOVE_SPEED_MIN,
        MOVE_SPEED_MAX
      );
    };

    gl.domElement.addEventListener("wheel", onWheel, {
      capture: true,
      passive: false
    });

    return () => {
      gl.domElement.removeEventListener("wheel", onWheel, {
        capture: true
      });
    };
  }, [gl.domElement]);

  useFrame((_, delta) => {
    const controls = orbitControlsRef.current;
    if (!controls) return;

    // -------------------------
    // Smooth RMB look
    // -------------------------

    if (
      Math.abs(lookVelocity.current.x) > 0.00001 ||
      Math.abs(lookVelocity.current.y) > 0.00001
    ) {
      const targetDistance = Math.max(
        camera.position.distanceTo(controls.target),
        0.001
      );

      // Apply accumulated mouse movement.
      lookAngles.current.yaw += lookVelocity.current.x;
      lookAngles.current.pitch -= lookVelocity.current.y;

      if (lookAngles.current.pitch > MAX_PITCH) {
        lookAngles.current.pitch = MAX_PITCH;
        if (lookVelocity.current.y < 0) {
          lookVelocity.current.y = 0;
        }
      } else if (lookAngles.current.pitch < -MAX_PITCH) {
        lookAngles.current.pitch = -MAX_PITCH;
        if (lookVelocity.current.y > 0) {
          lookVelocity.current.y = 0;
        }
      }

      const { yaw, pitch } = lookAngles.current;
      const cosPitch = Math.cos(pitch);

      // Rebuild normalized camera-forward direction.
      lookDirection.current.set(
        Math.sin(yaw) * cosPitch,
        Math.sin(pitch),
        -Math.cos(yaw) * cosPitch
      );

      controls.target
        .copy(camera.position)
        .addScaledVector(lookDirection.current, targetDistance);

      // Frame-rate-independent damping.
      const damping = Math.exp(-LOOK_DAMPING * delta);

      lookVelocity.current.x *= damping;
      lookVelocity.current.y *= damping;
    }

    // -------------------------
    // WASD-QE movement
    // -------------------------
    movement.current.set(0, 0, 0);

    // Get actual camera view direction.
    camera.getWorldDirection(moveForward.current);

    // Project it onto the horizontal XZ plane.
    moveForward.current.y = 0;

    if (moveForward.current.lengthSq() > 0.000001) {
      // We have a valid horizontal direction.
      moveForward.current.normalize();

      lastHorizontalForward.current.copy(moveForward.current);
    } else {
      // Camera is looking almost exactly straight up/down.
      // Keep using the last valid horizontal heading.
      moveForward.current.copy(lastHorizontalForward.current);
    }

    // Horizontal right vector.
    moveRight.current.crossVectors(moveForward.current, camera.up).normalize();
    const zoomFactor = Math.exp(moveSpeed.current * delta * 0.1);

    if (keys.current.forward) {
      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = THREE.MathUtils.clamp(
          camera.zoom * zoomFactor,
          0.01,
          1000
        );
        camera.updateProjectionMatrix();
      } else {
        movement.current.add(moveForward.current);
      }
    }

    if (keys.current.backward) {
      if (camera instanceof THREE.OrthographicCamera) {
        camera.zoom = THREE.MathUtils.clamp(
          camera.zoom / zoomFactor,
          0.01,
          1000
        );
        camera.updateProjectionMatrix();
      } else {
        movement.current.sub(moveForward.current);
      }
    }

    if (keys.current.right) {
      movement.current.add(moveRight.current);
    }

    if (keys.current.left) {
      movement.current.sub(moveRight.current);
    }

    if (keys.current.up) {
      movement.current.y += 1;
    }

    if (keys.current.down) {
      movement.current.y -= 1;
    }

    if (movement.current.lengthSq() > 0) {
      movement.current.normalize().multiplyScalar(moveSpeed.current * delta);

      camera.position.add(movement.current);
      controls.target.add(movement.current);
    }
  });

  return (
    <OrbitControls
      ref={orbitControlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.2}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: undefined
      }}
    />
  );
}
