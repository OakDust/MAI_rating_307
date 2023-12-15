import React, { useState, useEffect } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import classes from './styles.module.scss';
import background from '../../../assets/backgrounds/groupBackground.webp';
import StatIndication from '../statIndication/statIndication';
import Loader from '../loader/loader';
import StudentService from '../../../http/studentService';

const FieldGroup = ({groupList, dataUser, loading}) => {
    const [disciplines, setDisciplines] = useState([]);

    const [fetchDisciplines, isDisciplinesLoading] = useFetching( async () => {
        const response = await StudentService.getDisciplines(dataUser);
        setDisciplines(response?.distributed_load || []);
    })

    useEffect(() => {
        fetchDisciplines();
    }, [])

    const students = groupList.students;
    const headStudent = groupList.headStudent;

    if (loading || isDisciplinesLoading) {
        return (
            <Loader/>
        )
    }
    
    if (dataUser.role === 'Староста') {
        return(
            <table className={classes.table__group}>
                <thead>
                    <tr>
                        <td>№</td>
                        <td>ФИО</td>
                        <td>Количество пройденных опросов</td>
                    </tr>
                </thead>
                
                <tbody>
                    {students.map((student, index) => (
                        <tr>
                            <td>{index + 1}</td>
                            <td>{student.name}</td>
                            <td>
                                <StatIndication student={student} countSurveys={disciplines.length}/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
    )
    }

    return(
        <div className={classes.group__container}>
            <ul>
                {students.map((student) => (
                    <li>
                        {student}
                    </li>
                ))}
                <li>
                    Староста: 
                    <div>{headStudent}</div>
                </li>
            </ul>

            <img className={classes.group__background} src={background} alt='group'/>
        </div>
    );
}
export default FieldGroup;