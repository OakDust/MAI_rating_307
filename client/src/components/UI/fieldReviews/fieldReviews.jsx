import React, {useEffect} from 'react';
import classes from './styles.module.scss';

const FieldReviews = ({professorInfo}) => {

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, [])

    return( 
        <div className={classes.professor__info}>
            <div className={classes.total__score}>
                <h4>Общий рейтинг</h4>
                <p>{professorInfo.score}</p>
            </div> 

            <ul className={classes.reviews__list}>
                <h4>Комментарии</h4>
            </ul>
        </div>
    );
}
export default FieldReviews;