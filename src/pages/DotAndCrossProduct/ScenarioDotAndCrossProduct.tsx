import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Scenario } from "@components";
import classes from "./ScenarioDotAndCrossProduct.module.css";

const EPSILON = 1e-6;

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
  const geometry = line.geometry;
  const positions = geometry.attributes.position;

  positions.setXYZ(0, start.x, start.y, start.z);
  positions.setXYZ(1, end.x, end.y, end.z);
  positions.needsUpdate = true;

  geometry.computeBoundingSphere();

  // Computes an array of distance values which are necessary for | LineDashedMaterial
  if ("computeLineDistances" in line) {
    line.computeLineDistances();
  }
}

export function ScenarioDotAndCrossProduct() {
  const { scene, camera } = useThree();

  const aRef = useRef<THREE.Mesh>(null);
  const bRef = useRef<THREE.Mesh>(null);
  const cRef = useRef<THREE.Mesh>(null);
  const dRef = useRef<THREE.Mesh>(null);
  const eRef = useRef<THREE.Mesh>(null);

  const lineABRef = useRef<THREE.Line>(null);
  const lineACRef = useRef<THREE.Line>(null);
  const lineProjectionRef = useRef<THREE.Line>(null);
  const linePerpendicularRef = useRef<THREE.Line>(null);
  const lineCrossRef = useRef<THREE.Line>(null);

  const infoRef = useRef<HTMLPreElement>(null);

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.14, 24, 24),
    []
  );

  const lineABGeometry = useMemo(() => makeLineGeometry(), []);
  const lineACGeometry = useMemo(() => makeLineGeometry(), []);
  const lineProjectionGeometry = useMemo(() => makeLineGeometry(), []);
  const linePerpendicularGeometry = useMemo(() => makeLineGeometry(), []);
  const lineCrossGeometry = useMemo(() => makeLineGeometry(), []);

  const data = useMemo(
    () => ({
      A: new THREE.Vector3(),
      B: new THREE.Vector3(),
      C: new THREE.Vector3(),

      AB: new THREE.Vector3(),
      AC: new THREE.Vector3(),
      acDirection: new THREE.Vector3(),

      projectionVector: new THREE.Vector3(),
      projectionPoint: new THREE.Vector3(),
      rejectionVector: new THREE.Vector3(),

      crossVector: new THREE.Vector3(),
      crossEnd: new THREE.Vector3()
    }),
    []
  );

  useEffect(() => {
    scene.background = new THREE.Color(0x000000);

    return () => {
      scene.background = null;
    };
  }, [scene]);

  useEffect(() => {
    camera.position.set(0, 0, 8);
    camera.rotation.set(0, 0, 0);

    if (camera instanceof THREE.OrthographicCamera) {
      camera.zoom = 90;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  useFrame(() => {
    const a = aRef.current;
    const b = bRef.current;
    const c = cRef.current;
    const d = dRef.current;
    const e = eRef.current;
    const lineAB = lineABRef.current;
    const lineAC = lineACRef.current;
    const lineProjection = lineProjectionRef.current;
    const linePerpendicular = linePerpendicularRef.current;
    const lineCross = lineCrossRef.current;
    if (
      !a ||
      !b ||
      !c ||
      !d ||
      !e ||
      !lineAB ||
      !lineAC ||
      !lineProjection ||
      !linePerpendicular ||
      !lineCross
    ) {
      return;
    }

    data.A.copy(a.position);
    data.B.copy(b.position);
    data.C.copy(c.position);

    data.AB.subVectors(data.B, data.A);
    data.AC.subVectors(data.C, data.A);

    setLinePoints(lineAB, data.A, data.B);
    setLinePoints(lineAC, data.A, data.C);

    const abLength = data.AB.length();
    const acLength = data.AC.length();

    if (acLength < EPSILON) {
      lineProjection.visible = false;
      linePerpendicular.visible = false;

      if (infoRef.current) {
        infoRef.current.textContent = "Move C away from A to define vector AC.";
      }

      return;
    }

    lineProjection.visible = true;
    linePerpendicular.visible = true;

    data.acDirection.copy(data.AC).normalize();

    const projectionLength = data.AB.dot(data.acDirection);

    data.projectionVector
      .copy(data.acDirection)
      .multiplyScalar(projectionLength);

    data.projectionPoint.copy(data.A).add(data.projectionVector);

    d.position.copy(data.projectionPoint);

    const adLength = data.A.distanceTo(data.projectionPoint);
    const bdLength = data.B.distanceTo(data.projectionPoint);

    // calculated but not used
    data.rejectionVector.subVectors(data.B, data.projectionPoint);

    setLinePoints(lineProjection, data.A, data.projectionPoint);
    setLinePoints(linePerpendicular, data.projectionPoint, data.B);

    const angle = abLength < EPSILON ? 0 : data.AB.angleTo(data.AC);

    const cosine = abLength < EPSILON ? 0 : projectionLength / abLength;

    data.crossVector.crossVectors(data.AB, data.acDirection);
    data.crossEnd.copy(data.A).add(data.crossVector);
    setLinePoints(lineCross, data.A, data.crossEnd);
    e.position.copy(data.crossEnd);

    const sine = data.crossVector.length() / Math.max(abLength, EPSILON);

    const perpendicularLength = data.crossVector.length();

    if (infoRef.current) {
      infoRef.current.textContent = [
        "Dot / Cross Product Experiment",
        "",
        `|AB| = ${abLength.toFixed(3)}`,
        `|AC| = ${acLength.toFixed(3)}`,
        `θ = ${THREE.MathUtils.radToDeg(angle).toFixed(2)}°`,
        "",
        `D = projection of B onto line AC`,
        `|AD| = ${adLength.toFixed(3)}`,
        `|BD| = ${bdLength.toFixed(3)}`,
        "",
        `Projection length on AC`,
        `AB · normalize(AC) = ${projectionLength.toFixed(3)}`,
        `|AB| cos(θ)          = ${(abLength * Math.cos(angle)).toFixed(3)}`,
        "",
        `Perpendicular length to AC`,
        `|AB × normalize(AC)| = ${perpendicularLength.toFixed(3)}`,
        `|AB| sin(θ)          = ${(abLength * Math.sin(angle)).toFixed(3)}`,
        `|AE| = ${perpendicularLength.toFixed(3)}`,
        "",
        `cos(θ) = ${cosine.toFixed(4)} (|AD| / |AB|)`,
        `sin(θ) = ${sine.toFixed(4)} (|AE| / |AB|)`
      ].join("\n");
    }
  });

  return (
    <Scenario
      unselectableChildren={
        <>
          <ambientLight intensity={1.5} />
          <directionalLight position={[4, 6, 5]} intensity={2.5} />
          <gridHelper
            args={[10, 10, "#444444", "#222222"]}
            position={[0, -2.5, 0]}
          />
          {/* TS DOM conflict workaround */}
          {/* https://github.com/pmndrs/react-three-fiber/issues/34 */}
          <threeLine ref={lineABRef} geometry={lineABGeometry} name="AB">
            <lineBasicMaterial color="#55ff88" transparent opacity={0.5} />
          </threeLine>
          <threeLine ref={lineACRef} geometry={lineACGeometry} name="AC">
            <lineBasicMaterial color="#5599ff" transparent opacity={0.5} />
          </threeLine>
          <threeLine
            ref={lineProjectionRef}
            geometry={lineProjectionGeometry}
            name="Projection AB on AC"
          >
            <lineBasicMaterial color="#ff9900" />
          </threeLine>
          <threeLine
            ref={linePerpendicularRef}
            geometry={linePerpendicularGeometry}
            name="Perpendicular / Cross component"
          >
            <lineDashedMaterial
              color="#ff9f1c"
              transparent
              opacity={0.5}
              dashSize={0.05}
              gapSize={0.05}
            />
          </threeLine>
          <threeLine
            ref={lineCrossRef}
            geometry={lineCrossGeometry}
            name="Cross Vector"
          >
            <lineDashedMaterial
              color="#00ff66"
              transparent
              opacity={0.8}
              dashSize={0.08}
              gapSize={0.05}
            />
          </threeLine>
          <mesh ref={dRef} name="D" geometry={sphereGeometry}>
            <meshStandardMaterial color="#ffd166" />
            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>D</div>
            </Html>
          </mesh>
          <mesh ref={eRef} name="E" geometry={sphereGeometry} scale={0.65}>
            <meshStandardMaterial color="#00ff66" />

            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>E</div>
            </Html>
          </mesh>
          <Html
            calculatePosition={(_, __, { height }) => [12, height - 550]}
            style={{ pointerEvents: "none" }}
          >
            <pre ref={infoRef} className={classes.htmlInfo} />
          </Html>
        </>
      }
      selectableChildren={
        <>
          <mesh
            ref={aRef}
            name="A"
            position={[-2, -1, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#ff5555" />
            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>A</div>
            </Html>
          </mesh>
          <mesh
            ref={bRef}
            name="B"
            position={[1.4, 1.8, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#55ff88" />
            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>B</div>
            </Html>
          </mesh>
          <mesh
            ref={cRef}
            name="C"
            position={[2.5, -1, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#5599ff" />
            <Html center className={classes.htmlSphereLabel}>
              <div className={classes.sphereLabel}>C</div>
            </Html>
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioDotAndCrossProduct;
