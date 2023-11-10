import React, { useState } from 'react';
import classes from './styles.module.scss';

const RatingScale = ({title, numberQuestion, answered}) => {

    const [answerValue, setAnswerValue] = useState();

    const role = (title === 'Лекции:' ? 'lecturer' : 'seminarian');

    const pointScale = 5;
    const ratingScale = [];
    const answerActiveStyle = classes['answer__field'] + ' ' + classes.active;

    const submitAnswer = (value) => {
        setAnswerValue(value);
        answered(value, numberQuestion, role);
    }

    for (let value = 1; value <= pointScale; value++) {
        ratingScale.push(
            <span className={value === answerValue ? answerActiveStyle : classes.answer__field} onClick={() => submitAnswer(value)}>
                {value}
            </span>
        )
    }

    return( 

        <div className={classes.rating__container}>
            <p>{title}</p>

            <div className={classes.rating__scale}>
                {ratingScale}
            </div>
        </div>
    );
}
export default RatingScale;