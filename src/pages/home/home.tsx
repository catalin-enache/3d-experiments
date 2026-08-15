import { Link } from 'react-router-dom';
import classes from './home.module.css';

const HomePage = () => {
  return (
    <div className={classes.homePage}>
      <h1>Home Page</h1>
      <ul>
        {['first', 'second'].map((page) => {
          return (
            <li key={page}>
              <Link to={`/${page}`}>{page}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default HomePage;
