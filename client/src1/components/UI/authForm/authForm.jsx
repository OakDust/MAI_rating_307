import React, {useState} from 'react';
import classes from './styles.module.scss';
import {registrationForm, authForm} from './formFields.js';
import SubmitButtons from "../submitButtons/submitButtons";

const AuthForm = ({isRegistration, idForm}) => {
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')

    const formFields = (isRegistration ? registrationForm : authForm);

    return( 
        <div className={classes.auth__container}>
            <form type='submit' className={classes.auth__form} id={idForm}>
                {formFields.map((field, index) => 
                    <div>
                        <label>{field.title}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            name={field.name}
                            onChange={
                                field.title === 'Логин' ? event => setLogin(event.target.value) : event => setPassword(event.target.value)
                            }
                        />
                    </div>
                )}
            </form>

            <SubmitButtons
                isRegistration={isRegistration}
                idForm={idForm}
                login={login}
                password={password}
            />
        </div>


    );
}
export default AuthForm;