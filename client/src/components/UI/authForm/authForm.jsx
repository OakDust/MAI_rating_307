import React from 'react';
import classes from './auth-form.module.scss';
import SubmitButtons from '../submitButtons/submitButtons';
import PrivelegeButtons from '../privelegeButtons/privelegeButtons';

const AuthForm = ({form_fields, id_form, login, password}) => {

    return( 
        <div className={classes.auth__container}>
            <PrivelegeButtons/>

            <form className={classes.auth__form} id={id_form} method="POST">
                {form_fields.map(field => 
                    <div>
                        <label>{field.title}</label>
                        <input
                            type={field.type}
                            placeholder={field.placeholder}
                            name={field.name}
                            onChange={(event) => {field.onChange(event)}}/>
                    </div>
                )}
            </form>

            <SubmitButtons id_form={id_form} login={login} password={password}/>
        </div>
    );
}
export default AuthForm;