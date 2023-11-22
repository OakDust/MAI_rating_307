import React from 'react';
import classes from './styles.module.scss';

const StatIndication = () => {

    // const disciplines = JSON.parse(localStorage['disciplines']);
    const countSurveys = 6;
    const countCompletedSurveys = 0;

    let indication = [];

    for (let i = 0; i < countSurveys; i++) {
        indication.push(
            <span className={classes.indicator}></span>
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