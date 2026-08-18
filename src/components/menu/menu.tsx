import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routesConfig } from '@src/constants/routesConfig';
import classes from './menu.module.css';

export function ExperimentsMenu() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const currentRoute = Object.values(routesConfig).find(
    ({ path }) => path === location.pathname
  );

  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleInspectorOn = () => {
      setIsVisible(false);
    };
    const handleInspectorOff = () => {
      setIsVisible(true);
    };
    window.addEventListener('inspector-on', handleInspectorOn);
    window.addEventListener('inspector-off', handleInspectorOff);
    return () => {
      window.removeEventListener('inspector-on', handleInspectorOn);
      window.removeEventListener('inspector-off', handleInspectorOff);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={classes.container}>
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
        }}
        className={`${classes.button} ${open ? classes.buttonOpen : ''}`}
      >
        {currentRoute?.name ?? 'Unknown'} {open ? '▲' : '▼'}
      </button>

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
                className={`${classes.link} ${isActive ? classes.activeLink : ''}`}
              >
                {name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
