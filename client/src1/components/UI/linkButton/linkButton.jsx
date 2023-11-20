import React from 'react';
import classes from './styles.module.scss';
import { Link } from 'react-router-dom';

const LinkButton = ({children, ...props}) => {
    return( 
        <Link className={classes.button__link} {...props}>
            {children}
        </Link>
    );
}
export default LinkButton;