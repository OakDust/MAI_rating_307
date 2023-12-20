import React from 'react';
import {Link} from 'react-router-dom';
import classes from './styles.module.scss';

const FieldHome = () => {

    const routesList = [
        {
            title: 'Опросы',
            route: '/surveys',
        }, 
        {
            title: 'Группа',
            route: '/group',
        },
        {
            title: 'Список предметов и преподавателей',
            route: '/professors',
        }
    ]

    return( 

        <div className={classes.link__container}>
            {routesList.map((route) => (
                <Link key={route.route} to={route.route}>{route.title}</Link>
            ))}
        </div>
    );
}
export default FieldHome;