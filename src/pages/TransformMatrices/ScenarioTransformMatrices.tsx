import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Pane } from "tweakpane";
import { Scenario } from "@components";
import { makeLineGeometry, setLinePoints } from "@lib/utils";

function formatMatrix4(matrix: THREE.Matrix4) {
  /*
   * THREE.Matrix4.elements is stored column-major internally.
   * We display it in the familiar mathematical row layout.
   */
  const e = matrix.elements;

  const rows = [
    [e[0], e[4], e[8], e[12]],
    [e[1], e[5], e[9], e[13]],
    [e[2], e[6], e[10], e[14]],
    [e[3], e[7], e[11], e[15]]
  ];

  return rows
    .map(
      (row) =>
        `[ ${row.map((value) => value.toFixed(3).padStart(7)).join(" ")} ]`
    )
    .join("\n");
}

export function ScenarioTransformMatrices() {
  const axisARef = useRef<THREE.Mesh>(null);
  const axisBRef = useRef<THREE.Mesh>(null);

  const cubeRef = useRef<THREE.Mesh>(null);
  const axisLineRef = useRef<THREE.Line>(null);

  const infoRef = useRef<HTMLPreElement>(null);
  const paneContainerRef = useRef<HTMLDivElement>(null);

  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(0.6, 0.6, 0.6), []);

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.12, 24, 24),
    []
  );

  const axisLineGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * Parameters changed by Tweakpane.
   *
   * Translation is an extra world-space translation.
   * Rotation is around the arbitrary A -> B axis.
   * Scale acts on the cube in its own local space.
   */
  const params = useMemo(
    () => ({
      translation: {
        x: 0,
        y: 0,
        z: 0
      },

      rotationDegrees: 0,

      scale: {
        x: 1,
        y: 1,
        z: 1
      }
    }),
    []
  );

  const data = useMemo(
    () => ({
      axisA: new THREE.Vector3(),
      axisB: new THREE.Vector3(),

      axisDirection: new THREE.Vector3(),

      /*
       * Individual matrices.
       */
      scaleMatrix: new THREE.Matrix4(),
      cubeStartMatrix: new THREE.Matrix4(),

      translateAxisToOriginMatrix: new THREE.Matrix4(),
      rotationMatrix: new THREE.Matrix4(),
      translateAxisBackMatrix: new THREE.Matrix4(),

      userTranslationMatrix: new THREE.Matrix4(),

      /*
       * Intermediate products.
       */
      m1: new THREE.Matrix4(),
      m2: new THREE.Matrix4(),
      m3: new THREE.Matrix4(),
      m4: new THREE.Matrix4(),

      finalMatrix: new THREE.Matrix4()
    }),
    []
  );

  /*
   * Cube's original position before our matrix experiment.
   *
   * We deliberately do NOT assign this to cube.position.
   * It becomes part of the matrix multiplication.
   */
  const cubeStartPosition = useMemo(() => new THREE.Vector3(2, 1, 0), []);

  useEffect(() => {
    // if (!paneContainerRef.current) {
    //   return;
    // }

    const pane = new Pane({
      // container: paneContainerRef.current,
      title: "Transform matrices"
    });

    const translationFolder = pane.addFolder({
      title: "Translation"
    });

    translationFolder.addBinding(params.translation, "x", {
      min: -5,
      max: 5,
      step: 0.01
    });

    translationFolder.addBinding(params.translation, "y", {
      min: -5,
      max: 5,
      step: 0.01
    });

    translationFolder.addBinding(params.translation, "z", {
      min: -5,
      max: 5,
      step: 0.01
    });

    const rotationFolder = pane.addFolder({
      title: "Rotation around A → B"
    });

    rotationFolder.addBinding(params, "rotationDegrees", {
      label: "angle",
      min: -180,
      max: 180,
      step: 1
    });

    const scaleFolder = pane.addFolder({
      title: "Scale"
    });

    scaleFolder.addBinding(params.scale, "x", {
      min: 0.1,
      max: 3,
      step: 0.01
    });

    scaleFolder.addBinding(params.scale, "y", {
      min: 0.1,
      max: 3,
      step: 0.01
    });

    scaleFolder.addBinding(params.scale, "z", {
      min: 0.1,
      max: 3,
      step: 0.01
    });

    return () => {
      pane.dispose();
    };
  }, [params]);

  useFrame(() => {
    const axisAObject = axisARef.current;
    const axisBObject = axisBRef.current;
    const cube = cubeRef.current;
    const axisLine = axisLineRef.current;

    if (!axisAObject || !axisBObject || !cube || !axisLine) {
      return;
    }

    /*
     * ---------------------------------------------------------
     * GET THE ARBITRARY ROTATION AXIS
     * ---------------------------------------------------------
     */

    axisAObject.getWorldPosition(data.axisA);
    axisBObject.getWorldPosition(data.axisB);

    data.axisDirection.subVectors(data.axisB, data.axisA);

    const axisLength = data.axisDirection.length();

    /*
     * Avoid normalize() on a zero-length axis.
     */
    if (axisLength < 0.00001) {
      return;
    }

    data.axisDirection.normalize();

    /*
     * Visualize the axis.
     */
    setLinePoints(axisLine, data.axisA, data.axisB);

    /*
     * ---------------------------------------------------------
     * 1. SCALE MATRIX
     * ---------------------------------------------------------
     *
     *             sx  0   0   0
     * S =          0 sy   0   0
     *              0  0  sz   0
     *              0  0   0   1
     */

    data.scaleMatrix.makeScale(params.scale.x, params.scale.y, params.scale.z);

    /*
     * ---------------------------------------------------------
     * 2. INITIAL CUBE POSITION
     * ---------------------------------------------------------
     *
     * This establishes where the cube starts in world space.
     */

    data.cubeStartMatrix.makeTranslation(
      cubeStartPosition.x,
      cubeStartPosition.y,
      cubeStartPosition.z
    );

    /*
     * ---------------------------------------------------------
     * 3. MOVE ROTATION AXIS TO ORIGIN
     * ---------------------------------------------------------
     *
     * Rotation matrices rotate around an axis THROUGH THE ORIGIN.
     *
     * But our arbitrary axis passes through sphere A.
     *
     * So:
     *
     * T(-A)
     */

    data.translateAxisToOriginMatrix.makeTranslation(
      -data.axisA.x,
      -data.axisA.y,
      -data.axisA.z
    );

    /*
     * ---------------------------------------------------------
     * 4. ARBITRARY AXIS ROTATION
     * ---------------------------------------------------------
     *
     * Three.js makeRotationAxis() creates the Rodrigues
     * axis-angle matrix we discussed.
     */

    const angleRadians = THREE.MathUtils.degToRad(params.rotationDegrees);

    data.rotationMatrix.makeRotationAxis(data.axisDirection, angleRadians);

    /*
     * ---------------------------------------------------------
     * 5. MOVE ROTATION AXIS BACK
     * ---------------------------------------------------------
     *
     * T(A)
     */

    data.translateAxisBackMatrix.makeTranslation(
      data.axisA.x,
      data.axisA.y,
      data.axisA.z
    );

    /*
     * ---------------------------------------------------------
     * 6. USER TRANSLATION
     * ---------------------------------------------------------
     */

    data.userTranslationMatrix.makeTranslation(
      params.translation.x,
      params.translation.y,
      params.translation.z
    );

    /*
     * ---------------------------------------------------------
     * MATRIX MULTIPLICATION
     * ---------------------------------------------------------
     *
     * Column-vector convention:
     *
     * p' = M p
     *
     * Therefore the rightmost operation happens FIRST.
     *
     *
     * M =
     *
     * Tuser
     * × T(A)
     * × R
     * × T(-A)
     * × Tcube
     * × S
     *
     */

    data.m1.multiplyMatrices(data.cubeStartMatrix, data.scaleMatrix);

    data.m2.multiplyMatrices(data.translateAxisToOriginMatrix, data.m1);

    data.m3.multiplyMatrices(data.rotationMatrix, data.m2);

    data.m4.multiplyMatrices(data.translateAxisBackMatrix, data.m3);

    data.finalMatrix.multiplyMatrices(data.userTranslationMatrix, data.m4);

    /*
     * ---------------------------------------------------------
     * APPLY THE FINAL MATRIX DIRECTLY TO THE CUBE
     * ---------------------------------------------------------
     *
     * This is important:
     *
     * We are NOT setting
     *
     * cube.position
     * cube.rotation
     * cube.scale
     *
     * independently.
     *
     * The cube receives exactly the matrix we calculated above.
     */

    cube.matrix.copy(data.finalMatrix);
    cube.matrixWorldNeedsUpdate = true;

    /*
     * ---------------------------------------------------------
     * INFORMATION PANEL
     * ---------------------------------------------------------
     */

    if (infoRef.current) {
      infoRef.current.textContent = [
        "ARBITRARY AXIS TRANSFORM",
        "",
        `A = (${data.axisA.x.toFixed(2)}, ${data.axisA.y.toFixed(2)}, ${data.axisA.z.toFixed(2)})`,
        `B = (${data.axisB.x.toFixed(2)}, ${data.axisB.y.toFixed(2)}, ${data.axisB.z.toFixed(2)})`,
        "",
        `axis = normalize(B - A)`,
        `     = (${data.axisDirection.x.toFixed(3)}, ${data.axisDirection.y.toFixed(3)}, ${data.axisDirection.z.toFixed(3)})`,
        "",
        `angle = ${params.rotationDegrees.toFixed(1)}°`,
        "",
        "======================================",
        "S",
        "======================================",
        formatMatrix4(data.scaleMatrix),
        "",
        "======================================",
        "T cube start",
        "======================================",
        formatMatrix4(data.cubeStartMatrix),
        "",
        "======================================",
        "T(-A)",
        "======================================",
        formatMatrix4(data.translateAxisToOriginMatrix),
        "",
        "======================================",
        "R axis",
        "======================================",
        formatMatrix4(data.rotationMatrix),
        "",
        "======================================",
        "T(A)",
        "======================================",
        formatMatrix4(data.translateAxisBackMatrix),
        "",
        "======================================",
        "T user",
        "======================================",
        formatMatrix4(data.userTranslationMatrix),
        "",
        "======================================",
        "FINAL",
        "======================================",
        "",
        "M = Tuser × T(A) × R × T(-A) × Tcube × S",
        "",
        formatMatrix4(data.finalMatrix)
      ].join("\n");
    }
  });

  return (
    <Scenario
      unselectableChildren={
        <>
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 7, 5]} intensity={2} />

          <gridHelper args={[14, 14, "#444444", "#222222"]} />

          <axesHelper args={[2]} />

          {/*
           * ---------------------------------------------------
           * RESULT CUBE
           * ---------------------------------------------------
           *
           * matrixAutoUpdate={false} is essential.
           *
           * Otherwise Three.js would rebuild cube.matrix from
           * position / quaternion / scale every frame.
           */}
          <mesh
            ref={cubeRef}
            name="Matrix Result Cube"
            geometry={cubeGeometry}
            matrixAutoUpdate={false}
          >
            <meshStandardMaterial color="#55ff88" />

            <axesHelper args={[0.8]} userData={{ noSelect: true }} />

            <Html
              center
              className="htmlLabel"
              style={{
                pointerEvents: "none"
              }}
            >
              <div
                style={{
                  transform: "translateY(-52px)"
                }}
              >
                M × Cube
              </div>
            </Html>
          </mesh>

          {/*
           * Arbitrary rotation axis line.
           */}
          <threeLine
            ref={axisLineRef}
            geometry={axisLineGeometry}
            name="Rotation Axis"
          >
            <lineBasicMaterial color="#ffaa00" />
          </threeLine>

          {/*
           * Matrix display.
           */}
          <Html
            calculatePosition={(_, __, { height }) => [12, height - 900]}
            style={{
              pointerEvents: "none"
            }}
          >
            <pre
              ref={infoRef}
              className="htmlInfo"
              style={{
                fontSize: "11px",
                lineHeight: 1.25,
                minWidth: "430px"
              }}
            />
          </Html>

          {/*
           * Tweakpane must receive pointer events.
           */}
          <Html calculatePosition={(_, __, { width }) => [width - 330, 20]}>
            <div
              ref={paneContainerRef}
              style={{
                width: "300px"
              }}
            />
          </Html>
        </>
      }

      selectableChildren={
        <>
          {/*
           * ---------------------------------------------------
           * AXIS POINT A
           * ---------------------------------------------------
           */}
          <mesh
            ref={axisARef}
            name="Axis A"
            position={[-1, 0, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#ff5555" />

            <Html
              center
              className="htmlLabel"
              style={{
                pointerEvents: "none"
              }}
            >
              <div>A</div>
            </Html>
          </mesh>

          {/*
           * ---------------------------------------------------
           * AXIS POINT B
           * ---------------------------------------------------
           */}
          <mesh
            ref={axisBRef}
            name="Axis B"
            position={[1, 1, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#5599ff" />

            <Html
              center
              className="htmlLabel"
              style={{
                pointerEvents: "none"
              }}
            >
              <div>B</div>
            </Html>
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioTransformMatrices;
