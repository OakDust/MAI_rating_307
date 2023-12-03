import React, { useContext } from 'react';
import { Routes, Route, Navigate} from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../../routes/routes.js';
import { AuthContext } from '../../context/index.js';
import RoleNavigation from '../roleNavigation/roleNavigation.jsx';

const AppRouter = () => {
    const {isAuth, dataUser, isLoading} = useContext(AuthContext);

    if (isLoading) {
        return(
            <div>Загрузка...</div>
        )
    }

    if (isAuth) {
        return (
            <Routes>
                {privateRoutes.map(({path, Component, title}) => {
                    return (
                        <Route path={path} element={<Component title={title} />}/>
                    )
                })}
                <Route
                    path="*"
                    element={<RoleNavigation role={dataUser.role}/>}
                />
            </Routes>
        )
    }
    else {
        return (
            <Routes>
                {publicRoutes.map(({path, Component, title}) => {
                    return (
                        <Route path={path} element={<Component title={title}/>}/>
                    )
                })}
                <Route
                    path="*"
                    element={<Navigate to="/auth" replace />}
                />
            </Routes>
        )
    }
}
export default AppRouter;