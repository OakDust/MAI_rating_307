import React from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import { disciplinesList } from '../../main/aboutUser';

const FieldSurveys = () => {
    return( 

        <ul className={classes.surveys__list}>
            {disciplinesList.map(({discipline}) => (
                <li>
                    <p>{discipline}</p>
                    <MyButton>Пройти опрос</MyButton>
                </li>
            ))}
        </ul>
    );
}
export default FieldSurveys;