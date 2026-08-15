import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from 'pages/home/home';
import FirstPage from 'pages/first/first';
import SecondPage from 'pages/second/second';

import classes from './App.module.css';

function App() {
  return (
    <BrowserRouter>
      <div className={classes.app}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/first" element={<FirstPage />} />
          <Route path="/second" element={<SecondPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
