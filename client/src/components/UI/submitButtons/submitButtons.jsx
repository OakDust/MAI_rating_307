import React from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import LinkButton from '../linkButton/linkButton';


const SubmitButtons = ({isRegistration, idForm}) => {

    let titleSubmitButton = 'Войти';
    let titleLinkButton = 'Зарегистрироваться';
    let backRoute = '/registration';

    if (isRegistration) {
        titleSubmitButton = 'Зарегистрироваться';
        titleLinkButton = 'Войти';
        backRoute = '/auth';
    }

    return( 

        <div className={classes.button__container}>
            <MyButton
                type="submit"
                form={idForm}
            >
                {titleSubmitButton}
            </MyButton>

            <LinkButton to={backRoute}>{titleLinkButton}</LinkButton>
        </div>
    );
}
export default SubmitButtons;