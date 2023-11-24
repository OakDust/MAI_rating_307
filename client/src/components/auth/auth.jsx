import React, {useState} from 'react';
import classes from './styles.module.scss';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';
import SubmitButtons from '../UI/submitButtons/submitButtons';
import {authStudent, saveStudent} from "../../http/auth";
import {Navigate} from "react-router-dom";



const Auth = ({isRegistration}) => {

    const [role, setRole] = useState('student');
    const [isAuth, setIsAuth] = useState(false);
    const [error, setError] = useState('');

    const url = process.env.REACT_APP_HOSTNAME + '/auth/studentAuth'

    const submitForm = async (fields) => {
        await authStudent(url, fields.email, fields.password)

        .then((response) => {
            if (response.token) {
                saveStudent(response);
                setIsAuth(true);
            } else {
                setError(response.message);
            }
            
        })
        .catch(() => {
            console.log('Сервер не отвечает')
        })
    } 

    const idForm = (isRegistration ? 'registrationForm' : 'authForm');

    return(
        <div className={classes.auth__container}>
            <div className={classes.intro__block}>
                <h1>Опрос кафедры 307</h1>
                <p>Данный опрос создан в целях улучшения образования и преподавания на кафедре 307</p>
            </div>

            <RoleButtons role={role} setRole={setRole}/>

            <AuthForm 
                isRegistration={isRegistration} 
                idForm={idForm}
                submitForm={submitForm}
                error={error}
            />

            <SubmitButtons
                isRegistration={isRegistration}
                idForm={idForm}
                submitForm={submitForm}
            />

            {isAuth ? (<Navigate to='/'/>) : null}
        </div>
    );
}
export default Auth;