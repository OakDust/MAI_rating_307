import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import { getDisciplines } from '../../../http/getDisciplines';
import Loader from '../loader/loader';
const FieldSurveys = () => {

    const [disciplines, setDisciplines] = useState(JSON.parse(localStorage.getItem('disciplines')));
    const [isLoading, setIsLoading] = useState(true);

    const user = JSON.parse(localStorage['authUser']);

    useEffect(() => {
        const fetchDisciplines = async () => {
            if (disciplines === null) {
                const url = `${process.env.REACT_APP_HOSTNAME}/student/disciplines`
                const response = await getDisciplines(url, {groups: user.group});

                localStorage.setItem('disciplines', JSON.stringify(response));
        
                setDisciplines(response);
            } 
        }
        fetchDisciplines().then(() => setIsLoading(false));
    })
    
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
                    <LinkButton to={`/surveys/quiz`} state={discipline}>Пройти опрос</LinkButton>
                </li>
            ))}
        </ul>
    )
    
}
export default FieldSurveys;