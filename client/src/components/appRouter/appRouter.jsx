import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { publicRoutes } from '../../routes/routes.js'

const AppRouter = () => {
    return(

        <Routes>
            {publicRoutes.map((publicRoutes) => (
                <Route path={publicRoutes.path} element={<publicRoutes.Component title={publicRoutes.title} />}/>
            ))}
        </Routes>
    );
}
export default AppRouter;