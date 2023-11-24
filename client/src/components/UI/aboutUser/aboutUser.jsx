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

    const showInfoUser = () => {
        if (userInfo.role === 'Администратор') {
            return(
                <div>
                    <p>Администратор</p>
                </div>
            )
        } 
        else if (userInfo.role === 'Преподаватель') {
            return(
                <div>
                    <p>{`Кафедра ${userInfo.department}`}</p>
                    <LinkButton>Запросить результаты</LinkButton>
                </div>
            )
        } 
        else if (userInfo.role === 'Студент') {
            return(
                <div>
                    <p>{userInfo.role}</p>
                    <p>{userInfo.group}</p>
                    <LinkButton to={buttonforStudent.route}>{buttonforStudent.title}</LinkButton>
                </div>
            )
        }
        else {
            return(
                <div>
                    <p>{userInfo.role}</p>
                    <p>{userInfo.group}</p>
                    {location.pathname !== '/' 
                    ? (<LinkButton to='/'>Главная</LinkButton>)
                    :(null)}
                    
                </div>
            )
        }
    }

    return(

        <div className={classes.user__container}>
            <img src={userIcon} alt='user' />
            <div className={classes.user__discription}>
                    <h3>{userInfo.name}</h3>
                    {showInfoUser()}
            </div>
        </div>
    );
}
export default AboutUser;