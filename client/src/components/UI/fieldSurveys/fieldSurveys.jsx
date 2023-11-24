import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import { getDisciplines } from '../../../http/getDisciplines';
import Loader from '../loader/loader';
import MyButton from '../myButton/myButton';
const FieldSurveys = () => {

    const [disciplines, setDisciplines] = useState(JSON.parse(localStorage.getItem('disciplines')));
    const [surveysPassed, setSurveysPassed] = useState(JSON.parse(localStorage.getItem('surveysPassed')));
    const [isLoading, setIsLoading] = useState(true);

    const user = JSON.parse(localStorage['authUser']);

    useEffect(() => {
        const fetchDisciplines = async () => {
            const url = `${process.env.REACT_APP_HOSTNAME}/student/disciplines`
            const response = await getDisciplines(url, {groups: user.group});

            localStorage.setItem('disciplines', JSON.stringify(response.distributed_load));
            localStorage.setItem('surveysPassed', JSON.stringify(response.surveys_passed));
    
            setDisciplines(response.distributed_load);
            setSurveysPassed(response.surveys_passed)
        }
        fetchDisciplines().then(() => setIsLoading(false));
    }, [user.group])

    const checkSubmittedSurveys = (disciplineId) => {
        const submittedSurveys = surveysPassed[0]?.submitted_surveys;
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

    if (isLoading) {
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