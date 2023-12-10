import React from 'react';
import classes from './styles.module.scss';
import background from '../../../assets/backgrounds/groupBackground.webp';
import StatIndication from '../statIndication/statIndication';
import Loader from '../loader/loader';


const FieldGroup = ({groupList, userRole, loading}) => {
    const students = groupList.students;
    const headStudent = groupList.headStudent;

    if (loading) {
        return (
            <Loader/>
        )
    }
    
    if (userRole === 'Староста') {
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
                                <StatIndication student={student}/>
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