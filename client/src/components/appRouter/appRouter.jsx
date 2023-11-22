import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { publicRoutes } from '../../routes/routes.js';

const AppRouter = () => {

    return(

        <Routes>
            {publicRoutes.map(({path, Component, title}) => {
                return (
                    <Route path={path} element={<Component title={title} />}/>
                )
            })}
        </Routes>
    );
}
export default AppRouter;