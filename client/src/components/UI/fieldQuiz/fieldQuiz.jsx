import React, {useEffect, useState} from 'react';
import classes from './styles.module.scss';
import QuestionsList from '../questionsList/questionsList';
import MyButton from '../myButton/myButton';
import { fieldAnswers } from './fieldAnswers';
import CompletedQuiz from '../completedQuiz/completedQuiz';
import {postQuiz} from "../../../http/submitQuiz";

const FieldQuiz = ({disciplineInfo, setTitle}) => {
    const [answers, setAnswers] = useState(fieldAnswers);
    const [validateAnswers, setValidateAnswers] = useState(false);
    const [buttonDirty, setButtonDirty] = useState(false);
    const [isCompleteQuiz, setIsCompleteQuiz] = useState(false);

    const authUser = JSON.parse(localStorage.getItem('authUser'));

    const validateQuiz = () => {
        let validateFlag = true;
        const countTestAnswers = 7;

        for (let i = 0; i < countTestAnswers; i ++){
            if (answers[i].lecturer === '' || answers[i].seminarian === '') {
                validateFlag = false;
            }
        }

        if (validateFlag) {
            setValidateAnswers(true);
        }
    }

    useEffect(() => {
        validateQuiz();
    }, )

    const answerHandler = (newAnswer, numberQuestion, role) => {
        const updatedAnswers = answers.map((answer) => {
            if (answer.id === numberQuestion) {
                return {...answer, [role]: newAnswer};
            }
            return answer;
        });
        
        setAnswers(updatedAnswers);
    }

    const submitQuiz = async () => {
        setButtonDirty(true);

        if (validateAnswers) {
            setIsCompleteQuiz(true);

            const newAnswers = [{
                "student_id": authUser.id,
                "groups": authUser.group,
                "lecturer_name": disciplineInfo.lecturer,
                "seminarian_name": disciplineInfo.seminarian,
                "discipline_id": disciplineInfo.discipline_id,
            },
                ...answers
            ]

            await postQuiz(newAnswers)
        }
    }

    if (isCompleteQuiz) {
        setTitle('');
        
        return(
            <CompletedQuiz/>
        )
    }

    return( 

        <div>
            <ul className={classes.teacher__list}>
                <li>
                    <h3>Лектор</h3>
                    <p>{disciplineInfo.lecturer}</p>
                </li>
                <li>
                    <h3>Семинарист</h3>
                    <p>{disciplineInfo.seminarian}</p>
                </li>
            </ul>

            <QuestionsList answered={answerHandler} buttonDirty={buttonDirty}/>
            
            {(!validateAnswers && buttonDirty) && <p className={classes.validate__error}>Необходимо заполнить все поля!</p>}
            <MyButton onClick={submitQuiz}>Завершить</MyButton>
        </div>
    );
}
export default FieldQuiz;