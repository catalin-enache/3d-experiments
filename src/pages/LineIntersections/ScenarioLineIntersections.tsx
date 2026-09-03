import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Pane } from "tweakpane";

import { HtmlInfo, Scenario } from "@components";
import { HtmlLabel } from "@src/components/HtmlLabel/HtmlLabel";
import { makeLineGeometry, setLinePoints } from "@lib/utils";

import {
  intersectLineLine2D,
  intersectLineLine3D,
  intersectLinePlane,
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
   * 2D LINE / LINE
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
   * 3D LINE / LINE
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
   * 3D LINE / PLANE
   * ----------------------------------------------------------
   *
   * Line:
   *
   * L(t) = A + w*t
   *
   * w = B - A
   *
   *
   * Plane:
   *
   * P(a,e) = O + u*a + v*e
   *
   * u = U - O
   * v = V - O
   */

  const linePlaneARef = useRef<THREE.Mesh>(null);
  const linePlaneBRef = useRef<THREE.Mesh>(null);

  const planeOriginRef = useRef<THREE.Mesh>(null);
  const planeURef = useRef<THREE.Mesh>(null);
  const planeVRef = useRef<THREE.Mesh>(null);

  const linePlaneLineRef = useRef<THREE.Line>(null);

  const planeUVisualRef = useRef<THREE.Line>(null);
  const planeVVisualRef = useRef<THREE.Line>(null);

  const planeMeshRef = useRef<THREE.Mesh>(null);

  const intersectionPlaneRef = useRef<THREE.Mesh>(null);

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

  /*
   * 2D line geometries
   */

  const line2DABGeometry = useMemo(() => makeLineGeometry(), []);

  const line2DCDGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * 3D line geometries
   */

  const line3DABGeometry = useMemo(() => makeLineGeometry(), []);

  const line3DCDGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * Line / plane visual geometries
   */

  const linePlaneLineGeometry = useMemo(() => makeLineGeometry(), []);

  const planeUVisualGeometry = useMemo(() => makeLineGeometry(), []);

  const planeVVisualGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * Plane quad.
   *
   * Four vertices:
   *
   * O - u - v
   * O + u - v
   * O + u + v
   * O - u + v
   */

  const planeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(4 * 3), 3)
    );

    geometry.setIndex([0, 1, 2, 0, 2, 3]);

    return geometry;
  }, []);

  /*
   * ----------------------------------------------------------
   * PARAMETERS
   * ----------------------------------------------------------
   */

  const params = useMemo(
    () => ({
      intersectionType: "segment_segment" as const,

      /*
       * Only for displaying the plane larger than the
       * raw O→U and O→V handles.
       */
      planeVisualScale: 1.5
    }),
    []
  );

  /*
   * ----------------------------------------------------------
   * REUSABLE DATA
   * ----------------------------------------------------------
   */

  const data = useMemo(
    () => ({
      /*
       * ======================================================
       * 2D
       * ======================================================
       */

      A2World: new THREE.Vector3(),
      B2World: new THREE.Vector3(),
      C2World: new THREE.Vector3(),
      D2World: new THREE.Vector3(),

      A2: new THREE.Vector2(),
      B2: new THREE.Vector2(),
      C2: new THREE.Vector2(),
      D2: new THREE.Vector2(),

      v2: new THREE.Vector2(),
      u2: new THREE.Vector2(),
      c2: new THREE.Vector2(),

      /*
       * ======================================================
       * 3D LINE / LINE
       * ======================================================
       */

      A3: new THREE.Vector3(),
      B3: new THREE.Vector3(),
      C3: new THREE.Vector3(),
      D3: new THREE.Vector3(),

      v3: new THREE.Vector3(),
      u3: new THREE.Vector3(),
      c3: new THREE.Vector3(),

      /*
       * ======================================================
       * LINE / PLANE
       * ======================================================
       */

      linePlaneA: new THREE.Vector3(),
      linePlaneB: new THREE.Vector3(),

      planeOrigin: new THREE.Vector3(),
      planeUPoint: new THREE.Vector3(),
      planeVPoint: new THREE.Vector3(),

      /*
       * w = line direction
       *
       * planeU = first plane spanning vector
       * planeV = second plane spanning vector
       */

      w: new THREE.Vector3(),
      planeU: new THREE.Vector3(),
      planeV: new THREE.Vector3(),

      planeNormal: new THREE.Vector3(),

      planePointMinusA: new THREE.Vector3(),

      /*
       * Plane visualization corners
       */

      planeCorner0: new THREE.Vector3(),
      planeCorner1: new THREE.Vector3(),
      planeCorner2: new THREE.Vector3(),
      planeCorner3: new THREE.Vector3(),

      tempPlaneU: new THREE.Vector3(),
      tempPlaneV: new THREE.Vector3()
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
      title: "Intersections"
    });

    const lineLineFolder = pane.addFolder({
      title: "Line / Line"
    });

    lineLineFolder.addBinding(params, "intersectionType", {
      label: "type",
      options: {
        "Segment / Segment": "segment_segment",
        "Line / Line": "line_line",
        "Segment / Line": "segment_line",
        "Line / Segment": "line_segment"
      }
    });

    const planeFolder = pane.addFolder({
      title: "Line / Plane"
    });

    planeFolder.addBinding(params, "planeVisualScale", {
      label: "plane size",
      min: 0.5,
      max: 4,
      step: 0.1
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
    /*
     * ========================================================
     * GET REFERENCES
     * ========================================================
     */

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

    /*
     * Line / plane
     */

    const linePlaneAObject = linePlaneARef.current;

    const linePlaneBObject = linePlaneBRef.current;

    const planeOriginObject = planeOriginRef.current;

    const planeUObject = planeURef.current;

    const planeVObject = planeVRef.current;

    const linePlaneLine = linePlaneLineRef.current;

    const planeUVisual = planeUVisualRef.current;

    const planeVVisual = planeVVisualRef.current;

    const planeMesh = planeMeshRef.current;

    const intersectionPlaneObject = intersectionPlaneRef.current;

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
      !intersection3DObject ||
      !linePlaneAObject ||
      !linePlaneBObject ||
      !planeOriginObject ||
      !planeUObject ||
      !planeVObject ||
      !linePlaneLine ||
      !planeUVisual ||
      !planeVVisual ||
      !planeMesh ||
      !intersectionPlaneObject
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

    const result2D = intersectLineLine2D({
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
     * 4. READ 3D LINE / LINE POINTS
     * ========================================================
     */

    A3Object.getWorldPosition(data.A3);
    B3Object.getWorldPosition(data.B3);
    C3Object.getWorldPosition(data.C3);
    D3Object.getWorldPosition(data.D3);

    setLinePoints(line3DAB, data.A3, data.B3);

    setLinePoints(line3DCD, data.C3, data.D3);

    /*
     * v = B - A
     * u = D - C
     */

    data.v3.subVectors(data.B3, data.A3);

    data.u3.subVectors(data.D3, data.C3);

    data.c3.subVectors(data.C3, data.A3);

    /*
     * ========================================================
     * 5. TEST 3D LINE / LINE
     * ========================================================
     */

    const result3D = intersectLineLine3D({
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
     * 7. READ LINE / PLANE POINTS
     * ========================================================
     */

    linePlaneAObject.getWorldPosition(data.linePlaneA);

    linePlaneBObject.getWorldPosition(data.linePlaneB);

    planeOriginObject.getWorldPosition(data.planeOrigin);

    planeUObject.getWorldPosition(data.planeUPoint);

    planeVObject.getWorldPosition(data.planeVPoint);

    /*
     * Line direction:
     *
     * w = B - A
     */

    data.w.subVectors(data.linePlaneB, data.linePlaneA);

    /*
     * Plane spanning vectors:
     *
     * u = U - O
     * v = V - O
     */

    data.planeU.subVectors(data.planeUPoint, data.planeOrigin);

    data.planeV.subVectors(data.planeVPoint, data.planeOrigin);

    /*
     * ========================================================
     * 8. DRAW LINE / PLANE VISUALS
     * ========================================================
     */

    setLinePoints(linePlaneLine, data.linePlaneA, data.linePlaneB);

    setLinePoints(planeUVisual, data.planeOrigin, data.planeUPoint);

    setLinePoints(planeVVisual, data.planeOrigin, data.planeVPoint);

    /*
     * Plane normal:
     *
     * n = u × v
     */

    data.planeNormal.crossVectors(data.planeU, data.planeV);

    /*
     * ========================================================
     * 9. UPDATE PLANE QUAD
     * ========================================================
     *
     * The draggable U/V points define the plane basis.
     *
     * We scale those basis vectors slightly for easier
     * visualization.
     */

    data.tempPlaneU.copy(data.planeU).multiplyScalar(params.planeVisualScale);

    data.tempPlaneV.copy(data.planeV).multiplyScalar(params.planeVisualScale);

    /*
     * corner 0 = O - u - v
     */

    data.planeCorner0
      .copy(data.planeOrigin)
      .sub(data.tempPlaneU)
      .sub(data.tempPlaneV);

    /*
     * corner 1 = O + u - v
     */

    data.planeCorner1
      .copy(data.planeOrigin)
      .add(data.tempPlaneU)
      .sub(data.tempPlaneV);

    /*
     * corner 2 = O + u + v
     */

    data.planeCorner2
      .copy(data.planeOrigin)
      .add(data.tempPlaneU)
      .add(data.tempPlaneV);

    /*
     * corner 3 = O - u + v
     */

    data.planeCorner3
      .copy(data.planeOrigin)
      .sub(data.tempPlaneU)
      .add(data.tempPlaneV);

    const positionAttribute = planeGeometry.getAttribute(
      "position"
    ) as THREE.BufferAttribute;

    positionAttribute.setXYZ(
      0,
      data.planeCorner0.x,
      data.planeCorner0.y,
      data.planeCorner0.z
    );

    positionAttribute.setXYZ(
      1,
      data.planeCorner1.x,
      data.planeCorner1.y,
      data.planeCorner1.z
    );

    positionAttribute.setXYZ(
      2,
      data.planeCorner2.x,
      data.planeCorner2.y,
      data.planeCorner2.z
    );

    positionAttribute.setXYZ(
      3,
      data.planeCorner3.x,
      data.planeCorner3.y,
      data.planeCorner3.z
    );

    positionAttribute.needsUpdate = true;

    planeGeometry.computeVertexNormals();

    /*
     * ========================================================
     * 10. LINE / PLANE INTERSECTION
     * ========================================================
     */

    const resultPlane = intersectLinePlane({
      A: data.linePlaneA,
      w: data.w,

      planePoint: data.planeOrigin,

      planeU: data.planeU,

      planeV: data.planeV
    });

    if (resultPlane) {
      intersectionPlaneObject.visible = true;

      intersectionPlaneObject.position.copy(resultPlane);
    } else {
      intersectionPlaneObject.visible = false;
    }

    /*
     * ========================================================
     * 11. CALCULATE LINE / PLANE t FOR DISPLAY
     * ========================================================
     *
     * n = u × v
     *
     * t =
     *
     *     n · (O - A)
     *     -----------
     *        n · w
     */

    let tPlane: number | null = null;

    let linePlaneDenominator: number | null = null;

    if (data.planeNormal.lengthSq() > 1e-12) {
      data.planePointMinusA.subVectors(data.planeOrigin, data.linePlaneA);

      linePlaneDenominator = data.planeNormal.dot(data.w);

      if (Math.abs(linePlaneDenominator) > 1e-8) {
        tPlane =
          data.planeNormal.dot(data.planePointMinusA) / linePlaneDenominator;
      }
    }

    /*
     * ========================================================
     * 12. INFO
     * ========================================================
     */

    if (infoRef.current) {
      infoRef.current.textContent = [
        "INTERSECTIONS",
        "",

        "======================================",
        "2D LINE / LINE",
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
        "3D LINE / LINE",
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
          : "INTERSECTION = none",

        "",

        "======================================",
        "3D LINE / PLANE",
        "======================================",
        "",

        `A = (${data.linePlaneA.x.toFixed(2)}, ${data.linePlaneA.y.toFixed(2)}, ${data.linePlaneA.z.toFixed(2)})`,

        `B = (${data.linePlaneB.x.toFixed(2)}, ${data.linePlaneB.y.toFixed(2)}, ${data.linePlaneB.z.toFixed(2)})`,

        "",

        `w = B - A`,
        `w = (${data.w.x.toFixed(2)}, ${data.w.y.toFixed(2)}, ${data.w.z.toFixed(2)})`,

        "",

        `Plane O = (${data.planeOrigin.x.toFixed(2)}, ${data.planeOrigin.y.toFixed(2)}, ${data.planeOrigin.z.toFixed(2)})`,

        "",

        `u = (${data.planeU.x.toFixed(2)}, ${data.planeU.y.toFixed(2)}, ${data.planeU.z.toFixed(2)})`,

        `v = (${data.planeV.x.toFixed(2)}, ${data.planeV.y.toFixed(2)}, ${data.planeV.z.toFixed(2)})`,

        "",

        `n = u × v`,
        `n = (${data.planeNormal.x.toFixed(2)}, ${data.planeNormal.y.toFixed(2)}, ${data.planeNormal.z.toFixed(2)})`,

        "",

        "L(t) = A + w*t",

        "P(a,e) = O + u*a + v*e",

        "",

        "t = n·(O-A) / n·w",

        "",

        `n · w = ${
          linePlaneDenominator === null
            ? "undefined"
            : linePlaneDenominator.toFixed(4)
        }`,

        `t = ${tPlane === null ? "undefined" : tPlane.toFixed(4)}`,

        "",

        resultPlane
          ? `INTERSECTION H = (${resultPlane.x.toFixed(3)}, ${resultPlane.y.toFixed(3)}, ${resultPlane.z.toFixed(3)})`
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
           * 2D LINE / LINE
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
           * 3D LINE / LINE
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

          {/*
           * ==================================================
           * LINE / PLANE
           * ==================================================
           */}

          <threeLine
            ref={linePlaneLineRef}
            geometry={linePlaneLineGeometry}
            name="Line Plane - Line"
          >
            <lineBasicMaterial color="#ffffff" />
          </threeLine>

          {/*
           * Plane basis vector u
           */}

          <threeLine
            ref={planeUVisualRef}
            geometry={planeUVisualGeometry}
            name="Plane U"
          >
            <lineBasicMaterial color="#ff5555" />
          </threeLine>

          {/*
           * Plane basis vector v
           */}

          <threeLine
            ref={planeVVisualRef}
            geometry={planeVVisualGeometry}
            name="Plane V"
          >
            <lineBasicMaterial color="#5555ff" />
          </threeLine>

          {/*
           * Actual plane surface
           */}

          <mesh
            ref={planeMeshRef}
            geometry={planeGeometry}
            name="Intersection Plane"
          >
            <meshStandardMaterial
              color="#8844cc"
              transparent
              opacity={0.35}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>

          {/*
           * Line / plane intersection H
           */}

          <mesh
            ref={intersectionPlaneRef}
            geometry={intersectionGeometry}
            visible={false}
          >
            <meshStandardMaterial color="#44ff44" />

            <HtmlLabel
              textStyle={{
                transform: "translateY(-45px)"
              }}
            >
              H
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
           * 3D LINE / LINE POINTS
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

          {/*
           * ==================================================
           * LINE / PLANE POINTS
           *
           * Initial plane:
           *
           * O = (-5, 1, -2)
           *
           * u = (3, 0, 0)
           * v = (0, 3, 2)
           *
           * Line passes through the plane.
           * ==================================================
           */}

          <mesh
            ref={planeOriginRef}
            name="Plane O"
            position={[-5, 1, -2]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ffff55" />

            <HtmlLabel>Plane O</HtmlLabel>
          </mesh>

          <mesh
            ref={planeURef}
            name="Plane U"
            position={[-2, 1, -2]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ff5555" />

            <HtmlLabel>Plane U</HtmlLabel>
          </mesh>

          <mesh
            ref={planeVRef}
            name="Plane V"
            position={[-5, 4, -2]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#5555ff" />

            <HtmlLabel>Plane V</HtmlLabel>
          </mesh>

          {/*
           * Line:
           *
           * A -> B
           */}

          <mesh
            ref={linePlaneARef}
            name="Line Plane A"
            position={[-6, 4, 2]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ffffff" />

            <HtmlLabel>LP A</HtmlLabel>
          </mesh>

          <mesh
            ref={linePlaneBRef}
            name="Line Plane B"
            position={[-1.75, 0.43, -7]}
            geometry={pointGeometry}
          >
            <meshStandardMaterial color="#ffffff" />

            <HtmlLabel>LP B</HtmlLabel>
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioLineIntersections;
