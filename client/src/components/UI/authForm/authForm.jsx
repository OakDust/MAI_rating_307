import React from 'react';
import classes from './styles.module.scss';
import {useForm} from 'react-hook-form';
import {registrationForm, authForm} from './formFields.js';

const AuthForm = ({isRegistration, idForm, submitForm, error}) => {
    const {
        register,
        getValues,
        formState: {
            errors
        },
        handleSubmit,
    } = useForm({
        mode: 'onBlur'
    });

    const formFields = (isRegistration ? registrationForm : authForm);

    return( 
        <div className={classes.auth__container}>
            <form className={classes.auth__form} id={idForm} onSubmit={handleSubmit(submitForm)}>
                {formFields.map((field, index) => 
                    <div>
                        <label>{field.title}</label>
                        <input
                            {...register(field.name, {
                                required: "Поле обязательно к заполнению",
                                minLength: {
                                    value: field.minLength,
                                    message: field.messege,
                                },
                                pattern: {
                                    value: field.pattern,
                                    message: field.message,
                                },
                                validate: (value) => {
                                    if (field.name === 'cpassword') {
                                        const {password} = getValues();
                                        return password === value || "Пароли должны совпадать!";
                                    }
                                }
                            })}
                            type={field.type}
                            placeholder={field.placeholder}
                        />
                        {errors?.[field.name] && <p className={classes.validate__error}>{errors?.[field.name]?.message || 'Error'}</p>}
                    </div>
                )}
                {error && <div>{error}</div>}
            </form>
            
        </div>


    );
}
export default AuthForm;