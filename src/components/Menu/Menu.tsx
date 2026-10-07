import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  flatRoutes,
  isRouteGroup,
  joinPath,
  routesConfig,
  type RouteNode
} from "@src/constants/routesConfig";
import classes from "./Menu.module.css";
import clsx from "clsx";

const isInGroup = (pathname: string, groupPath: string) =>
  pathname.startsWith(`${groupPath}/`);

interface MenuItemsProps {
  nodes: RouteNode[];
  parentPath: string;
  depth: number;
  pathname: string;
  // user toggled state per group path; groups not in the map fall back to "contains active route"
  expandedGroups: Record<string, boolean>;
  onToggleGroup: (groupPath: string, expanded: boolean) => void;
  onNavigate: () => void;
}

function MenuItems({
  nodes,
  parentPath,
  depth,
  pathname,
  expandedGroups,
  onToggleGroup,
  onNavigate
}: MenuItemsProps) {
  const indentStyle = { "--depth": depth } as CSSProperties;

  return nodes.map((node) => {
    const path = joinPath(parentPath, node.segment);

    if (isRouteGroup(node)) {
      const containsActive = isInGroup(pathname, path);
      const expanded = expandedGroups[path] ?? containsActive;

      return (
        <div key={path}>
          <button
            type="button"
            style={indentStyle}
            onClick={() => {
              onToggleGroup(path, !expanded);
            }}
            className={clsx(
              classes.link,
              classes.group,
              containsActive && classes.activeGroup
            )}
          >
            {expanded ? "▾" : "▸"} {node.name}
          </button>
          {expanded && (
            <MenuItems
              nodes={node.children}
              parentPath={path}
              depth={depth + 1}
              pathname={pathname}
              expandedGroups={expandedGroups}
              onToggleGroup={onToggleGroup}
              onNavigate={onNavigate}
            />
          )}
        </div>
      );
    }

    return (
      <Link
        key={path}
        to={path}
        style={indentStyle}
        onClick={onNavigate}
        className={clsx(classes.link, pathname === path && classes.activeLink)}
      >
        {node.name}
      </Link>
    );
  });
}

export function ExperimentsMenu() {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<
    Record<string, boolean>
  >({});

  const containerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const currentRoute = flatRoutes.find(
    ({ path }) => path === location.pathname
  );

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        open &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={clsx(classes.container)}>
      {open && (
        <div className={clsx(classes.menu, "overflow")}>
          <MenuItems
            nodes={routesConfig}
            parentPath=""
            depth={0}
            pathname={location.pathname}
            expandedGroups={expandedGroups}
            onToggleGroup={(groupPath, expanded) => {
              setExpandedGroups((current) => ({
                ...current,
                [groupPath]: expanded
              }));
            }}
            onNavigate={() => {
              setOpen(false);
            }}
          />
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        className={`${classes.button} ${open ? classes.buttonOpen : ""}`}
      >
        {currentRoute?.breadcrumbs.join(" / ") ?? "Unknown"}{" "}
        {open ? "▼" : "▲"}
      </button>
    </div>
  );
}
