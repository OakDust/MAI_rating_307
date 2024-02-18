import React, { useState } from 'react';
import classes from './styles.module.scss';
import MyButton from '../UI/myButton/myButton';
import RoleButtons from '../UI/roleButtons/roleButtons';
import PasswordService from '../../http/passwordService';
import Errors from '../../pages/errors';
import MyForm from '../UI/myForm/myForm';
import { passwordFields, recoveryFields } from './formFields';
import { useParams, Navigate } from 'react-router-dom';

const PasswordRecovery = () => {
    const formId = 'recoveryPassword';
    const [isChangedPassword, setIsChangedPassword] = useState(false);
    const [role, setRole] = useState('Студент');
    const [error, setError] = useState('');
    const [serverMessage, setServerMessage] = useState('');
    const {route} = useParams();

    const recoverMail = async (fields) => {
        try {
            const response = await PasswordService.recoverMail(role, fields);

            setServerMessage(response.message);
        } catch (e) {
            setError(e.message);
        }
    }

    const recoverPassword = async (fields) => {
        try {
            const {email, role} = await PasswordService.getFieldsForChange(route);
            const response = await PasswordService.recoverPassword(fields, email, role);

            setServerMessage(response.message);

            if (response.statusCode < 300) {
                setIsChangedPassword(true);
            }
            
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

        <div className={classes.recovery__container}>
            <h1 className={classes.intro__block}>Восстановление</h1>

            {!route && <RoleButtons role={role} setRole={setRole}/>}

            <MyForm
                id={formId}
                submitForm={route ? recoverPassword : recoverMail}
                serverMessage={serverMessage}
                formFields={route ? passwordFields : recoveryFields}
            />

            <MyButton type='submit' form={formId}>Восстановить пароль</MyButton>

            {isChangedPassword && <Navigate to="/auth" replace={true} />}
        </div>
    );
}
export default PasswordRecovery;