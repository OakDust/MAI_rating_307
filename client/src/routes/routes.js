import {
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
} from './consts.js'

import Authorization from '../pages/login.jsx';
import Registration from '../pages/registration.jsx';

export const publicRoutes = [
    {
        path: LOGIN_ROUTE,
        Component: Authorization,
        title: 'Авторизация',
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration,
        title: 'Регистрация',
    }
]