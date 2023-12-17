import React from 'react';
import classes from './styles.module.scss';

const MyInput = (props) => {

    return( 
        <input className={classes.my__input} {...props} />
    );
}
export default MyInput;