import React from 'react';
import classes from './styles.module.scss';


const MyButton = ({children, ...props}) => {

    return(
            <button
                {...props}
                className={classes.button__style}
            >
                {children}
            </button>

    );
}
export default MyButton;