import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { routesConfig } from "@src/constants/routesConfig";
import classes from "./Menu.module.css";

export function ExperimentsMenu() {
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const currentRoute = Object.values(routesConfig).find(
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
    <div ref={containerRef} className={classes.container}>
      {open && (
        <div className={classes.menu}>
          {Object.values(routesConfig).map(({ path, name }) => {
            const isActive = location.pathname === path;

            return (
              <Link
                key={path}
                to={path}
                onClick={() => {
                  setOpen(false);
                }}
                className={`${classes.link} ${
                  isActive ? classes.activeLink : ""
                }`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        className={`${classes.button} ${open ? classes.buttonOpen : ""}`}
      >
        {currentRoute?.name ?? "Unknown"} {open ? "▼" : "▲"}
      </button>
    </div>
  );
}
