import * as THREE from "three";
import { extend } from "@react-three/fiber";

// TS DOM conflict workaround
// https://github.com/pmndrs/react-three-fiber/issues/34
// https://github.com/pmndrs/react-three-fiber/blob/ff3899dbf43d2a88895fecf53c147192abfd7431/packages/fiber/src/three-types.ts#L69
extend({
  ThreeAudio: THREE.Audio,
  ThreeSource: THREE.Source,
  ThreeLine: THREE.Line,
  ThreePath: THREE.Path
});
