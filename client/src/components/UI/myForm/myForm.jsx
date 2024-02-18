import React from 'react';
import classes from './styles.module.scss';
import { useForm } from 'react-hook-form';

const MyForm = ({submitHandler, formFields, serverMessage, children, ...props}) => {
    const {register, getValues, formState: {errors}, handleSubmit} = useForm({mode: 'onBlur'});

    const setValidation = (field) => {

        return {
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
        }
    }

    const showValidateMessage = (field) => {
        if (errors?.[field.name]) {
            return (
                <p className={classes.validate__error}>
                    {errors[field.name]?.message}
                </p>
            )
        }
    }

    const showServerMessage = () => {
        if (serverMessage) {
            return (
                <div className={classes.server__message}>
                    {serverMessage}
                </div>
            )
        }
    }

    return( 

        <form {...props} className={classes.my__form} onSubmit={handleSubmit(submitHandler)}>
            {formFields.map((field) => (
                <div>
                    <label>{field.title}</label> 
                    <input 
                        {...register(field.name, setValidation(field))}

                        type={field.type}
                        placeholder={field.placeholder}
                    />

                    {showValidateMessage(field)}
                </div>
            ))}
            {children}

            {showServerMessage()}
        </form>
    );
}
export default MyForm;