import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import Loader from '../loader/loader';
import MyButton from '../myButton/myButton';
import StudentService from '../../../http/studentService';
import { checkIsElectiveSubject, checkSubmittedSurveys } from '../../../utils/student';
import { useFetching } from '../../../hooks/useFetching';
import { AuthContext } from '../../../context';
import Errors from '../../../pages/errors';
import ModalWindow from '../modalWindow/modalWindow';
import ChoiceElective from '../choiceElective/choiceElective';

const FieldSurveys = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [surveysPassed, setSurveysPassed] = useState([]);
    const [isElectiveSubject, setIsElectiveSubject] = useState(false);
    const [typeElective, setTypeElective] = useState('');
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading, error] = useFetching( async () => {
        const response = await StudentService.getDisciplines(dataUser);
        
        setDisciplines(response?.distributed_load || []);
        setSurveysPassed(response?.surveys_passed || [])
    })

    useEffect(() => {
        fetchDisciplines();
    }, [])

    const electiveHandler = (electiveType) => {
        setTypeElective(electiveType);
        setIsElectiveSubject(true);
    }

    const showButtonForDiscipline = (discipline) => {
        const disciplineName = discipline.discipline;
        const [isElective, electiveType] = checkIsElectiveSubject(disciplineName);

        if (checkSubmittedSurveys(surveysPassed, disciplineName, discipline.discipline_id)) {
            return (
                <MyButton>Пройден</MyButton>
            )
        }
        else if (isElective) {
            return (
                <LinkButton onClick={() => electiveHandler(electiveType)}>Пройти опрос</LinkButton>
            )
        }
        else {
            return (
                <LinkButton to={'/surveys/quiz'} state={discipline}>Пройти опрос</LinkButton>
            )
        }
    }

    if (isDisciplinesLoading) {
        return (
            <Loader/>
        )
    }

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    return(
        <div>
            {isElectiveSubject && 
            <ModalWindow visible={isElectiveSubject} setVisible={setIsElectiveSubject}>
                <ChoiceElective typeElective={typeElective}></ChoiceElective>
            </ModalWindow>}

            <ul className={classes.surveys__list}>
                {disciplines.map((discipline) => (
                    <li key={discipline.discipline}>
                        <p>{discipline.discipline}</p>

                        {showButtonForDiscipline(discipline)}                    
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default FieldSurveys;