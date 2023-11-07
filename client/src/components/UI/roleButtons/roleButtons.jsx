import React from 'react';
import classes from './styles.module.scss';

const RoleButtons = () => {
    return( 

        <div className={classes.button__container}>
            <button>Студент</button>
            <button>Преподаватель</button>
        </div>
    );
}
export default RoleButtons;