import React from 'react';
import classes from './styles.module.scss';
import { reviewSides, reviewTypes } from './reviewInfo';

const ReviewsList = ({reviewsTeacher}) => {

    if (reviewsTeacher.length > 0) {
        return ( 
            <ul className={classes.reviews__list}>
                {reviewsTeacher.map(({type, side, comment}) => (
                    <li className={classes.review__content}>
                        <div className={classes.review__title}>
                            <section>
                                <div className={side === 'cons' ? classes.indicator : classes['indicator'] + ' ' + classes.positive}></div>
                                <h5>{reviewSides[side]}</h5>
                            </section>
                            
                            <h5>{reviewTypes[type]}</h5>
                        </div>

                        <p>{`- ${comment}`}</p>
                    </li>
                ))}
            </ul>
        )
    } 

    return (
        <div>Ничего не найдено</div>
    )

}
export default ReviewsList;