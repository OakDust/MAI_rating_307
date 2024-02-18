import React, { useContext, useState } from 'react';
import MyButton from '../myButton/myButton';
import classes from './styles.module.scss';
import { changeFields } from './changeFields';
import { AuthContext } from '../../../context';
import { getRouteByRole } from '../../../utils/changePassword';
import PasswordService from '../../../http/passwordService';
import Errors from '../../../pages/errors';
import MyForm from '../myForm/myForm';

const ChangePassword = () => {
    const {dataUser} = useContext(AuthContext);
    const [serverMessage, setServerMessage] = useState('');
    const [error, setError] = useState('');

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

        <div className={classes.change__container}>
            <h3>Смена пароля</h3>

            <MyForm
                id='changeForm'
                formFields={changeFields}
                submitHandler={changePassword}
                serverMessage={serverMessage}
            />

            <MyButton type='sumbit' form='changeForm'>
                Сменить пароль
            </MyButton>
        </div>
    );
}
export default ChangePassword;