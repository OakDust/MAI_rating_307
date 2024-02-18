import React, {useEffect, useState} from 'react';
import {registrationFields, authFields} from './formFields.js';
import { formattingGroupsList } from '../../../utils/auth.js';
import { useFetching } from '../../../hooks/useFetching.js';
import { Link } from 'react-router-dom';
import classes from './styles.module.scss';
import AuthService from '../../../http/authService.js';
import SearchInput from '../searchInput/searchInput.jsx';
import Loader from '../loader/loader.jsx';
import Errors from '../../../pages/errors.jsx';
import MyForm from '../myForm/myForm.jsx';

const AuthForm = ({isRegistration, submitForm, serverMessage, role, setStudentGroup}) => {
    const [groupsList, setGroupsList] = useState([]);
    const [fetchGroups, fetchGroupsLoading, error] = useFetching( async () => {
        const response = await AuthService.getGroupsList();

        if (response?.groups) {
            const groupsList = formattingGroupsList(response.groups);
            setGroupsList(groupsList);
        }
    })

    const [form, setForm] = useState({
        fields: authFields,
        id: 'authForm',
    });

    useEffect(() => {
        fetchGroups();

        if (isRegistration) {
            setForm({
                fields: registrationFields,
                id: 'registrationForm',
            })
        }

    }, [isRegistration])

    const showAdditionalFields = () => {
        if (isRegistration && role === 'Студент') {
            return (
                <div>
                    <label>Выберите группу</label>
                    <SearchInput
                        type='text'
                        placeholder='М3О-221Б-22*'
                        list={groupsList}
                        setValue={setStudentGroup}
                        searchKey='key'
                        searchValue='value'
                    />
                </div>
            )
        }
    }

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
        <MyForm id={form.id} submitHandler={submitForm} formFields={form.fields} serverMessage={serverMessage}>
            {showAdditionalFields()}

            {!isRegistration && 
                <Link to='/recoverPassword' className={classes.recovery__text}>Забыли пароль?</Link>
            }
        </MyForm>
    );
}
export default AuthForm;