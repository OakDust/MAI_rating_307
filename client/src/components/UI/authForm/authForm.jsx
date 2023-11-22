import React from 'react';
import classes from './styles.module.scss';
import {registrationForm, authForm} from './formFields.js';

const AuthForm = ({isRegistration, idForm, fields, setFields}) => {

    const formFields = (isRegistration ? registrationForm : authForm);

    const fieldsHandler = (value, type) => {
        setFields({...fields, [type]: value})
    };

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
                            onChange={(e) => fieldsHandler(e.target.value, field.type)}
                        />
                    </div>
                )}
            </form>
        </div>


    );
}
export default AuthForm;