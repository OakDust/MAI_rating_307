import React, {useContext, useState} from 'react';
import {Navigate} from "react-router-dom";
import { AuthContext } from '../../context';
import { formatUserData } from '../../utils/auth';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';
import SubmitButtons from '../UI/submitButtons/submitButtons';
import AuthService from '../../http/authService';
import classes from './styles.module.scss';

const Auth = ({isRegistration}) => {
    const [role, setRole] = useState('Студент');
    const [serverError, setServerError] = useState('');
    const {isAuth, setIsAuth, setDataUser} = useContext(AuthContext);

    const submitAuthForm = async (authFields) => {
        try {
            const response = await AuthService.authUser(role, authFields);

            if (response?.token) {
                const dataUser = formatUserData(response, role);
                localStorage.setItem('authUser', JSON.stringify(dataUser));
                setDataUser(dataUser);
                setIsAuth(true); 
            }
            else {
                setServerError(response.message);
            }
        }
        catch {
            console.log('Server loosed');
        }
    } 

    const submitRegistrationForm = async(registrationFields) => {
        try {
            const response = await AuthService.registrateUser(role, registrationFields);

            console.log(response);

            if (response.message === 'Регистрация прошла успешно.') {
                return (
                    <Navigate to='/auth'/>
                )
            }
            else {
                setServerError(response.message);
            }
        }
        catch {
            console.log('Server loosed');
        }
    }

    return(
        <div className={classes.auth__container}>
            <div className={classes.intro__block}>
                <h1>Опрос кафедры 307</h1>
                <p>Данный опрос создан в целях улучшения образования и преподавания на кафедре 307</p>
            </div>

            <RoleButtons 
                role={role} 
                setRole={setRole}
            />

            <AuthForm 
                isRegistration={isRegistration}
                submitForm={isRegistration ? submitRegistrationForm : submitAuthForm}
                serverError={serverError}
                role={role}
            />

            <SubmitButtons
                isRegistration={isRegistration}
            />

            {isAuth ? (<Navigate to='*'/>) : null}
        </div>
    );
}
export default Auth;