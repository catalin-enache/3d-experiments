import { useState, type RefObject } from "react";
import clsx from "clsx";
import { Html } from "@react-three/drei";
import classes from "./HtmlInfo.module.css";

interface HtmlInfoProps {
  infoRef: RefObject<HTMLPreElement | null>;
}

export function HtmlInfo({ infoRef }: HtmlInfoProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Html
      calculatePosition={(_, __, ___) => [0, 0]}
      className={classes.htmlInfo}
      zIndexRange={[2, 2]}
    >
      <div className={classes.htmlInfoPanel}>
        <button
          type="button"
          className={classes.collapseButton}
          onClick={() => setCollapsed((value) => !value)}
        >
          {collapsed ? "▲" : "▼"}
        </button>

        {!collapsed && (
          <div
            className={clsx("overflow", classes.htmlInfoContent)}
            onWheel={(e) => {
              // Prevent other elements from receiving the wheel event.
              // Otherwise, they may prevent the browser's native scrolling.
              e.stopPropagation();
            }}
          >
            <pre ref={infoRef} className={classes.htmlInfoPre} />
          </div>
        )}
      </div>
    </Html>
  );
}
