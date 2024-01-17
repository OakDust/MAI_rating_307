import React, {useContext, useState} from 'react';
import {Navigate} from "react-router-dom";
import { AuthContext } from '../../context';
import { formatUserData, trimObjectFields } from '../../utils/auth';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';
import SubmitButtons from '../UI/submitButtons/submitButtons';
import AuthService from '../../http/authService';
import Errors from '../../pages/errors';
import classes from './styles.module.scss';

const Auth = ({isRegistration}) => {
    const [role, setRole] = useState('Студент');
    const [serverMessage, setServerMessage] = useState('');
    const [studentGroup, setStudentGroup] = useState('');
    const {isAuth, setIsAuth, setDataUser} = useContext(AuthContext);
    const [error, setError] = useState('');

    const submitAuthForm = async (authFields) => {
        try {
            authFields = trimObjectFields(authFields);

            const response = await AuthService.authUser(role, authFields);

            if (response?.token) {
                const dataUser = formatUserData(response, role);
                localStorage.setItem('authUser', JSON.stringify(dataUser));
                setDataUser(dataUser);
                setIsAuth(true); 
            }
            else {
                setServerMessage(response.message);
            }
        }
        catch (e) {
            setError(e.message);
        }
    } 

    const submitRegistrationForm = async (registrationFields) => {
        registrationFields = trimObjectFields(registrationFields);
        try {
            const response = await AuthService.registrateUser(role, registrationFields, studentGroup); 
            setServerMessage(response.message);
        }
        catch (e) {
            setError(e.message);
        }
    }

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    if (isAuth) {
        <Navigate to='*'/>
    }

    return(
        <div className={classes.auth__container}>
            <div className={classes.intro__block}>
                <h1>Опросы 307</h1>
            </div>

            <RoleButtons 
                role={role} 
                setRole={setRole}
                isRegistration={isRegistration}
            />

            <AuthForm 
                isRegistration={isRegistration}
                submitForm={isRegistration ? submitRegistrationForm : submitAuthForm}
                serverMessage={serverMessage}
                role={role}
                setStudentGroup={setStudentGroup}
            />

            <SubmitButtons
                isRegistration={isRegistration}
            />
        </div>
    );
}
export default Auth;