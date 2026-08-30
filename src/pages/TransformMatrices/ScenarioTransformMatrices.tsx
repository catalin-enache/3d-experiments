import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Pane } from "tweakpane";
import { HtmlInfo, Scenario } from "@components";
import { makeLineGeometry, setLinePoints } from "@lib/utils";
import { HtmlLabel } from "@src/components/HtmlLabel/HtmlLabel";

function formatMatrix4(matrix: THREE.Matrix4) {
  /*
   * THREE.Matrix4.elements is stored column-major internally,
   * but we display it in the usual mathematical row layout.
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

  const cubeGeometry = useMemo(() => new THREE.BoxGeometry(0.8, 0.8, 0.8), []);

  const sphereGeometry = useMemo(
    () => new THREE.SphereGeometry(0.12, 24, 24),
    []
  );

  const axisLineGeometry = useMemo(() => makeLineGeometry(), []);

  /*
   * ---------------------------------------------------------
   * USER PARAMETERS
   * ---------------------------------------------------------
   *
   * These values are converted directly into:
   *
   * S = scale matrix
   * R = arbitrary-axis rotation matrix
   * T = translation matrix
   *
   * Final:
   *
   * M = T * R * S
   */
  const params = useMemo(
    () => ({
      translation: {
        x: 2,
        y: 1,
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
      /*
       * Axis points in world space.
       */
      axisA: new THREE.Vector3(),
      axisB: new THREE.Vector3(),

      /*
       * Only the direction A -> B matters for rotation.
       */
      axisDirection: new THREE.Vector3(),

      /*
       * Individual transform matrices.
       */
      scaleMatrix: new THREE.Matrix4(),
      rotationMatrix: new THREE.Matrix4(),
      translationMatrix: new THREE.Matrix4(),

      /*
       * Intermediate result:
       *
       * R * S
       */
      rotationScaleMatrix: new THREE.Matrix4(),

      /*
       * Final:
       *
       * T * R * S
       */
      finalMatrix: new THREE.Matrix4(),

      /*
       * For displaying the final transformed basis.
       */
      transformedX: new THREE.Vector3(),
      transformedY: new THREE.Vector3(),
      transformedZ: new THREE.Vector3(),

      finalPosition: new THREE.Vector3()
    }),
    []
  );

  useEffect(() => {
    const pane = new Pane({
      title: "Transform matrices"
    });

    /*
     * ---------------------------------------------------------
     * TRANSLATION
     * ---------------------------------------------------------
     */
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

    /*
     * ---------------------------------------------------------
     * ROTATION
     * ---------------------------------------------------------
     *
     * The angle is applied around the direction defined by:
     *
     * normalize(B - A)
     */
    const rotationFolder = pane.addFolder({
      title: "Rotation"
    });

    rotationFolder.addBinding(params, "rotationDegrees", {
      label: "angle",
      min: -180,
      max: 180,
      step: 1
    });

    /*
     * ---------------------------------------------------------
     * SCALE
     * ---------------------------------------------------------
     */
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
     * =========================================================
     * 1. GET ROTATION AXIS DIRECTION
     * =========================================================
     *
     * The two spheres DO NOT define the rotation pivot anymore.
     *
     * They only define a direction:
     *
     *          B - A
     * u = ----------------
     *       | B - A |
     *
     * The resulting axis is conceptually moved to the cube's
     * own local origin.
     */

    axisAObject.getWorldPosition(data.axisA);
    axisBObject.getWorldPosition(data.axisB);

    data.axisDirection.subVectors(data.axisB, data.axisA);

    const axisLength = data.axisDirection.length();

    if (axisLength < 0.00001) {
      return;
    }

    data.axisDirection.normalize();

    /*
     * Display the A -> B direction in the world.
     *
     * This line is only a visual reference.
     * The cube does NOT rotate around this physical line.
     */
    setLinePoints(axisLine, data.axisA, data.axisB);

    /*
     * =========================================================
     * 2. SCALE MATRIX
     * =========================================================
     *
     *        sx  0   0   0
     * S =     0 sy   0   0
     *         0  0  sz   0
     *         0  0   0   1
     */

    data.scaleMatrix.makeScale(params.scale.x, params.scale.y, params.scale.z);

    /*
     * =========================================================
     * 3. ROTATION MATRIX
     * =========================================================
     *
     * Arbitrary axis rotation.
     *
     * Axis:
     *
     * normalize(B - A)
     *
     * IMPORTANT:
     *
     * This rotation matrix rotates around an axis through
     * the LOCAL ORIGIN.
     *
     * Since the cube geometry is centered around its local
     * origin, it rotates around its own center.
     */

    const angleRadians = THREE.MathUtils.degToRad(params.rotationDegrees);

    data.rotationMatrix.makeRotationAxis(data.axisDirection, angleRadians);

    /*
     * =========================================================
     * 4. TRANSLATION MATRIX
     * =========================================================
     *
     * This is where the cube is finally placed in world space.
     *
     *         1 0 0 tx
     * T =     0 1 0 ty
     *         0 0 1 tz
     *         0 0 0 1
     */

    data.translationMatrix.makeTranslation(
      params.translation.x,
      params.translation.y,
      params.translation.z
    );

    /*
     * =========================================================
     * 5. MATRIX MULTIPLICATION
     * =========================================================
     *
     * Column vector convention:
     *
     * p' = M p
     *
     * Final matrix:
     *
     * M = T * R * S
     *
     * Operations happen right -> left:
     *
     * p
     * ↓
     * S
     * ↓
     * R
     * ↓
     * T
     * ↓
     * p'
     */

    /*
     * First:
     *
     * R * S
     */
    data.rotationScaleMatrix.multiplyMatrices(
      data.rotationMatrix,
      data.scaleMatrix
    );

    /*
     * Then:
     *
     * T * (R * S)
     *
     * Therefore:
     *
     * M = T * R * S
     */
    data.finalMatrix.multiplyMatrices(
      data.translationMatrix,
      data.rotationScaleMatrix
    );

    /*
     * =========================================================
     * 6. APPLY FINAL MATRIX DIRECTLY
     * =========================================================
     *
     * We deliberately do NOT do:
     *
     * cube.position.set(...)
     * cube.rotation.set(...)
     * cube.scale.set(...)
     *
     * The matrix itself controls the cube.
     */

    cube.matrix.copy(data.finalMatrix);

    cube.matrixWorldNeedsUpdate = true;

    /*
     * =========================================================
     * 7. EXTRACT FINAL BASIS VECTORS
     * =========================================================
     *
     * For a column-vector transform matrix:
     *
     * column 1 = transformed X basis
     * column 2 = transformed Y basis
     * column 3 = transformed Z basis
     * column 4 = translation
     *
     * THREE stores Matrix4 elements column-major internally.
     */

    const e = data.finalMatrix.elements;

    data.transformedX.set(e[0], e[1], e[2]);

    data.transformedY.set(e[4], e[5], e[6]);

    data.transformedZ.set(e[8], e[9], e[10]);

    data.finalPosition.set(e[12], e[13], e[14]);

    /*
     * =========================================================
     * 8. INFO PANEL
     * =========================================================
     */

    if (infoRef.current) {
      infoRef.current.textContent = [
        "OBJECT TRANSFORM",
        "",
        "M = T × R × S",
        "",
        "Applied right → left:",
        "",
        "Local point",
        "   ↓",
        "Scale",
        "   ↓",
        "Rotate around cube center",
        "   ↓",
        "Translate",
        "   ↓",
        "World point",
        "",
        "======================================",
        "ROTATION AXIS DIRECTION",
        "======================================",
        "",
        `A = (${data.axisA.x.toFixed(2)}, ${data.axisA.y.toFixed(2)}, ${data.axisA.z.toFixed(2)})`,
        `B = (${data.axisB.x.toFixed(2)}, ${data.axisB.y.toFixed(2)}, ${data.axisB.z.toFixed(2)})`,
        "",
        "u = normalize(B - A)",
        "",
        `u = (${data.axisDirection.x.toFixed(3)}, ${data.axisDirection.y.toFixed(3)}, ${data.axisDirection.z.toFixed(3)})`,
        "",
        `angle = ${params.rotationDegrees.toFixed(1)}°`,
        "",
        "NOTE:",
        "A and B define only the rotation DIRECTION.",
        "The cube rotates around a parallel axis",
        "passing through its own center.",
        "",
        "======================================",
        "SCALE MATRIX  S",
        "======================================",
        "",
        formatMatrix4(data.scaleMatrix),
        "",
        "======================================",
        "ROTATION MATRIX  R",
        "======================================",
        "",
        formatMatrix4(data.rotationMatrix),
        "",
        "======================================",
        "R × S",
        "======================================",
        "",
        formatMatrix4(data.rotationScaleMatrix),
        "",
        "======================================",
        "TRANSLATION MATRIX  T",
        "======================================",
        "",
        formatMatrix4(data.translationMatrix),
        "",
        "======================================",
        "FINAL MATRIX",
        "======================================",
        "",
        "M = T × R × S",
        "",
        formatMatrix4(data.finalMatrix),
        "",
        "======================================",
        "FINAL MATRIX COLUMNS",
        "======================================",
        "",
        `X' = (${data.transformedX.x.toFixed(3)}, ${data.transformedX.y.toFixed(3)}, ${data.transformedX.z.toFixed(3)})`,
        "",
        `Y' = (${data.transformedY.x.toFixed(3)}, ${data.transformedY.y.toFixed(3)}, ${data.transformedY.z.toFixed(3)})`,
        "",
        `Z' = (${data.transformedZ.x.toFixed(3)}, ${data.transformedZ.y.toFixed(3)}, ${data.transformedZ.z.toFixed(3)})`,
        "",
        `T  = (${data.finalPosition.x.toFixed(3)}, ${data.finalPosition.y.toFixed(3)}, ${data.finalPosition.z.toFixed(3)})`
      ].join("\n");
    }
  });

  return (
    <Scenario
      unselectableChildren={
        <>
          <ambientLight intensity={1.5} />

          <directionalLight position={[5, 7, 5]} intensity={2} />

          {/*
           * ---------------------------------------------------
           * WORLD COORDINATE SYSTEM
           * ---------------------------------------------------
           */}
          <gridHelper args={[14, 14, "#444444", "#222222"]} />

          <axesHelper args={[2]} />

          {/*
           * ---------------------------------------------------
           * TRANSFORMED CUBE
           * ---------------------------------------------------
           *
           * This object is controlled ONLY by finalMatrix.
           *
           * matrixAutoUpdate must therefore be false.
           */}
          <mesh
            ref={cubeRef}
            name="Matrix Result Cube"
            geometry={cubeGeometry}
            matrixAutoUpdate={false}
          >
            <meshStandardMaterial color="#44ee77" />

            {/*
             * This axesHelper is a CHILD of the cube.
             *
             * Therefore it shows the cube's transformed
             * local coordinate system.
             */}
            <axesHelper
              args={[1]}
              userData={{
                noSelect: true
              }}
            />
            <HtmlLabel
              textStyle={{
                transform: "translateY(-62px)"
              }}
            >
              M = T × R × S
            </HtmlLabel>
          </mesh>

          {/*
           * ---------------------------------------------------
           * AXIS DIRECTION VISUALIZATION
           * ---------------------------------------------------
           *
           * IMPORTANT:
           *
           * This is NOT the physical pivot axis anymore.
           *
           * It merely visualizes the direction A -> B.
           */}
          <threeLine
            ref={axisLineRef}
            geometry={axisLineGeometry}
            name="Rotation Axis Direction"
          >
            <lineBasicMaterial color="#ffaa00" />
          </threeLine>

          {/*
           * ---------------------------------------------------
           * MATRIX INFO
           * ---------------------------------------------------
           */}
          <HtmlInfo infoRef={infoRef} />
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
            name="Axis Direction A"
            position={[0, 0, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#ff5555" />
            <HtmlLabel>A</HtmlLabel>
          </mesh>

          {/*
           * ---------------------------------------------------
           * AXIS POINT B
           * ---------------------------------------------------
           */}
          <mesh
            ref={axisBRef}
            name="Axis Direction B"
            position={[0, 1, 0]}
            geometry={sphereGeometry}
          >
            <meshStandardMaterial color="#5599ff" />
            <HtmlLabel>B</HtmlLabel>
          </mesh>
        </>
      }
    />
  );
}

export default ScenarioTransformMatrices;
