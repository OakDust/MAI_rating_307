import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import { getDisciplines } from '../../../http/getDisciplines';

const FieldSurveys = () => {

    const [disciplines, setDisciplines] = useState(JSON.parse(localStorage.getItem('disciplines')));
    const [isLoading, setIsLoading] = useState(true);

    const user = JSON.parse(localStorage['authUser']);

    useEffect(() => {
            const backendService = async () => {
                if (disciplines === null) {
                    const response = await getDisciplines(
                        process.env.REACT_APP_HOSTNAME + '/student/disciplines',
                        {
                            groups: user.group
                        })
            
                    setDisciplines(response);
                } 
            }
            backendService().then(() => setIsLoading(false));
    }, [])
    
    if (isLoading) {
        return (
            <div>Загрузка...</div>
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