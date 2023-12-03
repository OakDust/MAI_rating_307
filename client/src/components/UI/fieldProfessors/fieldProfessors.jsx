import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import Loader from '../loader/loader';
import { AuthContext } from '../../../context';
import { useFetching } from '../../../hooks/useFetching';
import StudentService from '../../../http/studentService';
import { formattingProfessorsList } from '../../../utils/student';

const FieldProfessors = () => {
    const [disciplines, setDisciplines] = useState([]);
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading] = useFetching(async () => {
        const response = await StudentService.getDisciplines(dataUser);
        formattingProfessorsList(response.distributed_load);
        
        setDisciplines(response.distributed_load);
    })

    useEffect(() => {
        fetchDisciplines();
    }, [])
    
    if (isDisciplinesLoading) {
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