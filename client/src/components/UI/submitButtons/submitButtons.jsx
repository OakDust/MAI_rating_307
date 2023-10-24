import React, { useState } from 'react';
import classes from './submitButtons-styles.module.scss';
import { useLocation, Link } from 'react-router-dom';
import { formSubmit } from "../../../http/login";

const SubmitButtons = ({id_form, login, password}) => {
    let [message, setMessage] = useState()
    let [response, setResponse] = useState()

    const url = process.env.REACT_APP_HOSTNAME + '/auth/studentAuth'

    const location = useLocation();

    const isRegistration = (location.pathname === '/registration');

    const titleSubmitButton = (isRegistration ? 'Зарегистрироваться' : 'Войти');
    const titleLinkButton = (isRegistration ? 'Войти' : 'Зарегистрироваться');
    const backRoute = (isRegistration ? '/login' : '/registration');

    return(

        <div className={classes.button__container}>
            <button
                type="submit"
                onClick={
                    async (event) => {
                        let responseMessage, responseToken

                        // get response from api
                        [responseMessage, responseToken] = await formSubmit(event, url, login, password)

                        setMessage(responseMessage)
                        setResponse(responseToken)
                    }
                }
                form={id_form}>{titleSubmitButton}
            </button>

            <Link to={backRoute}>{titleLinkButton}</Link>
        </div>
    );
}
export default SubmitButtons;