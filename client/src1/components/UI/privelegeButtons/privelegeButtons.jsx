import React from 'react';
import classes from './privelegeButtons-styles.module.scss';

const PrivelegeButtons = () => {
    return( 

        <div className={classes.button__container}>
            <button>Студент</button>
            <button>Преподаватель</button>
        </div>
    );
}
export default PrivelegeButtons;