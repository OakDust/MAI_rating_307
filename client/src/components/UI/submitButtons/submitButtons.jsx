import React, {useState} from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import LinkButton from '../linkButton/linkButton';
import {formSubmit} from "../../../http/auth";
import {Navigate} from "react-router-dom";

const SubmitButtons = ({isRegistration, idForm, login, password}) => {
    let [message, setMessage] = useState()
    let [response, setResponse] = useState()

    const url = process.env.REACT_APP_HOSTNAME + '/auth/studentAuth'

    let titleSubmitButton = 'Войти';
    let titleLinkButton = 'Зарегистрироваться';
    let backRoute = '/registration';

    if (isRegistration) {
        titleSubmitButton = 'Зарегистрироваться';
        titleLinkButton = 'Войти';
        backRoute = '/auth';
    }

    const submitForm = async (event) => {
        let responseMessage, responseToken

        // get response from api
        [responseMessage, responseToken] = await formSubmit(event, url, login, password)

        setMessage(responseMessage)
        setResponse(responseToken)
    }

    return( 

        <div className={classes.button__container}>
            <MyButton
                type="submit"
                onClick={submitForm}
                form={idForm}
            >
                {titleSubmitButton}
            </MyButton>

            <div>
                {message}
            </div>

            <LinkButton to={backRoute}>{titleLinkButton}</LinkButton>

            {response ? (<Navigate to='/surveys' />) : null}
        </div>
    );
}
export default SubmitButtons;