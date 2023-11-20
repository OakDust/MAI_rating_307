import React from 'react';
import userIcon from '../../../assets/icons/user.webp';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import { useLocation } from 'react-router-dom';

const AboutUser = ({userInfo}) => {

    let location = useLocation();

    let buttonforStudent = {
        title: 'Моя группа',
        route: '/group',
    }

    if (location.pathname !== '/surveys') {
        buttonforStudent.title = 'Опросы';
        buttonforStudent.route = '/surveys';
    }

    return( 

        <div className={classes.user__container}>
            <img src={userIcon} alt='user' />
            <div className={classes.user__discription}>
                    <h3>{userInfo.name}</h3>

                {userInfo.role === 'Студент' ? (
                    <div>
                        <p>{userInfo.role}</p>
                        <p>{userInfo.groups}</p>
                        <LinkButton to={buttonforStudent.route}>{buttonforStudent.title}</LinkButton>
                    </div>
                ) : userInfo.role === 'Староста' ? (
                    <div>
                        <p>{userInfo.role}</p>
                        <p>{userInfo.groups}</p>
                        <LinkButton to={buttonforStudent.route}>{buttonforStudent.title}</LinkButton>
                    </div>
                ) : userInfo.role === 'Преподаватель' ? (
                    <div>
                        <p>{`Кафедра ${userInfo.department}`}</p>
                        <LinkButton>Запросить результаты</LinkButton>
                    </div>
                ) : null}

            </div>
        </div>
    );
}
export default AboutUser;