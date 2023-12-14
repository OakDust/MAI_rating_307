import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import Loader from '../loader/loader';
import MyButton from '../myButton/myButton';
import StudentService from '../../../http/studentService';
import { formattingProfessorsList } from '../../../utils/student';
import { useFetching } from '../../../hooks/useFetching';
import { AuthContext } from '../../../context';

const FieldSurveys = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [surveysPassed, setSurveysPassed] = useState([]);

    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading] = useFetching( async () => {
        const response = await StudentService.getDisciplines(dataUser);

        setDisciplines(response.distributed_load);
        setSurveysPassed(response.surveys_passed)
    })

    useEffect(() => {
        fetchDisciplines();
    }, [])

    const checkSubmittedSurveys = (disciplineId) => {
        const submittedSurveys = surveysPassed?.submitted_surveys;
        let submitted = false;

        if (submittedSurveys) {
            submittedSurveys.forEach(survey => {
                if (survey.discipline_id === disciplineId) {
                    submitted = true;
                }
            });
        }

        return submitted;
    }

    if (isDisciplinesLoading) {
        return (
            <Loader/>
        )
    }

    return(
        <ul className={classes.surveys__list}>
            {disciplines.map((discipline) => (
                <li>
                    <p>{discipline.discipline}</p>
                    {checkSubmittedSurveys(discipline.discipline_id) 
                    ? (<MyButton>Пройден</MyButton>) 
                    : (<LinkButton to={`/surveys/quiz`} state={discipline}>Пройти опрос</LinkButton>)}
                    
                </li>
            ))}
        </ul>
    )
    
}
export default FieldSurveys;