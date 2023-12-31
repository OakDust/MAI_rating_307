import {
    AUTH_ROUTE,
    GROUP_ROUTE,
    HOME_ROUTE,
    PROFESSORS_ROUTE,
    QUIZ_ROUTE,
    RATING_ROUTE,
    REGISTRATION_ROUTE,
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

export const publicRoutes = [
    {
        path: HOME_ROUTE,
        Component: Home,
        title: 'МАИ | Опросы',
    },
    {
        path: AUTH_ROUTE,
        Component: Auth,
        title: 'Авторизация',
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration,
        title: 'Регистрация',
    },
    {
        path: SURVEYS_ROUTE,
        Component: Surveys,
        title: 'Опросы',
    },
    {
        path: RATING_ROUTE,
        Component: Rating,
        title: 'Рейтинг',
    },
    {
        path: GROUP_ROUTE,
        Component: Group,
        title: 'Моя группа',
    },
    {
        path: QUIZ_ROUTE,
        Component: Quiz,
        title: 'Опрос по дисциплине',
    },
    {
        path: PROFESSORS_ROUTE,
        Component: Professors,
        title: 'Список преподавателей',
    }
]