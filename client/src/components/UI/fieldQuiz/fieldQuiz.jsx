import React, {useContext, useState} from 'react';
import classes from './styles.module.scss';
import QuestionsList from '../questionsList/questionsList';
import MyButton from '../myButton/myButton';
import CompletedQuiz from '../completedQuiz/completedQuiz';
import StudentService from '../../../http/studentService';
import { fieldAnswers } from './fieldAnswers';
import { formatBodyAnswers } from '../../../utils/student';
import { AuthContext } from '../../../context';

const FieldQuiz = ({disciplineInfo, setTitle}) => {
    const [answers, setAnswers] = useState(fieldAnswers);
    const [buttonDirty, setButtonDirty] = useState(false);
    const [isCompleteQuiz, setIsCompleteQuiz] = useState(false);
    const {dataUser} = useContext(AuthContext);

    const validateQuiz = () => {
        let validateFlag = true;
        const countTestAnswers = 7;

        for (let i = 0; i < countTestAnswers; i ++){
            if (answers[i].lecturer === '' || answers[i].seminarian === '') {
                validateFlag = false;
            }
        }

        return validateFlag;
    }

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
        const body = formatBodyAnswers(answers, dataUser, disciplineInfo);
        console.log(body);

        if (validateQuiz()) {
            try{
                const response = await StudentService.submitQuiz(dataUser, body)
                if (response.statusCode === 201) {
                    setIsCompleteQuiz(true);
                }
            } catch (e) {
                console.log(e.message);
            }
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
            
            {(!validateQuiz() && buttonDirty) && <p className={classes.validate__error}>Необходимо заполнить все поля!</p>}
            <MyButton onClick={submitQuiz}>Завершить</MyButton>
        </div>
    );
}
export default FieldQuiz;