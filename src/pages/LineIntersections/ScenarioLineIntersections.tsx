import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Pane } from "tweakpane";

import { HtmlInfo, Scenario } from "@components";
import { HtmlLabel } from "@src/components/HtmlLabel/HtmlLabel";
import { makeLineGeometry, setLinePoints } from "@lib/utils";
import {
  lineIntersectLine2D,
  lineIntersectLine3D,
  cross2D
} from "@lib/math/intersections";
/*
 * ============================================================
 * SCENARIO
 * ============================================================
 */

export function ScenarioLineIntersections() {
  /*
   * ----------------------------------------------------------
   * 2D POINTS
   * ----------------------------------------------------------
   */

  const point2DARef = useRef<THREE.Mesh>(null);
  const point2DBRef = useRef<THREE.Mesh>(null);
  const point2DCRef = useRef<THREE.Mesh>(null);
  const point2DDRef = useRef<THREE.Mesh>(null);

  const line2DABRef = useRef<THREE.Line>(null);
  const line2DCDRef = useRef<THREE.Line>(null);

  const intersection2DRef = useRef<THREE.Mesh>(null);

  /*
   * ----------------------------------------------------------
   * 3D POINTS
   * ----------------------------------------------------------
   */

  const point3DARef = useRef<THREE.Mesh>(null);
  const point3DBRef = useRef<THREE.Mesh>(null);
  const point3DCRef = useRef<THREE.Mesh>(null);
  const point3DDRef = useRef<THREE.Mesh>(null);

  const line3DABRef = useRef<THREE.Line>(null);
  const line3DCDRef = useRef<THREE.Line>(null);

  const intersection3DRef = useRef<THREE.Mesh>(null);

  /*
   * ----------------------------------------------------------
   * INFO
   * ----------------------------------------------------------
   */

  const infoRef = useRef<HTMLPreElement>(null);

  /*
   * ----------------------------------------------------------
   * GEOMETRY
   * ----------------------------------------------------------
   */

  const pointGeometry = useMemo(
    () => new THREE.SphereGeometry(0.13, 24, 24),
    []
  );

  const intersectionGeometry = useMemo(
    () => new THREE.SphereGeometry(0.18, 24, 24),
    []
  );

  const line2DABGeometry = useMemo(() => makeLineGeometry(), []);

  const line2DCDGeometry = useMemo(() => makeLineGeometry(), []);

  const line3DABGeometry = useMemo(() => makeLineGeometry(), []);

  const line3DCDGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * ----------------------------------------------------------
   * PARAMETERS
   * ----------------------------------------------------------
   */

  const params = useMemo(
    () => ({
      intersectionType: "segment_segment" as const
    }),
    []
  );

  /*
   * ----------------------------------------------------------
   * REUSABLE DATA
   * ----------------------------------------------------------
   *
   * We keep these vectors around instead of allocating new
   * vectors every frame.
   */

  const data = useMemo(
    () => ({
      /*
       * 2D world positions.
       *
       * The actual meshes are Vector3 because we're rendering
       * them in Three.js, but intersection math uses x/y only.
       */

      A2World: new THREE.Vector3(),
      B2World: new THREE.Vector3(),
      C2World: new THREE.Vector3(),
      D2World: new THREE.Vector3(),

      A2: new THREE.Vector2(),
      B2: new THREE.Vector2(),
      C2: new THREE.Vector2(),
      D2: new THREE.Vector2(),

      /*
       * Useful for displaying t/s.
       */

      v2: new THREE.Vector2(),
      u2: new THREE.Vector2(),
      c2: new THREE.Vector2(),

      /*
       * 3D positions.
       */

      A3: new THREE.Vector3(),
      B3: new THREE.Vector3(),
      C3: new THREE.Vector3(),
      D3: new THREE.Vector3(),

      v3: new THREE.Vector3(),
      u3: new THREE.Vector3(),
      c3: new THREE.Vector3(),

      /*
       * Intersection results.
       */

      intersection2D: new THREE.Vector2(),
      intersection3D: new THREE.Vector3()
    }),
    []
  );

  /*
   * ==========================================================
   * TWEAKPANE
   * ==========================================================
   */

  useEffect(() => {
    const pane = new Pane({
      title: "Line intersections"
    });

    pane.addBinding(params, "intersectionType", {
      label: "type",
      options: {
        "Segment / Segment": "segment_segment",
        "Line / Line": "line_line",
        "Segment / Line": "segment_line",
        "Line / Segment": "line_segment"
      }
    });

    return () => {
      pane.dispose();
    };
  }, [params]);

  /*
   * ==========================================================
   * UPDATE
   * ==========================================================
   */

  useFrame(() => {
    const A2Object = point2DARef.current;
    const B2Object = point2DBRef.current;
    const C2Object = point2DCRef.current;
    const D2Object = point2DDRef.current;

    const A3Object = point3DARef.current;
    const B3Object = point3DBRef.current;
    const C3Object = point3DCRef.current;
    const D3Object = point3DDRef.current;

    const line2DAB = line2DABRef.current;
    const line2DCD = line2DCDRef.current;

    const line3DAB = line3DABRef.current;
    const line3DCD = line3DCDRef.current;

    const intersection2DObject = intersection2DRef.current;
    const intersection3DObject = intersection3DRef.current;

    if (
      !A2Object ||
      !B2Object ||
      !C2Object ||
      !D2Object ||
      !A3Object ||
      !B3Object ||
      !C3Object ||
      !D3Object ||
      !line2DAB ||
      !line2DCD ||
      !line3DAB ||
      !line3DCD ||
      !intersection2DObject ||
      !intersection3DObject
    ) {
      return;
    }

    /*
     * ========================================================
     * 1. READ 2D POINTS
     * ========================================================
     */

    A2Object.getWorldPosition(data.A2World);
    B2Object.getWorldPosition(data.B2World);
    C2Object.getWorldPosition(data.C2World);
    D2Object.getWorldPosition(data.D2World);

    /*
     * We deliberately ignore Z.
     *
     * The mathematical 2D world is:
     *
     *     (x, y)
     */

    data.A2.set(data.A2World.x, data.A2World.y);

    data.B2.set(data.B2World.x, data.B2World.y);

    data.C2.set(data.C2World.x, data.C2World.y);

    data.D2.set(data.D2World.x, data.D2World.y);

    /*
     * Force visualization onto Z = 0.
     */

    data.A2World.z = 0;
    data.B2World.z = 0;
    data.C2World.z = 0;
    data.D2World.z = 0;

    setLinePoints(line2DAB, data.A2World, data.B2World);

    setLinePoints(line2DCD, data.C2World, data.D2World);

    /*
     * ========================================================
     * 2. TEST 2D INTERSECTION
     * ========================================================
     */

    const result2D = lineIntersectLine2D({
      A: data.A2,
      B: data.B2,
      C: data.C2,
      D: data.D2,
      intersectionType: params.intersectionType
    });

    if (result2D) {
      intersection2DObject.visible = true;

      intersection2DObject.position.set(result2D.x, result2D.y, 0);
    } else {
      intersection2DObject.visible = false;
    }

    /*
     * ========================================================
     * 3. CALCULATE 2D t / s FOR DISPLAY
     * ========================================================
     */

    data.v2.subVectors(data.B2, data.A2);
    data.u2.subVectors(data.D2, data.C2);
    data.c2.subVectors(data.C2, data.A2);

    const denominator2D = cross2D(data.v2, data.u2);

    let t2: number | null = null;
    let s2: number | null = null;

    if (Math.abs(denominator2D) > 1e-8) {
      t2 = cross2D(data.c2, data.u2) / denominator2D;

      s2 = cross2D(data.c2, data.v2) / denominator2D;
    }

    /*
     * ========================================================
     * 4. READ 3D POINTS
     * ========================================================
     */

    A3Object.getWorldPosition(data.A3);
    B3Object.getWorldPosition(data.B3);
    C3Object.getWorldPosition(data.C3);
    D3Object.getWorldPosition(data.D3);

    setLinePoints(line3DAB, data.A3, data.B3);

    setLinePoints(line3DCD, data.C3, data.D3);

    /*
     * Directions:
     *
     * v = B - A
     * u = D - C
     */

    data.v3.subVectors(data.B3, data.A3);

    data.u3.subVectors(data.D3, data.C3);

    data.c3.subVectors(data.C3, data.A3);

    /*
     * ========================================================
     * 5. TEST 3D INTERSECTION
     * ========================================================
     */

    const result3D = lineIntersectLine3D({
      p: data.A3,
      v: data.v3,
      q: data.C3,
      u: data.u3,
      intersectionType: params.intersectionType
    });

    if (result3D) {
      intersection3DObject.visible = true;
      intersection3DObject.position.copy(result3D);
    } else {
      intersection3DObject.visible = false;
    }

    /*
     * ========================================================
     * 6. CALCULATE 3D t / s FOR DISPLAY
     * ========================================================
     */

    const n3 = new THREE.Vector3().crossVectors(data.v3, data.u3);

    const nLengthSq3 = n3.lengthSq();

    let t3: number | null = null;
    let s3: number | null = null;
    let skewDistance: number | null = null;

    if (nLengthSq3 > 1e-12) {
      const cCrossU = new THREE.Vector3().crossVectors(data.c3, data.u3);

      const cCrossV = new THREE.Vector3().crossVectors(data.c3, data.v3);

      t3 = cCrossU.dot(n3) / nLengthSq3;

      s3 = cCrossV.dot(n3) / nLengthSq3;

      skewDistance = Math.abs(data.c3.dot(n3)) / Math.sqrt(nLengthSq3);
    }

    /*
     * ========================================================
     * 7. INFO
     * ========================================================
     */

    if (infoRef.current) {
      infoRef.current.textContent = [
        "LINE INTERSECTION",
        "",
        `mode = ${params.intersectionType}`,
        "",

        "======================================",
        "2D INTERSECTION",
        "======================================",
        "",

        `A = (${data.A2.x.toFixed(2)}, ${data.A2.y.toFixed(2)})`,
        `B = (${data.B2.x.toFixed(2)}, ${data.B2.y.toFixed(2)})`,
        "",
        `C = (${data.C2.x.toFixed(2)}, ${data.C2.y.toFixed(2)})`,
        `D = (${data.D2.x.toFixed(2)}, ${data.D2.y.toFixed(2)})`,
        "",

        "P(t) = A + t(B - A)",
        "Q(s) = C + s(D - C)",
        "",

        `t = ${t2 === null ? "undefined" : t2.toFixed(4)}`,
        `s = ${s2 === null ? "undefined" : s2.toFixed(4)}`,
        "",

        result2D
          ? `INTERSECTION = (${result2D.x.toFixed(3)}, ${result2D.y.toFixed(3)})`
          : "INTERSECTION = none",

        "",

        "======================================",
        "3D INTERSECTION",
        "======================================",
        "",

        `A = (${data.A3.x.toFixed(2)}, ${data.A3.y.toFixed(2)}, ${data.A3.z.toFixed(2)})`,
        `B = (${data.B3.x.toFixed(2)}, ${data.B3.y.toFixed(2)}, ${data.B3.z.toFixed(2)})`,
        "",
        `C = (${data.C3.x.toFixed(2)}, ${data.C3.y.toFixed(2)}, ${data.C3.z.toFixed(2)})`,
        `D = (${data.D3.x.toFixed(2)}, ${data.D3.y.toFixed(2)}, ${data.D3.z.toFixed(2)})`,
        "",

        "L1(t) = A + t(B - A)",
        "L2(s) = C + s(D - C)",
        "",

        `t = ${t3 === null ? "undefined" : t3.toFixed(4)}`,
        `s = ${s3 === null ? "undefined" : s3.toFixed(4)}`,
        "",

        `skew distance = ${
          skewDistance === null ? "undefined" : skewDistance.toFixed(6)
        }`,

        "",

        result3D
          ? `INTERSECTION = (${result3D.x.toFixed(3)}, ${result3D.y.toFixed(3)}, ${result3D.z.toFixed(3)})`
          : "INTERSECTION = none"
      ].join("\n");
    }
  });

  /*
   * ==========================================================
   * SCENE
   * ==========================================================
   */

  return (
    <Scenario
      unselectableChildren={
        <>
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 7, 5]} intensity={2} />

          <gridHelper args={[20, 20, "#444444", "#222222"]} />

          <axesHelper args={[2]} />

          {/*
           * ==================================================
           * 2D LINES
           * ==================================================
           */}

          <threeLine ref={line2DABRef} geometry={line2DABGeometry} name="2D AB">
            <lineBasicMaterial color="#ffaa00" />
          </threeLine>

          <threeLine ref={line2DCDRef} geometry={line2DCDGeometry} name="2D CD">
            <lineBasicMaterial color="#5599ff" />
          </threeLine>

          <mesh
            ref={intersection2DRef}
            geometry={intersectionGeometry}
            visible={false}
          >
            <meshStandardMaterial color="#44ff44" />

            <HtmlLabel
              textStyle={{
                transform: "translateY(-45px)"
              }}
            >
              2D intersection
            </HtmlLabel>
          </mesh>

          {/*
           * ==================================================
           * 3D LINES
           * ==================================================
           */}

          <threeLine ref={line3DABRef} geometry={line3DABGeometry} name="3D AB">
            <lineBasicMaterial color="#ff44aa" />
          </threeLine>

          <threeLine ref={line3DCDRef} geometry={line3DCDGeometry} name="3D CD">
            <lineBasicMaterial color="#44ffff" />
          </threeLine>

          <mesh
            ref={intersection3DRef}
            geometry={intersectionGeometry}
            visible={false}
          >
            <meshStandardMaterial color="#44ff44" />

            <HtmlLabel
              textStyle={{
                transform: "translateY(-45px)"
              }}
            >
              3D intersection
            </HtmlLabel>
          </mesh>

          <HtmlInfo infoRef={infoRef} />
        </>
      }

      selectableChildren={
        <>
          {/*
           * ==================================================
           * 2D POINTS
           *
           * Initial values are exactly your previous example:
           *
           * A = (1, 4)
           * B = (7, 0.5)
           * C = (0, 0)
           * D = (7, 5)
           * ==================================================
           */}

          <mesh
            ref={point2DARef}
            name="2D A"
            position={[1, 4, 0]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ffaa00" />
            <HtmlLabel>2D A</HtmlLabel>
          </mesh>

          <mesh
            ref={point2DBRef}
            name="2D B"
            position={[7, 0.5, 0]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ffaa00" />
            <HtmlLabel>2D B</HtmlLabel>
          </mesh>

          <mesh
            ref={point2DCRef}
            name="2D C"
            position={[0, 0, 0]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#5599ff" />
            <HtmlLabel>2D C</HtmlLabel>
          </mesh>

          <mesh
            ref={point2DDRef}
            name="2D D"
            position={[7, 5, 0]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#5599ff" />
            <HtmlLabel>2D D</HtmlLabel>
          </mesh>

          {/*
           * ==================================================
           * 3D POINTS
           *
           * These initially intersect at:
           *
           * (2, 2, 3)
           *
           * AB:
           *
           * A = (-1, 2, 3)
           * B = (5, 2, 3)
           *
           * CD:
           *
           * C = (2, -1, 0)
           * D = (2, 5, 6)
           * ==================================================
           */}

          <mesh
            ref={point3DARef}
            name="3D A"
            position={[-1, 2, 3]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ff44aa" />
            <HtmlLabel>3D A</HtmlLabel>
          </mesh>

          <mesh
            ref={point3DBRef}
            name="3D B"
            position={[5, 2, 3]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ff44aa" />
            <HtmlLabel>3D B</HtmlLabel>
          </mesh>

          <mesh
            ref={point3DCRef}
            name="3D C"
            position={[2, -1, 0]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#44ffff" />
            <HtmlLabel>3D C</HtmlLabel>
          </mesh>

          <mesh
            ref={point3DDRef}
            name="3D D"
            position={[2, 5, 6]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#44ffff" />
            <HtmlLabel>3D D</HtmlLabel>
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioLineIntersections;
