import React from 'react';
import classes from './styles.module.scss';

const StatIndication = ({student, countSurveys}) => {
    const countCompletedSurveys = student.submitted_surveys?.length ?? 0;
    let indication = [];

    for (let i = 0; i < countSurveys; i++) {
        const completedSurveys = student.submitted_surveys;

        if (i < countCompletedSurveys) {
            indication.push(
                <div key={i} className={classes['indicator'] + ' ' + classes.active}>
                    <div/>
                    <p className={classes.indicator__info}>{completedSurveys[i].discipline_name}</p>
                </div>
            )
        } 
        else {
            indication.push(
                <div key={i} className={classes['indicator']}>
                    <div/>
                </div>
            )
        }
    }

    return( 
        <div className={classes.indication__container}>
            <div className={classes.indication}>
                {indication} 
            </div>
            
            {`${countCompletedSurveys}/${countSurveys}`}
        </div>
    );
}
export default StatIndication;