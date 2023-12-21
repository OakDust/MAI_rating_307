import React, { useState, useEffect } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import classes from './styles.module.scss';
import background from '../../../assets/backgrounds/groupBackground.webp';
import StatIndication from '../statIndication/statIndication';
import Loader from '../loader/loader';
import StudentService from '../../../http/studentService';
import Errors from '../../../pages/errors';

const FieldGroup = ({groupList, dataUser, loading}) => {
    const [disciplines, setDisciplines] = useState([]);
    const [fetchDisciplines, isDisciplinesLoading, error] = useFetching( async () => {
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

    if (error) {
        return (
            <Errors message={error}/>
        )
    }
    
    if (dataUser.role === 'Староста') {
        return(
            <div className={classes.table__block}>
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
                            <tr key={student.name}>
                                <td>{index + 1}</td>
                                <td>{student.name}</td>
                                <td>
                                    <StatIndication student={student} countSurveys={disciplines.length}/>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
    )
    }

    return(
        <div className={classes.group__container}>
            <ul>
                {students.map((student) => (
                    <li key={student}>
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