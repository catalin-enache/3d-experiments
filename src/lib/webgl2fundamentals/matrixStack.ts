import * as m4 from "./m4";
import type { Matrix4 } from "./m4";

export class MatrixStack {
  private stack: Matrix4[] = [];

  constructor() {
    // since the stack is empty this will put an initial matrix in it
    this.restore();
  }

  // Pops the top of the stack restoring the previously saved matrix
  restore() {
    this.stack.pop();
    // Never let the stack be totally empty
    if (this.stack.length < 1) {
      this.stack[0] = m4.identity();
    }
  }

  // Pushes a copy of the current matrix on the stack
  save() {
    this.stack.push(this.getCurrentMatrix());
  }

  // Gets a copy of the current matrix (top of the stack)
  getCurrentMatrix() {
    return m4.copy(this.stack[this.stack.length - 1]);
  }

  // Lets us set the current matrix
  setCurrentMatrix(m: Matrix4) {
    this.stack[this.stack.length - 1] = m;
  }

  // Translates the current matrix
  translate(x: number, y: number, z = 0) {
    const m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.translate(m, x, y, z));
  }

  // Rotates the current matrix around X
  rotateX(angleInRadians: number) {
    const m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.xRotate(m, angleInRadians));
  }

  // Rotates the current matrix around Y
  rotateY(angleInRadians: number) {
    const m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.yRotate(m, angleInRadians));
  }

  // Rotates the current matrix around Z
  rotateZ(angleInRadians: number) {
    const m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.zRotate(m, angleInRadians));
  }

  // Scales the current matrix
  scale(x: number, y: number, z = 1) {
    const m = this.getCurrentMatrix();
    this.setCurrentMatrix(m4.scale(m, x, y, z));
  }
}
