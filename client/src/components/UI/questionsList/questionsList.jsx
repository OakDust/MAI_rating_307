import React from 'react';
import classes from './styles.module.scss';
import RatingScale from '../ratingScale/ratingScale';
import { questionsList } from './questions';

const QuestionsList = ({answered, buttonDirty, teachersByDiscipline}) => {

    return( 

        <ul className={classes.questions__list}>
            {questionsList.map(({number, question, type, role}) => (
                <li key={question}>
                    <h3>{`${number}. ${question}`}</h3>
                    {type === 'blitz' 
                    ?
                    <>
                        {teachersByDiscipline.map((teacher) => (
                            teacher.name && <RatingScale key={teacher.type} title={`${teacher.subject_type}:`} numberQuestion={number} answered={answered} buttonDirty={buttonDirty}/>
                        ))}
                    </>
                    : <textarea 
                        onChange={(e) => answered(e.target.value, number, role)} 
                        type="text"
                        placeholder='Ваш комментарий...'
                        />
                    }
                </li>
            ))}
        </ul>
    );
}
export default QuestionsList;