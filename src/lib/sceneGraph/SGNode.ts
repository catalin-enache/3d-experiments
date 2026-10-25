import * as m4 from "@lib/webgl2fundamentals/m4";
import type { Matrix4 } from "@lib/webgl2fundamentals/m4";

// Anything that can produce a local matrix, e.g. a TRS.
export interface MatrixSource {
  getMatrix(dst?: Matrix4): Matrix4;
}

// A Scene Graph Node (SGNode, so it does not clash with the DOM `Node`).
// A scene graph is a tree where every node has a matrix
// relative to its parent (localMatrix) and children that follow it.
//
// The matrix that places the node in the world (worldMatrix) is the parent's
// worldMatrix times the node's localMatrix, so moving / rotating a node
// moves / rotates its whole subtree:
//
//   world(node) = world(parent) * local(node)
//               = local(root) * ... * local(parent) * local(node)
export class SGNode {
  readonly children: SGNode[] = [];
  parent: SGNode | null = null;
  readonly localMatrix: Matrix4 = m4.identity();
  readonly worldMatrix: Matrix4 = m4.identity();
  // when set, localMatrix is recomputed from it on every updateWorldMatrix
  source?: MatrixSource;

  constructor(source?: MatrixSource) {
    this.source = source;
  }

  // Moves this node (with its subtree) under another parent,
  // or detaches it when parent is null.
  setParent(parent: SGNode | null) {
    if (this.parent) {
      const index = this.parent.children.indexOf(this);
      if (index >= 0) this.parent.children.splice(index, 1);
    }
    parent?.children.push(this);
    this.parent = parent;
  }

  // Recomputes the world matrices of this node and of its whole subtree,
  // walking from the root down so every parent is ready before its children.
  updateWorldMatrix(parentWorldMatrix?: Matrix4) {
    this.source?.getMatrix(this.localMatrix);

    if (parentWorldMatrix) {
      m4.multiply(parentWorldMatrix, this.localMatrix, this.worldMatrix);
    } else {
      // the root: its local space is the world space
      m4.copy(this.localMatrix, this.worldMatrix);
    }

    for (const child of this.children) {
      child.updateWorldMatrix(this.worldMatrix);
    }
  }
}
