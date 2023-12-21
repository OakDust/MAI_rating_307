import React, { useEffect, useState } from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import LinkButton from '../linkButton/linkButton';

const SubmitButtons = ({isRegistration}) => {
    const [buttons, setButtons] = useState({
        titleSubmit: 'Войти',
        titleLink: 'Зарегистрироваться',
        backRoute: '/registration',
        idForm: 'authForm',
    })

    useEffect(() => {
        if (isRegistration) {
            setButtons({
                titleSubmit: 'Зарегистрироваться',
                titleLink: 'Войти',
                backRoute: '/auth',
                idForm: 'registrationForm',
            })
        }
    }, [isRegistration])

    return( 

        <div className={classes.button__container}>
            <LinkButton to={buttons.backRoute}>{buttons.titleLink}</LinkButton>

            <MyButton
                type="submit"
                form={buttons.idForm}
            >
                {buttons.titleSubmit}
            </MyButton>
        </div>
    );
}
export default SubmitButtons;