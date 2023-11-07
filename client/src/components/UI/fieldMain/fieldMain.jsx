import React from 'react';
import classes from './styles.module.scss';

const FieldMain = ({title, displayField}) => {
    return( 

        <div className={classes.field__container}>
            <h4>{title}</h4>

            {displayField}
        </div>
    );
}
export default FieldMain;