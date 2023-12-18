import React, { useState } from 'react';
import classes from './styles.module.scss';

const RatingScale = ({title, numberQuestion, answered, buttonDirty}) => {
    const [answerValue, setAnswerValue] = useState();

    const role = (title === 'Лекции:' ? 'lecturer' : 'seminarian');

    const pointScale = 5;
    const ratingScale = [];
    const answerActiveStyle = classes['answer__field'] + ' ' + classes.active;

    const answerHandler = (value) => {
        setAnswerValue(value);
        answered(value, numberQuestion, role);
    }

    for (let value = 1; value <= pointScale; value++) {
        ratingScale.push(
            <span 
                className={value === answerValue ? answerActiveStyle : classes.answer__field} 
                onClick={() => answerHandler(value)}
                key={value}
            >
                {value}
            </span>
        )
    }

    return( 

        <div className={classes.rating__container}>
            <div className={classes.title__answer}>
                <p>{title}</p>
                
                {(buttonDirty && !answerValue) && <p className={classes.validate__error}>Необходимо заполнить поле!</p>}
            </div>
        
            <div className={classes.rating__scale}>
                {ratingScale}
            </div>
        </div>
    );
}
export default RatingScale;