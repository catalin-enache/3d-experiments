import { Link } from 'react-router-dom';
import { routesConfig } from '@src/constants/routesConfig';
import classes from './home.module.css';

const HomePage = () => {
  return (
    <div className={classes.homePage}>
      <ul>
        {(Object.keys(routesConfig) as (keyof typeof routesConfig)[]).map(
          (page) => {
            return (
              <li key={routesConfig[page].path}>
                <Link to={routesConfig[page].path}>
                  {routesConfig[page].name}
                </Link>
              </li>
            );
          }
        )}
      </ul>
    </div>
  );
};
export default HomePage;
