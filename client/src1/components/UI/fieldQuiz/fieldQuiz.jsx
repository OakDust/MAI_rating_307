import React, {useState} from 'react';
import classes from './styles.module.scss';
import QuestionsList from '../questionsList/questionsList';
import MyButton from '../myButton/myButton';
import { templateAnswer } from './templateAnswer';

const FieldQuiz = ({disciplineInfo}) => {

    const [answers, setAnswers] = useState(templateAnswer);

    const answerHandler = (newAnswer, numberQuestion, role) => {
        const updatedAnswers = answers.map((answer) => {
            if (answer.id === numberQuestion) {
                return {...answer, [role] : newAnswer};
            }
            return answer;
        });
        
        setAnswers(updatedAnswers);
    }

    const submitAsnwers = () => {
        console.log(answers);
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

            <QuestionsList answered={answerHandler}/>
            
            <MyButton onClick={submitAsnwers}>Завершить</MyButton>
        </div>
    );
}
export default FieldQuiz;