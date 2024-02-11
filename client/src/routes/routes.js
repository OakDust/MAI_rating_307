import {
    ADMIN_ROUTE,
    AUTH_ROUTE,
    GROUP_ROUTE,
    HOME_ROUTE,
    PROFESSORS_ROUTE,
    QUIZ_ROUTE,
    RATING_ROUTE,
    RECOVERY_PASSWORD_ROUTE,
    RECOVERY_ROUTE,
    REGISTRATION_PRIVATE_ROUTE,
    REGISTRATION_ROUTE,
    REVIEWS_ROUTE,
    SURVEYS_ROUTE,
} from './consts.js'

import Auth from '../pages/authorization.jsx';
import Registration from '../pages/registration.jsx';
import Surveys from '../pages/surveys.jsx';
import Rating from '../pages/rating.jsx';
import Group from '../pages/group.jsx';
import Quiz from '../pages/quiz.jsx';
import Home from '../pages/home.jsx';
import Professors from '../pages/professors.jsx';
import Admin from '../pages/admin.jsx';
import Reviews from '../pages/reviews.jsx';
import Recovery from '../pages/recovery.jsx';

export const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component: Auth,
        title: 'Опросы 307 | Вход',
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration,
        title: 'Опросы 307 | Регистрация',
    },
    {
        path: REGISTRATION_PRIVATE_ROUTE,
        Component: Registration,
        title: 'Опросы 307 | Регистрация',
    },
    {
        path: RECOVERY_ROUTE,
        Component: Recovery,
        title: 'Опросы 307 | Восстановление'
    },
    {
        path: RECOVERY_PASSWORD_ROUTE,
        Component: Recovery,
        title: 'Опросы 307 | Восстановление пароля'
    }
]

const studentRoutes = [
    {
        path: SURVEYS_ROUTE,
        Component: Surveys,
        title: 'Опросы 307',
    },
    {
        path: GROUP_ROUTE,
        Component: Group,
        title: 'Опросы 307 | ',
    },
    {
        path: QUIZ_ROUTE,
        Component: Quiz,
        title: 'Опросы 307 | ',
    }
]

export const privateRoutes = {
    'Студент': studentRoutes,

    'Староста': [
        ...studentRoutes,
        {
            path: HOME_ROUTE,
            Component: Home,
            title: 'Опросы 307 | Главная',
        },
        {
            path: PROFESSORS_ROUTE,
            Component: Professors,
            title: 'Опросы 307 | Список предметов и преподавателей',
        }
    ],

    'Преподаватель': [
        {
            path: RATING_ROUTE,
            Component: Rating,
            title: 'Опросы 307 | Рейтинг',
        }
    ],

    'Администратор': [
        {
            path: ADMIN_ROUTE,
            Component: Admin,
            title: 'Опросы 307 | Администратор',
        },
        {
            path: REVIEWS_ROUTE,
            Component: Reviews,
            title: 'Опросы 307 | '
        }
    ]
}