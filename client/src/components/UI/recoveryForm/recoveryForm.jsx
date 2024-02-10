import React from 'react';
import classes from './styles.module.scss';
import { useForm } from 'react-hook-form';

const RecoveryForm = ({submitForm, formId, serverMessage, formFields}) => {
    const {register, getValues, formState: {errors}, handleSubmit} = useForm({mode: 'onBlur'});

    return( 
        <div className={classes.form__container}>
            <form className={classes.recovery__form} id={formId} onSubmit={handleSubmit(submitForm)}>
                {formFields.map((field) => (
                    <div>
                        <label>{field.title}</label> 
                        <input
                            {...register(field.name, {
                                required: field.required && "Поле обязательно к заполнению",
                                minLength: {
                                    value: field.minLength,
                                    message: field.message,
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

                        {errors?.[field.name] && <p className={classes.validate__error}>{errors?.[field.name]?.message}</p>}
                    </div>
                ))}

                {serverMessage && <div className={classes.server__message}>{serverMessage}</div>}
            </form>
        </div>
        
    );
}
export default RecoveryForm;