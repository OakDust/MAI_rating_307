import React, {useEffect, useMemo, useState} from 'react';
import classes from './styles.module.scss';
import {useForm} from 'react-hook-form';
import {registrationFields, authFields} from './formFields.js';
import AuthService from '../../../http/authService.js';

const AuthForm = ({isRegistration, submitForm, serverError, role}) => {
    const [selectGroup, setSelectGroup] = useState('');
    const [groupsList, setGroupsList] = useState([]);
    const [isDirtySelect, setIsDirtySelect] = useState(false);
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

    const fetchGroups = async () => {
        const dataGroups = await AuthService.getGroupsList();
        setGroupsList(dataGroups.groups);
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    const {register, getValues, formState: {errors}, handleSubmit} = useForm({mode: 'onBlur'});

    const searchedGroup = useMemo(() => {
        return groupsList.filter(group => group.group_name.includes(selectGroup));
    }, [selectGroup, groupsList])

    const handlerSelectGroup = (group) => {
        setSelectGroup(group);
        setIsDirtySelect(false);
    }

    const searchGroup = (e) => {
        setSelectGroup(e.target.value);
        setIsDirtySelect(true);
    }

    const groupSelection = () => {
        if (isRegistration) {
            return (
                <div className={classes.select__group}>
                    <label>Выберите группу</label>
                    <input
                        {...register("groups", {required: true})} 
                        type='text'
                        placeholder='М3О-221Б-22*'
                        onChange={(e) => searchGroup(e)}
                        value={selectGroup}
                    />

                    {isDirtySelect &&
                        <ul>
                            {searchedGroup.map(group => (
                                <li onClick={() => handlerSelectGroup(group.group_name)}>{group.group_name}</li>
                            ))}
                        </ul>}
                </div>
            )
        }
    }

    return( 
        <div className={classes.auth__container}>
            <form className={classes.auth__form} id={form.id} onSubmit={handleSubmit(submitForm)}>
                {form.fields.map((field) => 
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
                        {errors?.[field.name] && <p className={classes.validate__error}>{errors?.[field.name]?.message}</p>}
                    </div>
                )}
                {role === 'Студент' ? groupSelection() : null}
                
                {serverError && <div>{serverError}</div>}
            </form>
        </div>
    );
}
export default AuthForm;