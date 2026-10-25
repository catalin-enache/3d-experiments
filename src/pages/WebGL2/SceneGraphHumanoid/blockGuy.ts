import { SGNode, TRS, type Vec3 } from "@lib/sceneGraph";

export type PartName =
  | "point between feet"
  | "waist"
  | "torso"
  | "neck"
  | "head"
  | "left-arm"
  | "left-forearm"
  | "left-hand"
  | "right-arm"
  | "right-forearm"
  | "right-hand"
  | "left-leg"
  | "left-calf"
  | "left-foot"
  | "right-leg"
  | "right-calf"
  | "right-foot";

interface PartDescription {
  name: PartName;
  // relative to the parent part
  translation?: Vec3;
  // false for the invisible nodes that only group / move their children
  draw?: boolean;
  children?: PartDescription[];
}

export interface Part {
  node: SGNode;
  // the node's source: change it to move the part (and everything under it)
  trs: TRS;
  draw: boolean;
}

// The block guy hierarchy. Every part is a unit cube,
// translated relative to its parent part.
const blockGuy: PartDescription = {
  name: "point between feet",
  draw: false,
  children: [
    {
      name: "waist",
      translation: [0, 3, 0],
      children: [
        {
          name: "torso",
          translation: [0, 2, 0],
          children: [
            {
              name: "neck",
              translation: [0, 1, 0],
              children: [{ name: "head", translation: [0, 1, 0] }]
            },
            {
              name: "left-arm",
              translation: [-1, 0, 0],
              children: [
                {
                  name: "left-forearm",
                  translation: [-1, 0, 0],
                  children: [{ name: "left-hand", translation: [-1, 0, 0] }]
                }
              ]
            },
            {
              name: "right-arm",
              translation: [1, 0, 0],
              children: [
                {
                  name: "right-forearm",
                  translation: [1, 0, 0],
                  children: [{ name: "right-hand", translation: [1, 0, 0] }]
                }
              ]
            }
          ]
        },
        {
          name: "left-leg",
          translation: [-1, -1, 0],
          children: [
            {
              name: "left-calf",
              translation: [0, -1, 0],
              children: [{ name: "left-foot", translation: [0, -1, 0] }]
            }
          ]
        },
        {
          name: "right-leg",
          translation: [1, -1, 0],
          children: [
            {
              name: "right-calf",
              translation: [0, -1, 0],
              children: [{ name: "right-foot", translation: [0, -1, 0] }]
            }
          ]
        }
      ]
    }
  ]
};

// Builds the scene graph from the description:
// one SGNode (with a TRS as its source) per part.
export function createBlockGuy() {
  const parts = {} as Record<PartName, Part>;

  function makePart(
    { name, translation, draw = true, children = [] }: PartDescription,
    parent: SGNode | null
  ) {
    // copy the translation: the animation changes it
    const trs = new TRS({ translation: translation && [...translation] });
    const node = new SGNode(trs);
    node.setParent(parent);
    parts[name] = { node, trs, draw };

    for (const child of children) makePart(child, node);

    return node;
  }

  const root = makePart(blockGuy, null);
  const drawnParts = Object.values(parts).filter(({ draw }) => draw);

  return { root, parts, drawnParts };
}
