import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Scenario } from "@components";

const EPSILON = 1e-6;

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

  if ("computeLineDistances" in line) {
    line.computeLineDistances();
  }
}

function makeLineGeometry() {
  return new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(),
    new THREE.Vector3()
  ]);
}

export function ScenarioDotAndCrossProduct() {
  const { scene, camera } = useThree();

  const aRef = useRef<THREE.Mesh>(null);
  const bRef = useRef<THREE.Mesh>(null);
  const cRef = useRef<THREE.Mesh>(null);

  const lineABRef = useRef<THREE.Line>(null);
  const lineACRef = useRef<THREE.Line>(null);
  const lineProjectionRef = useRef<THREE.Line>(null);
  const linePerpendicularRef = useRef<THREE.Line>(null);

  const infoRef = useRef<HTMLPreElement>(null);

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.14, 24, 24),
    []
  );

  const lineABGeometry = useMemo(() => makeLineGeometry(), []);
  const lineACGeometry = useMemo(() => makeLineGeometry(), []);
  const lineProjectionGeometry = useMemo(() => makeLineGeometry(), []);
  const linePerpendicularGeometry = useMemo(() => makeLineGeometry(), []);

  const temp = useMemo(
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

      crossVector: new THREE.Vector3()
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

    const lineAB = lineABRef.current;
    const lineAC = lineACRef.current;
    const lineProjection = lineProjectionRef.current;
    const linePerpendicular = linePerpendicularRef.current;

    if (
      !a ||
      !b ||
      !c ||
      !lineAB ||
      !lineAC ||
      !lineProjection ||
      !linePerpendicular
    ) {
      return;
    }

    temp.A.copy(a.position);
    temp.B.copy(b.position);
    temp.C.copy(c.position);

    temp.AB.subVectors(temp.B, temp.A);
    temp.AC.subVectors(temp.C, temp.A);

    setLinePoints(lineAB, temp.A, temp.B);
    setLinePoints(lineAC, temp.A, temp.C);

    const abLength = temp.AB.length();
    const acLength = temp.AC.length();

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

    temp.acDirection.copy(temp.AC).normalize();

    const projectionLength = temp.AB.dot(temp.acDirection);

    temp.projectionVector
      .copy(temp.acDirection)
      .multiplyScalar(projectionLength);

    temp.projectionPoint.copy(temp.A).add(temp.projectionVector);

    temp.rejectionVector.subVectors(temp.B, temp.projectionPoint);

    setLinePoints(lineProjection, temp.A, temp.projectionPoint);
    setLinePoints(linePerpendicular, temp.projectionPoint, temp.B);

    const angle = abLength < EPSILON ? 0 : temp.AB.angleTo(temp.AC);

    const cosine = abLength < EPSILON ? 0 : projectionLength / abLength;

    temp.crossVector.crossVectors(temp.AB, temp.acDirection);

    const sine = temp.crossVector.length() / Math.max(abLength, EPSILON);

    const perpendicularLength = temp.crossVector.length();

    if (infoRef.current) {
      infoRef.current.textContent = [
        "Dot / Cross Product Experiment",
        "",
        `|AB| = ${abLength.toFixed(3)}`,
        `|AC| = ${acLength.toFixed(3)}`,
        `θ = ${THREE.MathUtils.radToDeg(angle).toFixed(2)}°`,
        "",
        `Projection length on AC`,
        `AB · normalize(AC) = ${projectionLength.toFixed(3)}`,
        `|AB| cos(θ)          = ${(abLength * Math.cos(angle)).toFixed(3)}`,
        "",
        `Perpendicular length to AC`,
        `|AB × normalize(AC)| = ${perpendicularLength.toFixed(3)}`,
        `|AB| sin(θ)          = ${(abLength * Math.sin(angle)).toFixed(3)}`,
        "",
        `cos(θ) = ${cosine.toFixed(4)}`,
        `sin(θ) = ${sine.toFixed(4)}`
      ].join("\n");
    }
  });

  return (
    <Scenario
      selectableChildren={
        <>
          <ambientLight intensity={1.5} />
          <directionalLight position={[4, 6, 5]} intensity={2.5} />

          <axesHelper args={[3]} />
          <gridHelper
            args={[10, 10, "#444444", "#222222"]}
            position={[0, -2.5, 0]}
          />

          <mesh
            ref={aRef}
            name="A"
            position={[-2, -1, 0]}
            geometry={sphereGeometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#ff5555" />
            <Html center style={{ pointerEvents: "none", color: "#ffffff" }}>
              <div
                style={{
                  transform: "translateY(-22px)",
                  fontSize: 12,
                  fontFamily:
                    '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
                }}
              >
                A
              </div>
            </Html>
          </mesh>

          <mesh
            ref={bRef}
            name="B"
            position={[1.4, 1.8, 0.8]}
            geometry={sphereGeometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#55ff88" />
            <Html center style={{ pointerEvents: "none", color: "#ffffff" }}>
              <div
                style={{
                  transform: "translateY(-22px)",
                  fontSize: 12,
                  fontFamily:
                    '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
                }}
              >
                B
              </div>
            </Html>
          </mesh>

          <mesh
            ref={cRef}
            name="C"
            position={[2.5, -0.4, 0]}
            geometry={sphereGeometry}
            castShadow
            receiveShadow
          >
            <meshStandardMaterial color="#5599ff" />
            <Html center style={{ pointerEvents: "none", color: "#ffffff" }}>
              <div
                style={{
                  transform: "translateY(-22px)",
                  fontSize: 12,
                  fontFamily:
                    '"SFMono-Regular", Consolas, "Liberation Mono", monospace'
                }}
              >
                C
              </div>
            </Html>
          </mesh>

          <line ref={lineABRef} geometry={lineABGeometry} name="AB">
            <lineBasicMaterial color="#55ff88" />
          </line>

          <line ref={lineACRef} geometry={lineACGeometry} name="AC">
            <lineBasicMaterial color="#5599ff" />
          </line>

          <line
            ref={lineProjectionRef}
            geometry={lineProjectionGeometry}
            name="Projection AB on AC"
          >
            <lineBasicMaterial color="#ffd166" />
          </line>

          <line
            ref={linePerpendicularRef}
            geometry={linePerpendicularGeometry}
            name="Perpendicular / Cross component"
          >
            <lineDashedMaterial
              color="#ff9f1c"
              dashSize={0.15}
              gapSize={0.08}
            />
          </line>

          <Html
            calculatePosition={() => [12, 12]}
            style={{ pointerEvents: "none" }}
          >
            <pre
              ref={infoRef}
              style={{
                margin: 0,
                padding: "12px 14px",
                minWidth: 320,
                color: "#eee",
                background: "rgba(20, 20, 20, 0.92)",
                border: "1px solid #444",
                borderRadius: 6,
                fontFamily:
                  '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
                fontSize: 12,
                lineHeight: 1.45,
                whiteSpace: "pre-wrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)"
              }}
            />
          </Html>
        </>
      }
    />
  );
}

export default ScenarioDotAndCrossProduct;
