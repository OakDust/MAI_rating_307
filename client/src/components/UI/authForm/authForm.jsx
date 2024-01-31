import React, {useEffect, useState} from 'react';
import classes from './styles.module.scss';
import AuthService from '../../../http/authService.js';
import SearchInput from '../searchInput/searchInput.jsx';
import Loader from '../loader/loader.jsx';
import {useForm} from 'react-hook-form';
import {registrationFields, authFields} from './formFields.js';
import { formattingGroupsList } from '../../../utils/auth.js';
import { useFetching } from '../../../hooks/useFetching.js';
import Errors from '../../../pages/errors.jsx';

const AuthForm = ({isRegistration, submitForm, serverMessage, role, setStudentGroup}) => {
    const [groupsList, setGroupsList] = useState([]);
    const [fetchGroups, fetchGroupsLoading, error] = useFetching( async () => {
        const response = await AuthService.getGroupsList();

        if (response?.groups) {
            const groupsList = formattingGroupsList(response.groups);
            setGroupsList(groupsList);
        }
    })

    useEffect(() => {
        fetchGroups();
    }, [])

    const [form, setForm] = useState({
        fields: authFields,
        id: 'authForm',
    });

    useEffect(() => {
        if (isRegistration) {
            setForm({
                fields: registrationFields,
                id: 'registrationForm',
            })
        }
    }, [isRegistration])

    const {register, getValues, formState: {errors}, handleSubmit} = useForm({mode: 'onBlur'});

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    if (fetchGroupsLoading) {
        return (
            <Loader/>
        )
    }

    return( 
        <div className={classes.auth__container}>
            <form className={classes.auth__form} id={form.id} onSubmit={handleSubmit(submitForm)}>
                {isRegistration && role === 'Студент' &&
                <div>
                    <label>Выберите группу</label>
                    <SearchInput
                        type='text'
                        placeholder='М3О-221Б-22*'
                        list={groupsList}
                        setValue={setStudentGroup}
                    />
                </div>}
                
                {form.fields.map((field) => 
                    <div key={field.name}>
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
                )}
                
                {serverMessage && <div className={classes.server__message}>{serverMessage}</div>}
            </form>
        </div>
    );
}
export default AuthForm;