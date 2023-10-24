import React, {useState} from 'react';
import classes from './auth-styles.module.scss';
import AuthForm from '../UI/authForm/authForm';

const AuthComponent = ({isRegistration}) => {
    let [login, setLogin] = useState('')
    let [password, setPassword] = useState('')

    const login_form = [
        {
            type: 'login',
            title: 'Логин',
            name: 'email',
            placeholder: 'Введите логин',
            onChange: (event) => setLogin(event.target.value)
        },
        {
            type: 'password',
            title: 'Пароль',
            name: 'password',
            placeholder: 'Введите пароль',
            onChange: (event) => setPassword(event.target.value)
        },
    ]

    const registration_form = [
        {
            type: 'text',
            title: 'Имя',
            placeholder: 'Введите имя'
        },
        {
            type: 'text',
            title: 'Фамилия',
            placeholder: 'Введите фамилию'
        },
        {
            type: 'text',
            title: 'Номер группы',
            placeholder: 'Введите номер группы'
        },
        {
            type: 'email',
            title: 'Почта',
            placeholder: 'Введите почту'
        },
        {
            type: 'password',
            title: 'Пароль (минимум 8 символов)',
            placeholder: 'Введите пароль'
        },
        {
            type: 'password',
            title: 'Повторите пароль',
            placeholder: 'Повторите пароль'
        },
    ]

    return( 
        <div className={classes.auth__container}>
            <div className={classes.intro__block}>
                <h1>Опрос кафедры 307</h1>
                <p>Данный опрос создан в целях улучшения образования и преподавания на кафедре 307</p>
            </div>
            
            {isRegistration ? (
                <AuthForm form_fields={registration_form} id_form="registration_form"/>
            ) : (
                <AuthForm form_fields={login_form} id_form="login_form" login={login} password={password}/>
            )}
        </div>
    );
}
export default AuthComponent;