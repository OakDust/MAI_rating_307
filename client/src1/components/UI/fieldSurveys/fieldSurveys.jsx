import React, {useState} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';

const FieldSurveys = (state) => {
    const [disciplines, setDisciplines] = useState(JSON.parse(localStorage.getItem('disciplines')))
    // const state = location.state
    
    console.log(state)
    return(

        <div>
            {state !== null && disciplines.length !== null? (
                <ul className={classes.surveys__list}>
                    {disciplines.map((discipline) => (
                        <li>
                            <p>{discipline.discipline}</p>
                            <LinkButton to={`/surveys/quiz`} state={discipline}>Пройти опрос</LinkButton>
                        </li>
                    ))}
                </ul>
            ) : <div>Loading</div>}

        </div>


    );
}
export default FieldSurveys;