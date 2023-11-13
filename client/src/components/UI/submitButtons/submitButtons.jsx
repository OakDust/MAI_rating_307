import React, {useState} from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import LinkButton from '../linkButton/linkButton';
import {formSubmit} from "../../../http/auth";
import {Navigate} from "react-router-dom";
import {getDisciplines} from "../../main/aboutUser";

const SubmitButtons = ({isRegistration, idForm, login, password}) => {
    let [message, setMessage] = useState()
    let [response, setResponse] = useState()
    let [logged, setLogged] = useState(false)
    const [disciplines, setDisciplines] = useState([{}])
    let [isLoading, setIsLoading] = useState(false)

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
        // get response from api
        await formSubmit(event, url, login, password)
            .then(([responseMessage, responseToken]) => {
                setMessage(responseMessage)
                setResponse(responseToken)
            })
            //500
            .catch((err) => {
                return <div>error</div>
            })
            .then(() => {setLogged(logged = true)})
    }

    if (logged) {
        const backendService = async () => {
            const response = await getDisciplines(
                process.env.REACT_APP_HOSTNAME + '/student/disciplines',
                {
                    groups: localStorage.getItem('User group')
                })

            setDisciplines(response)

            return response
        }

        backendService().then(() => setIsLoading(isLoading = true))
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

            {logged ? (<Navigate to='/surveys' state={isLoading} />) : null}
        </div>
    );
}
export default SubmitButtons;