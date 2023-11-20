import React, {useState} from 'react';
import classes from './styles.module.scss';
import AuthForm from '../UI/authForm/authForm';
import RoleButtons from '../UI/roleButtons/roleButtons';


const Auth = ({isRegistration}) => {

    const [role, setRole] = useState('student');

    const idForm = (isRegistration ? 'registrationForm' : 'authForm');

    return(
        <div className={classes.auth__container}>
            <div className={classes.intro__block}>
                <h1>Опрос кафедры 307</h1>
                <p>Данный опрос создан в целях улучшения образования и преподавания на кафедре 307</p>
            </div>

            <RoleButtons role={role} setRole={setRole}/>
            <AuthForm isRegistration={isRegistration} idForm={idForm}/>
        </div>
    );
}
export default Auth;