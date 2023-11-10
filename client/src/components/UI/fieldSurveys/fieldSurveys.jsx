import React from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';

const FieldSurveys = () => {
    const disciplines = JSON.parse(localStorage.getItem('disciplines'))

    return(

        <div>
                <ul className={classes.surveys__list}>
                    {disciplines.map((discipline) => (
                        <li>
                            <p>{discipline.discipline}</p>
                            <LinkButton to={`/surveys/quiz`} state={discipline}>Пройти опрос</LinkButton>
                        </li>
                    ))}
                </ul>
        </div>


    );
}
export default FieldSurveys;