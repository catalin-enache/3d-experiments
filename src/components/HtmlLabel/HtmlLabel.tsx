import { type CSSProperties, type ReactNode } from "react";
import { Html } from "@react-three/drei";
import { type Camera, type Object3D } from "three/webgpu";

import classes from "./HtmlLabel.module.css";
import clsx from "clsx";

interface HtmlLabelProps {
  children: ReactNode;
  htmlClassName?: string;
  textClassName?: string;
  htmlStyle?: CSSProperties;
  textStyle?: CSSProperties;
  calculatePosition?: (
    object: Object3D,
    camera: Camera,
    dimensions: { width: number; height: number }
  ) => [number, number];
}

export const HtmlLabel = ({
  children,
  htmlClassName,
  textClassName,
  htmlStyle,
  textStyle
}: HtmlLabelProps) => {
  return (
    <Html
      center
      className={clsx(classes.htmlLabel, htmlClassName)}
      style={htmlStyle}
    >
      <div className={clsx(classes.content, textClassName)} style={textStyle}>
        {children}
      </div>
    </Html>
  );
};
