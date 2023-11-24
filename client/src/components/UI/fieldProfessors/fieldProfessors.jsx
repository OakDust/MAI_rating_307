import React, {useState, useEffect} from 'react';
import { getDisciplines } from '../../../http/getDisciplines';
import classes from './styles.module.scss';
import Loader from '../loader/loader';

const FieldProfessors = () => {
    const [disciplines, setDisciplines] = useState(JSON.parse(localStorage.getItem('disciplines')));
    const [isLoading, setIsLoading] = useState(true);

    const user = JSON.parse(localStorage['authUser']);

    useEffect(() => {
        const fetchDisciplines = async () => {
            if (disciplines === null) {
                const url = `${process.env.REACT_APP_HOSTNAME}/student/disciplines`
                const response = await getDisciplines(url, {groups: user.group});

                localStorage.setItem('disciplines', JSON.stringify(response.distributed_load));
                localStorage.setItem('surveysPassed', JSON.stringify(response.surveys_passed));
        
                setDisciplines(response.distributed_load);
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

        <ul className={classes.disciplines__list}>
            {disciplines.map(discipline => (
                <>
                    <li>
                        <p>{discipline.discipline}</p>
                        <p>{discipline.lecturer}</p>
                        <p>ЛК</p>
                    </li>
                    <li>
                        <p>{discipline.discipline}</p>
                        <p>{discipline.seminarian}</p>
                        <p>ПЗ</p>
                    </li>
                </>
            ))}
        </ul>
    );
}
export default FieldProfessors;