import React from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import {useLocation} from 'react-router-dom';

const FieldMain = ({title, displayField, dataUser}) => {
    let location = useLocation();
    const role = dataUser.role;

    let buttonforStudent = {
        title: 'Моя группа',
        route: '/group',
    }

    if (location.pathname !== '/surveys') {
        buttonforStudent.title = 'Опросы';
        buttonforStudent.route = '/surveys';
    }

    const showNavigationByRole = () => {
        if (role === 'Студент') {
            return (
                <LinkButton to={buttonforStudent.route}>{buttonforStudent.title}</LinkButton>
            )
        }
        else if (role === 'Староста' && location.pathname !== '/') {
            return (
                <LinkButton to='/'>Главная</LinkButton>   
            )
        }
    }

    return( 

        <div className={classes.field__container}>
            <div className={classes.navigation__block}>
                <h4>{title}</h4>
                {showNavigationByRole()}
            </div>
            
            {displayField}
        </div>
    );
}
export default FieldMain;