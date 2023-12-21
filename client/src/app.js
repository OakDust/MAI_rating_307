import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from './context';
import AppRouter from './components/appRouter/appRouter';
import classes from './styles/index.scss';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataUser, setDataUser] = useState('');

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      setIsAuth(true);
      setDataUser(JSON.parse(authUser));
    }
    setIsLoading(false);
  }, [])
  
  return (

    <div className={classes}>
      <AuthContext.Provider value={{
        isAuth, setIsAuth, dataUser, setDataUser, isLoading
      }}>
        <BrowserRouter>
          <AppRouter/>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
