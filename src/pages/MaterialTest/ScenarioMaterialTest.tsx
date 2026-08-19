import * as THREE from "three";
import GUI from "lil-gui";
import { useEffect, useMemo, useRef, useState } from "react";
import { Environment, useTexture } from "@react-three/drei";
import { useCubeCamera } from "@components";
import { Scenario } from "@components";
import { useFrame } from "@react-three/fiber";

const platformDefaultMaterialSpruitSunriseColor = new THREE.Color().setHSL(
  0.13,
  0.61,
  0.08
);
const platformDefaultMaterialMilkyWayColor = new THREE.Color().setHSL(
  0.64,
  0.61,
  0.08
);

const platformDefaultMaterialDefaultColor = new THREE.Color().setHSL(
  0.0,
  0.0,
  0.07
);

type MeshType = "cube" | "sphere" | "plane";
type PlatformMaterialType = "default" | "mirror";

const meshTypes: MeshType[] = ["cube", "sphere", "plane"];

const materialTypes = [
  "MeshBasicMaterial",
  "MeshStandardMaterial",
  "MeshLambertMaterial",
  "MeshPhongMaterial",
  "MeshPhysicalMaterial",
  "MeshToonMaterial",
  "MeshMatcapMaterial",
  "MeshNormalMaterial"
] as const;

type MaterialType = (typeof materialTypes)[number];

const materialsMap: Record<MaterialType, THREE.Material> = {
  MeshBasicMaterial: new THREE.MeshBasicMaterial(),
  MeshStandardMaterial: new THREE.MeshStandardMaterial(),
  MeshLambertMaterial: new THREE.MeshLambertMaterial(),
  MeshPhongMaterial: new THREE.MeshPhongMaterial(),
  MeshPhysicalMaterial: new THREE.MeshPhysicalMaterial(),
  MeshToonMaterial: new THREE.MeshToonMaterial(),
  MeshMatcapMaterial: new THREE.MeshMatcapMaterial(),
  MeshNormalMaterial: new THREE.MeshNormalMaterial()
};

const pbrTexture = {
  map: "/textures/pbr/Rocks005/Rocks005_1K-JPG_Color.jpg",
  displacementMap: "/textures/pbr/Rocks005/Rocks005_1K-JPG_Displacement.jpg",
  normalMap: "/textures/pbr/Rocks005/Rocks005_1K-JPG_NormalGL.jpg",
  roughnessMap: "/textures/pbr/Rocks005/Rocks005_1K-JPG_Roughness.jpg",
  aoMap: "/textures/pbr/Rocks005/Rocks005_1K-JPG_AmbientOcclusion.jpg"
};

const minTessellation = 1;
const maxTessellation = 300;

const sceneBackgrounds = [
  "None",
  "SpruitSunrise",
  "MilkyWay",
  "Park3Med",
  "SkyboxSun",
  "Pisa"
] as const;

type SceneBackgroundName = (typeof sceneBackgrounds)[number];

const cubeCoords = ["px", "nx", "py", "ny", "pz", "nz"];

const texturesPisa = cubeCoords.map(
  (t) => `/textures/background/cube/pisa/${t}.png`
);

const textureSpruitSunrise =
  "/textures/background/equirectangular/spruit_sunrise_4k.hdr.jpg";

const texturesMilkyWay = cubeCoords.map(
  (t) => `/textures/background/cube/MilkyWay/dark-s_${t}.jpg`
);

const texturesPark3Med = cubeCoords.map(
  (t) => `/textures/background/cube/Park3Med/${t}.jpg`
);

const texturesSkyboxSun = cubeCoords.map(
  (t) => `/textures/background/cube/skyboxsun25deg/${t}.jpg`
);

const backgroundTexturesMap: Record<
  SceneBackgroundName,
  string[] | string | null
> = {
  None: null,
  SpruitSunrise: textureSpruitSunrise,
  MilkyWay: texturesMilkyWay,
  Park3Med: texturesPark3Med,
  SkyboxSun: texturesSkyboxSun,
  Pisa: texturesPisa
};

export function MaterialTest() {
  const [meshType, setMeshType] = useState<MeshType>("sphere");
  const [platformMaterialType, setPlatformMaterialType] =
    useState<PlatformMaterialType>("mirror");
  const [materialType, setMaterialType] = useState<MaterialType>(
    "MeshStandardMaterial"
  );
  const [sceneBackgroundName, setSceneBackgroundName] =
    useState<SceneBackgroundName>("Park3Med");
  const [tessellation, setTessellation] = useState(80);
  const [showPlatform, setShowPlatform] = useState(true);

  const guiRef = useRef<GUI | null>(null);

  const maps = useTexture(pbrTexture);

  const paramsRef = useRef({
    materialType,
    meshType,
    tessellation,
    wireframe: false,
    showPlatform,
    platformMaterial: platformMaterialType,
    sceneBackground: sceneBackgroundName
  });

  const material = useMemo(() => {
    const mat = materialsMap[materialType].clone();

    for (const key in maps) {
      // @ts-ignore
      if (maps[key] instanceof THREE.Texture && key in mat) {
        // @ts-ignore
        mat[key] = maps[key];
      }
    }

    mat.needsUpdate = true;

    return mat;
  }, [materialType, maps]);

  useEffect(() => {
    if ("displacementMap" in material) {
      (material as THREE.MeshStandardMaterial).displacementScale = 1;
    }
    if ("aoMap" in material) {
      (material as THREE.MeshStandardMaterial).aoMapIntensity = 1;
    }
    if ("roughnessMap" in material) {
      (material as THREE.MeshStandardMaterial).roughness = 1;
    }
    if ("normalMap" in material) {
      (material as THREE.MeshStandardMaterial).normalScale.set(1, 1);
    }
    if ("wireframe" in material) {
      (material as THREE.MeshBasicMaterial).wireframe =
        paramsRef.current.wireframe;
    }
    material.needsUpdate = true;

    return () => {
      material.dispose();
    };
  }, [material]);

  useEffect(() => {
    const gui = new GUI({
      title: "Material Test"
    });

    guiRef.current = gui;

    gui
      .add(paramsRef.current, "materialType", materialTypes)
      .name("Current Material")
      .onChange((value: MaterialType) => {
        setMaterialType(value);
      });

    gui
      .add(paramsRef.current, "meshType", meshTypes)
      .name("Current Mesh")
      .onChange((value: MeshType) => {
        setMeshType(value);
      });

    gui
      .add(
        paramsRef.current,
        "tessellation",
        minTessellation,
        maxTessellation,
        1
      )
      .name("Tessellation")
      .onChange((value: number) => {
        setTessellation(value);
      });

    if ("wireframe" in material) {
      gui
        .add(paramsRef.current, "wireframe")
        .name("Wireframe")
        .onChange((value: boolean) => {
          material.wireframe = value;
        });
    }

    gui
      .add(paramsRef.current, "showPlatform")
      .name("Show Platform")
      .onChange((value: boolean) => {
        setShowPlatform(value);
      });

    gui
      .add(paramsRef.current, "platformMaterial", {
        Default: "default",
        Mirror: "mirror"
      })
      .name("Platform Material")
      .onChange((value: PlatformMaterialType) => {
        setPlatformMaterialType(value);
      });

    gui
      .add(paramsRef.current, "sceneBackground", sceneBackgrounds)
      .name("Scene Background")
      .onChange((value: SceneBackgroundName) => {
        setSceneBackgroundName(value);
      });

    return () => {
      gui.destroy();
      guiRef.current = null;
    };
  }, [material]);

  const platformRef = useRef<THREE.Mesh | null>(null);

  const {
    camera: cubeCamera,
    update: updateCubeCamera,
    fbo
  } = useCubeCamera({
    resolution: 1024,
    near: 0.1,
    far: 1000,
    // name forces new renderTarget (fbo) - workaround for Pisa PMREM cache bug
    name: sceneBackgroundName
  });

  useFrame(() => {
    if (platformMaterialType !== "mirror" || !platformRef.current) {
      return;
    }
    platformRef.current.visible = false;
    updateCubeCamera();
    platformRef.current.visible = true;
  });

  return (
    <Scenario
      selectableChildren={
        <>
          {sceneBackgroundName !== "None" && (
            <Environment
              key={sceneBackgroundName}
              files={backgroundTexturesMap[sceneBackgroundName]!}
              background
            />
          )}

          <primitive object={cubeCamera} position={[0, -20, 0]} />

          <directionalLight
            castShadow
            position={[-20, 20, 20]}
            intensity={4.5}
            color="white"
          />

          <spotLight
            castShadow
            position={[20, 20, 20]}
            intensity={6}
            distance={70}
            angle={Math.PI / 8}
            penumbra={0.5}
            decay={0.4}
          />

          <ambientLight color="white" intensity={0.1} />

          <mesh material={material} castShadow receiveShadow name={meshType}>
            {meshType === "cube" ? (
              <boxGeometry
                args={[10, 10, 10, tessellation, tessellation, tessellation]}
              />
            ) : meshType === "plane" ? (
              <planeGeometry args={[10, 10, tessellation, tessellation]} />
            ) : (
              <sphereGeometry args={[10, tessellation, tessellation]} />
            )}
          </mesh>

          {showPlatform && (
            <mesh
              ref={platformRef}
              name="platform"
              rotation={[-Math.PI / 2, 0, 0]}
              position={[0, -20, 0]}
              receiveShadow
            >
              {platformMaterialType === "default" ? (
                <meshStandardMaterial
                  color={
                    sceneBackgroundName === "SpruitSunrise"
                      ? platformDefaultMaterialSpruitSunriseColor
                      : sceneBackgroundName === "MilkyWay"
                        ? platformDefaultMaterialMilkyWayColor
                        : platformDefaultMaterialDefaultColor
                  }
                  side={THREE.DoubleSide}
                  envMap={null}
                />
              ) : (
                <meshStandardMaterial
                  color={new THREE.Color().setRGB(1, 1, 1)}
                  envMap={fbo.texture}
                  metalness={1}
                  roughness={0}
                />
              )}
              <boxGeometry args={[100, 100, 5]} />
            </mesh>
          )}
        </>
      }
    />
  );
}
