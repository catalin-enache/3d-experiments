import * as THREE from "three";
import { useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Scenario } from "@components";

import classes from "./ScenarioMatrixInverse.module.css";

function makeLineGeometry() {
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3()
  ]);
}

function setLinePoints(
  line: THREE.Line,
  start: THREE.Vector3,
  end: THREE.Vector3
) {
  const positions = line.geometry.attributes.position;

  positions.setXYZ(0, start.x, start.y, start.z);
  positions.setXYZ(1, end.x, end.y, end.z);

  positions.needsUpdate = true;

  line.geometry.computeBoundingSphere();

  if (line.material instanceof THREE.LineDashedMaterial) {
    line.computeLineDistances();
  }
}

function formatVector3(vector: THREE.Vector3) {
  return `(${vector.x.toFixed(3)}, ${vector.y.toFixed(3)}, ${vector.z.toFixed(3)})`;
}

function formatEulerDeg(euler: THREE.Euler) {
  return `(${THREE.MathUtils.radToDeg(euler.x).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.y).toFixed(2)}°, ${THREE.MathUtils.radToDeg(euler.z).toFixed(2)}°)`;
}

export function ScenarioMatrixInverse() {
  const parentRef = useRef<THREE.Mesh>(null);
  const childRef = useRef<THREE.Mesh>(null);

  const worldPointRef = useRef<THREE.Mesh>(null);
  const recoveredPointRef = useRef<THREE.Mesh>(null);

  const localLineRef = useRef<THREE.Line>(null);
  const worldLineRef = useRef<THREE.Line>(null);

  const infoRef = useRef<HTMLPreElement>(null);

  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(0.3, 0.3, 0.3), []);

  const localLineGeometry = useMemo(() => makeLineGeometry(), []);
  const worldLineGeometry = useMemo(() => makeLineGeometry(), []);

  const data = useMemo(
    () => ({
      localPosition: new THREE.Vector3(),
      localQuaternion: new THREE.Quaternion(),
      localScale: new THREE.Vector3(),
      localRotation: new THREE.Euler(),

      worldPosition: new THREE.Vector3(),
      worldQuaternion: new THREE.Quaternion(),
      worldScale: new THREE.Vector3(),
      worldRotation: new THREE.Euler(),

      recoveredPosition: new THREE.Vector3(),
      recoveredQuaternion: new THREE.Quaternion(),
      recoveredScale: new THREE.Vector3(),
      recoveredRotation: new THREE.Euler(),

      parentWorldPosition: new THREE.Vector3(),
      worldOrigin: new THREE.Vector3(),

      inverseParentMatrix: new THREE.Matrix4(),
      recoveredLocalMatrix: new THREE.Matrix4()
    }),
    []
  );

  useFrame(() => {
    const parent = parentRef.current;
    const child = childRef.current;

    const worldPoint = worldPointRef.current;
    const recoveredPoint = recoveredPointRef.current;

    const localLine = localLineRef.current;
    const worldLine = worldLineRef.current;

    if (
      !parent ||
      !child ||
      !worldPoint ||
      !recoveredPoint ||
      !localLine ||
      !worldLine
    ) {
      return;
    }

    /*
     * Make sure matrixWorld is current after
     * TransformControls changed Parent or C.
     */
    parent.updateWorldMatrix(true, true);

    /*
     * ---------------------------------------------------------
     * ORIGINAL LOCAL TRANSFORM
     * ---------------------------------------------------------
     *
     * Because C is a direct child of Parent,
     * these values are already local to Parent.
     */
    data.localPosition.copy(child.position);
    data.localQuaternion.copy(child.quaternion);
    data.localScale.copy(child.scale);

    data.localRotation.setFromQuaternion(
      data.localQuaternion,
      child.rotation.order
    );

    /*
     * ---------------------------------------------------------
     * WORLD TRANSFORM
     * ---------------------------------------------------------
     *
     * child.matrixWorld contains:
     *
     * Parent.matrixWorld * child.matrix
     */
    child.matrixWorld.decompose(
      data.worldPosition,
      data.worldQuaternion,
      data.worldScale
    );

    data.worldRotation.setFromQuaternion(
      data.worldQuaternion,
      child.rotation.order
    );

    /*
     * ---------------------------------------------------------
     * WORLD -> LOCAL
     * ---------------------------------------------------------
     *
     * child.matrixWorld =
     * Parent.matrixWorld * child.matrix
     *
     * Therefore:
     *
     * inverse(Parent.matrixWorld) * child.matrixWorld
     * =
     * child.matrix
     */
    data.inverseParentMatrix.copy(parent.matrixWorld).invert();

    data.recoveredLocalMatrix.multiplyMatrices(
      data.inverseParentMatrix,
      child.matrixWorld
    );

    /*
     * The recovered matrix already IS the recovered
     * local transform.
     *
     * decompose() simply extracts:
     *
     * position
     * rotation
     * scale
     */
    data.recoveredLocalMatrix.decompose(
      data.recoveredPosition,
      data.recoveredQuaternion,
      data.recoveredScale
    );

    data.recoveredRotation.setFromQuaternion(
      data.recoveredQuaternion,
      child.rotation.order
    );

    /*
     * Parent origin in world space.
     */
    parent.getWorldPosition(data.parentWorldPosition);

    /*
     * ---------------------------------------------------------
     * VISUALIZATION
     * ---------------------------------------------------------
     */

    /*
     * Green wireframe cube:
     * complete WORLD transform of C.
     */
    worldPoint.position.copy(data.worldPosition);
    worldPoint.quaternion.copy(data.worldQuaternion);
    // multiply by 1.05 to make the wireframe cube slightly larger than the actual child cube for visual clarity
    worldPoint.scale.copy(data.worldScale.multiplyScalar(1.05));

    /*
     * Orange wireframe cube:
     * recovered LOCAL transform.
     *
     * It is deliberately NOT parented under Parent.
     * We display the recovered local numbers directly
     * in world coordinates.
     */
    recoveredPoint.position.copy(data.recoveredPosition);
    recoveredPoint.quaternion.copy(data.recoveredQuaternion);
    recoveredPoint.scale.copy(data.recoveredScale);

    /*
     * Parent world origin -> C world position
     */
    setLinePoints(worldLine, data.parentWorldPosition, data.worldPosition);

    /*
     * World origin -> recovered local position
     */
    setLinePoints(localLine, data.worldOrigin, data.recoveredPosition);

    /*
     * ---------------------------------------------------------
     * ERRORS
     * ---------------------------------------------------------
     */

    const positionError = data.recoveredPosition.distanceTo(data.localPosition);

    /*
     * Compare quaternion orientations rather than Euler
     * components, because multiple Euler representations
     * can describe the same rotation.
     *
     * angleTo() returns radians.
     */
    const rotationError = data.recoveredQuaternion.angleTo(
      data.localQuaternion
    );

    const rotationErrorDegrees = THREE.MathUtils.radToDeg(rotationError);

    const scaleError = data.recoveredScale.distanceTo(data.localScale);

    /*
     * ---------------------------------------------------------
     * INFO PANEL
     * ---------------------------------------------------------
     */
    if (infoRef.current) {
      infoRef.current.textContent = [
        "Matrix Inverse / Local vs World",
        "",
        "LOCAL C transform",
        `Position: ${formatVector3(data.localPosition)}`,
        `Rotation: ${formatEulerDeg(data.localRotation)}`,
        `Scale:    ${formatVector3(data.localScale)}`,
        "",
        "Parent.matrixWorld × C.matrix",
        "↓",
        "",
        "WORLD C transform",
        `Position: ${formatVector3(data.worldPosition)}`,
        `Rotation: ${formatEulerDeg(data.worldRotation)}`,
        `Scale:    ${formatVector3(data.worldScale)}`,
        "",
        "inverse(Parent.matrixWorld) × C.matrixWorld",
        "↓",
        "",
        "RECOVERED LOCAL transform",
        `Position: ${formatVector3(data.recoveredPosition)}`,
        `Rotation: ${formatEulerDeg(data.recoveredRotation)}`,
        `Scale:    ${formatVector3(data.recoveredScale)}`,
        "",
        `Position error = ${positionError.toFixed(8)}`,
        `Rotation error = ${rotationErrorDegrees.toFixed(8)}°`,
        `Scale error    = ${scaleError.toFixed(8)}`
      ].join("\n");
    }
  });

  return (
    <Scenario
      unselectableChildren={
        <>
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 6, 5]} intensity={2} />

          {/* World coordinate system */}
          <gridHelper args={[12, 12, "#444444", "#222222"]} />

          <axesHelper args={[2]} />

          {/*
           * Complete WORLD transform of C.
           *
           * Wireframe helps distinguish it from the
           * actual child cube.
           */}
          <mesh
            ref={worldPointRef}
            name="C World Transform"
            geometry={cubeGeometry}
          >
            <meshStandardMaterial color="#00ff66" wireframe depthTest={false} />

            <axesHelper args={[0.5]} />

            <Html center className={classes.htmlSphereLabel}>
              <div
                className={classes.sphereLabel}
                style={{
                  transform: "translateY(-46px)"
                }}
              >
                C World
              </div>
            </Html>
          </mesh>

          {/*
           * Recovered LOCAL transform.
           *
           * This is:
           *
           * inverse(Parent.matrixWorld) * C.matrixWorld
           */}
          <mesh
            ref={recoveredPointRef}
            name="Recovered Local Transform"
            geometry={cubeGeometry}
          >
            <meshStandardMaterial color="#ff9900" wireframe />

            <axesHelper args={[0.5]} userData={{ noSelect: true }} />

            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>Recovered Local</div>
            </Html>
          </mesh>

          {/* Parent origin -> C world position */}
          <threeLine
            ref={worldLineRef}
            geometry={worldLineGeometry}
            name="C World Position"
          >
            <lineBasicMaterial color="#00ff66" />
          </threeLine>

          {/* World origin -> recovered local position */}
          <threeLine
            ref={localLineRef}
            geometry={localLineGeometry}
            name="Recovered Local Position"
          >
            <lineDashedMaterial
              color="#ff9900"
              dashSize={0.08}
              gapSize={0.05}
            />
          </threeLine>

          <Html
            calculatePosition={(_, __, { height }) => [12, height - 640]}
            style={{
              pointerEvents: "none"
            }}
          >
            <pre ref={infoRef} className={classes.htmlInfo} />
          </Html>
        </>
      }

      selectableChildren={
        <mesh
          ref={parentRef}
          name="Parent"
          position={[1.5, 0.5, 0]}
          rotation={[0.2, 0.5, 0.25]}
          scale={[1, 1, 1]}
          geometry={cubeGeometry}
        >
          <meshStandardMaterial color="#5599ff" />

          <Html center className={classes.htmlSphereLabel}>
            <div className={classes.sphereLabel}>Parent</div>
          </Html>

          {/*
           * Parent's local coordinate basis.
           */}
          <axesHelper args={[0.5]} userData={{ noSelect: true }} />

          {/*
           * C is genuinely parented under Parent.
           *
           * Its position / rotation / scale are therefore
           * local relative to Parent.
           */}
          <mesh
            ref={childRef}
            name="C"
            position={[1.5, 1, 0]}
            rotation={[0.3, 0.2, 0.4]}
            scale={[1, 1, 1]}
            geometry={cubeGeometry}
          >
            <meshStandardMaterial color="#55ff88" />

            <axesHelper args={[0.5]} userData={{ noSelect: true }} />

            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>C</div>
            </Html>
          </mesh>
        </mesh>
      }
    />
  );
}

export default ScenarioMatrixInverse;
