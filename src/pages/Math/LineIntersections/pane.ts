import { Pane } from "tweakpane";

import type { IntersectionType } from "@lib/math/intersections";

export interface Params {
  intersectionType: IntersectionType;

  /*
   * Only for displaying the plane larger than the
   * raw O→U and O→V handles.
   */
  planeVisualScale: number;
}

export function createPane(params: Params) {
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

  return pane;
}
