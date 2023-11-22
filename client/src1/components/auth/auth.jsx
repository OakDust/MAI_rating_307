import React, {useState} from 'react';
import classes from './styles.module.scss';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';
import SubmitButtons from '../UI/submitButtons/submitButtons';
import {formSubmit} from "../../http/auth";
import {getDisciplines} from "../../http/getDisciplines";
import {Navigate} from "react-router-dom";



const Auth = ({isRegistration}) => {

    const [fields, setFields] = useState({login: '', password: ''});
    const [role, setRole] = useState('student');
    const [logged, setLogged] = useState(false);

    const idForm = (isRegistration ? 'registrationForm' : 'authForm');

    const url = process.env.REACT_APP_HOSTNAME + '/auth/studentAuth'

    const submitForm = async (event) => {
        // get response from api
        await formSubmit(event, url, fields.login, fields.password)
            .then(() => {
                setLogged(true);
            })
    } 

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

            {logged ? (<Navigate to='/surveys'/>) : null}
        </div>
    );
}
export default Auth;