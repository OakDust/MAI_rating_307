import React from 'react';
import classes from './styles.module.scss';

const StatIndication = ({student}) => {
    const countSurveys = 4;
    const countCompletedSurveys = student.submitted_surveys?.length ?? 0;

    let indication = [];

    for (let i = 0; i < countSurveys; i++) {
        let indicatorStyle = classes['indicator'];

        if (i < countCompletedSurveys) {
            indicatorStyle = classes['indicator'] + ' ' + classes.active;
        }

        indication.push(
            <span className={indicatorStyle}></span>
        )
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