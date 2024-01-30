import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import Loader from '../loader/loader';
import MyButton from '../myButton/myButton';
import StudentService from '../../../http/studentService';
import { checkSubmittedSurveys } from '../../../utils/student';
import { useFetching } from '../../../hooks/useFetching';
import { AuthContext } from '../../../context';
import Errors from '../../../pages/errors';

const FieldSurveys = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [surveysPassed, setSurveysPassed] = useState([]);
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading, error] = useFetching( async () => {
        const response = await StudentService.getDisciplines(dataUser);

        setDisciplines(response?.distributed_load || []);
        setSurveysPassed(response?.surveys_passed || [])
    })

    useEffect(() => {
        fetchDisciplines();
    }, [])

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
        <ul className={classes.surveys__list}>
            {disciplines.map((discipline) => (
                <li key={discipline.discipline_id}>
                    <p>{discipline.discipline}</p>
                    
                    {checkSubmittedSurveys(surveysPassed, discipline.discipline_id) 
                    ? (<MyButton>Пройден</MyButton>) 
                    : (<LinkButton to={`/surveys/quiz`} state={discipline}>Пройти опрос</LinkButton>)}
                    
                </li>
            ))}
        </ul>
    )
    
}
export default FieldSurveys;