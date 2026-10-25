import * as m4 from "@lib/webgl2fundamentals/m4";
import type { Matrix4 } from "@lib/webgl2fundamentals/m4";

export type Vec3 = [number, number, number];

export interface TRSOptions {
  translation?: Vec3;
  rotation?: Vec3;
  scale?: Vec3;
}

// A local transform kept as its three parts (Translation, Rotation, Scale)
// instead of as a matrix. The parts are easy to animate (e.g. just change
// rotation[0]); the matrix is rebuilt from them whenever it is needed.
//
// The matrix is T * Rx * Ry * Rz * S: a vertex is scaled first,
// then rotated around z, y, x (in that order) and finally translated.
export class TRS {
  translation: Vec3;
  // Euler angles, in radians
  rotation: Vec3;
  scale: Vec3;

  constructor({
    translation = [0, 0, 0],
    rotation = [0, 0, 0],
    scale = [1, 1, 1]
  }: TRSOptions = {}) {
    this.translation = translation;
    this.rotation = rotation;
    this.scale = scale;
  }

  // Writes the matrix into dst (no allocation every frame) and returns it.
  getMatrix(dst: Matrix4 = new Float32Array(16)): Matrix4 {
    const [tx, ty, tz] = this.translation;
    const [rx, ry, rz] = this.rotation;
    const [sx, sy, sz] = this.scale;

    m4.translation(tx, ty, tz, dst);
    m4.xRotate(dst, rx, dst);
    m4.yRotate(dst, ry, dst);
    m4.zRotate(dst, rz, dst);
    m4.scale(dst, sx, sy, sz, dst);
    return dst;
  }
}
