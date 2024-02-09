import React, { useContext, useState } from 'react';
import MyButton from '../myButton/myButton';
import classes from './styles.module.scss';
import { changeFields } from './changeFields';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../../context';
import { getRouteByRole } from '../../../utils/changePassword';
import PasswordService from '../../../http/passwordService';
import Errors from '../../../pages/errors';

const ChangePassword = () => {
    const {dataUser} = useContext(AuthContext);
    const [serverMessage, setServerMessage] = useState('');
    const [error, setError] = useState('');

    const {register, getValues, formState: {errors}, handleSubmit} = useForm({mode: 'onBlur'});

    const changePassword = async (fields) => {
        try {
            const route = getRouteByRole(dataUser.role);
            const response = await PasswordService.changePassword(route, dataUser, fields);

            setServerMessage(response.message);
        } catch (e) {
            setError(e.message);
        }
    }

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    return( 

        <div className={classes.change__container} onSubmit={handleSubmit(changePassword)}>
            <h3>Смена пароля</h3>

            <form className={classes.change__form} id='changeForm'>
                {changeFields.map((field) => (
                    <div>
                        <label>{field.title}</label>
                        <input
                            {...register(field.name, {
                                required: field.required && "Поле обязательно к заполнению",
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

                        {errors?.[field.name] && <p className={classes.validate__error}>{errors?.[field.name]?.message}</p>}
                    </div>
                ))}

                {serverMessage && <div className={classes.server__message}>{serverMessage}</div>}
            </form>

            <MyButton 
            type='sumbit' 
            form='changeForm'>
                Сменить пароль
            </MyButton>
        </div>
    );
}
export default ChangePassword;