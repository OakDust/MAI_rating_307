import React, {useState} from 'react';
import classes from './styles.module.scss';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';
import SubmitButtons from '../UI/submitButtons/submitButtons';
import {authStudent} from "../../http/auth";
import {Navigate} from "react-router-dom";



const Auth = ({isRegistration}) => {

    const [fields, setFields] = useState({login: '', password: ''});
    const [role, setRole] = useState('student');
    const [isAuth, setIsAuth] = useState(false);

    const url = process.env.REACT_APP_HOSTNAME + '/auth/studentAuth'

    const submitForm = async (event) => {
        console.log(fields.login, fields.password);
        await authStudent(event, url, fields.login, fields.password)
            .then(() => {
                setIsAuth(true);
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
                fields={fields}
                setFields={setFields}
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