import React, { useEffect } from 'react';
import classes from '../styles/errors.module.scss';
import errorIcon from '../assets/icons/error.webp';
import { Navigate } from 'react-router-dom';

const Errors = ({message}) => {
    localStorage.removeItem('authUser');

    return( 

        <div className={classes.error__container}>
            <img src={errorIcon} alt='Ошибка'/>

            <h1>{message}</h1>
            <p>Попробуйте позже</p>
            
            {message ? <Navigate to='/auth'/> : null}
        </div>
    );
}
export default Errors;