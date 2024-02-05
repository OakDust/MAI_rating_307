import React, {useContext, useEffect, useState} from 'react';
import classes from './styles.module.scss';
import QuestionsList from '../questionsList/questionsList';
import MyButton from '../myButton/myButton';
import CompletedQuiz from '../completedQuiz/completedQuiz';
import StudentService from '../../../http/studentService';
import { fieldAnswers } from './fieldAnswers';
import { checkEmptyTeacher, formatBodyAnswers } from '../../../utils/student';
import { AuthContext } from '../../../context';
import Errors from '../../../pages/errors';

const FieldQuiz = ({disciplineInfo, teachersByDiscipline, setTitle}) => {
    const [answers, setAnswers] = useState(fieldAnswers);
    const [buttonDirty, setButtonDirty] = useState(false);
    const [isCompleteQuiz, setIsCompleteQuiz] = useState(false);
    const [error, setError] = useState('');
    const {dataUser} = useContext(AuthContext);

    const validateQuiz = () => {
        let validateFlag = true;
        const countTestAnswers = 7;

        for (let i = 0; i < countTestAnswers; i ++){
            if ((disciplineInfo.lecturer && answers[i].lecturer === '') || (disciplineInfo.seminarian && answers[i].seminarian === '')) {
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

        if (validateQuiz()) {
            try{
                const response = await StudentService.submitQuiz(dataUser, body);
                
                if (response.ok) {
                    setIsCompleteQuiz(true);
                }
            } catch (e) {
                setError(e.message);
            }
        }
    }
    
    const showNotEmptyTeacher = (teacher) => {
        const teacherName = teacher.name || 'Не распределено';

        return (
            <li key={teacher.type}>
                <h3>{teacher.type}</h3>
                <p>{teacherName}</p>
            </li>
        )
    }

    const showQuestionsList = () => {
        if (disciplineInfo.lecturer || disciplineInfo.seminarian) {
            return (
                <QuestionsList answered={answerHandler} buttonDirty={buttonDirty} teachersByDiscipline={teachersByDiscipline}/>
            )
        }
        else {
            return (
                <div className={classes.validate__error}>
                    <p>Необходимо распределение нагрузки</p>
                    <p>Обратитесь к старосте или попробуйте пройти опрос позже</p>
                </div>
            )
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0 });

        if (isCompleteQuiz) {
            setTitle('');
        }

    }, [isCompleteQuiz])

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    if (isCompleteQuiz) {
        return(
            <CompletedQuiz/>
        )
    }

    return( 
        <div>
            <ul className={classes.teacher__list}>
                {teachersByDiscipline.map((teacher) => (
                    showNotEmptyTeacher(teacher)
                ))}
            </ul>
            
            {showQuestionsList()}
            
            {(!validateQuiz() && buttonDirty) && <p className={classes.validate__error}>Необходимо заполнить все поля!</p>}
            <MyButton onClick={submitQuiz}>Завершить</MyButton>
        </div>
    );
}
export default FieldQuiz;