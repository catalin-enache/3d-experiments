import GUI from "lil-gui";
import type { Material } from "three/webgpu";

export type MeshType = "cube" | "sphere" | "plane";
export type PlatformMaterialType = "default" | "mirror";

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

export type MaterialType = (typeof materialTypes)[number];

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

export type SceneBackgroundName = (typeof sceneBackgrounds)[number];

export interface Params {
  materialType: MaterialType;
  meshType: MeshType;
  tessellation: number;
  wireframe: boolean;
  showPlatform: boolean;
  platformMaterial: PlatformMaterialType;
  sceneBackground: SceneBackgroundName;
}

export interface Callbacks {
  onMaterialTypeChange: (value: MaterialType) => void;
  onMeshTypeChange: (value: MeshType) => void;
  onTessellationChange: (value: number) => void;
  onShowPlatformChange: (value: boolean) => void;
  onPlatformMaterialChange: (value: PlatformMaterialType) => void;
  onSceneBackgroundChange: (value: SceneBackgroundName) => void;
}

export function createGui(
  params: Params,
  material: Material,
  {
    onMaterialTypeChange,
    onMeshTypeChange,
    onTessellationChange,
    onShowPlatformChange,
    onPlatformMaterialChange,
    onSceneBackgroundChange
  }: Callbacks
) {
  const gui = new GUI({
    title: "Material Test"
  });

  gui
    .add(params, "materialType", materialTypes)
    .name("Current Material")
    .onChange((value: MaterialType) => {
      onMaterialTypeChange(value);
    });

  gui
    .add(params, "meshType", meshTypes)
    .name("Current Mesh")
    .onChange((value: MeshType) => {
      onMeshTypeChange(value);
    });

  gui
    .add(params, "tessellation", minTessellation, maxTessellation, 1)
    .name("Tessellation")
    .onChange((value: number) => {
      onTessellationChange(value);
    });

  if ("wireframe" in material) {
    gui
      .add(params, "wireframe")
      .name("Wireframe")
      .onChange((value: boolean) => {
        material.wireframe = value;
      });
  }

  gui
    .add(params, "showPlatform")
    .name("Show Platform")
    .onChange((value: boolean) => {
      onShowPlatformChange(value);
    });

  gui
    .add(params, "platformMaterial", {
      Default: "default",
      Mirror: "mirror"
    })
    .name("Platform Material")
    .onChange((value: PlatformMaterialType) => {
      onPlatformMaterialChange(value);
    });

  gui
    .add(params, "sceneBackground", sceneBackgrounds)
    .name("Scene Background")
    .onChange((value: SceneBackgroundName) => {
      onSceneBackgroundChange(value);
    });

  return gui;
}
