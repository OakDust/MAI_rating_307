import React from 'react';
import classes from './styles.module.scss';
import { Link } from 'react-router-dom';

const FieldRating = () => {

    return( 

        <div className={classes.rating__container}>
            <Link>Общий рейтинг</Link>
        </div>
    );
}
export default FieldRating;