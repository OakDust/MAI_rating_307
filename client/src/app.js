import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './components/appRouter/appRouter';
import styles from './styles/general-styles.module.scss';


function App() {
  return (
    <div className={styles}>
      <BrowserRouter>
      <AppRouter/>
      </BrowserRouter>
    </div>
  );
}

export default App;
