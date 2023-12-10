import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import Loader from '../loader/loader';
import { AuthContext } from '../../../context';
import { useFetching } from '../../../hooks/useFetching';
import { formattingProfessorsList, formattingTeachersList} from '../../../utils/student';
import StudentService from '../../../http/studentService';
import editIcon from '../../../assets/icons/edit.webp';
import EditableItem from '../editableItem/editableItem';


const FieldProfessors = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading] = useFetching(async () => {
        const response = await StudentService.getDisciplines(dataUser);
        formattingProfessorsList(response.distributed_load);
        console.log(response);
        setDisciplines(response.distributed_load);
    })

    const [fetchTeachers, isTeachersLoading] = useFetching(async () => {
        const response = await StudentService.getTeachers(dataUser);
        console.log(response);
        const teachers = formattingTeachersList(response);

        setTeachersList(teachers);
    })

    useEffect(() => {
        fetchDisciplines();
        fetchTeachers();
    }, [])

    const updateTeacher = async (teacher, discipline, type) => {
        const response = await StudentService.updateTeacher(teacher, discipline, dataUser, type);
        console.log(response);
        fetchDisciplines();
    }

    if (isDisciplinesLoading || isTeachersLoading) {
        return (
            <Loader/>
        )
    }
    
    return( 
        <table className={classes.disciplines__table}>
            <thead>
                <th>Дисциплина</th>
                <th>ФИО преподавателя</th>
                <th>Форма</th>
                <th>Ред.</th>
            </thead>
            <tbody>
                {disciplines.map(discipline => (
                    <>
                        <tr>
                            <td>{discipline.discipline}</td>
                            <td>{discipline.lecturer}</td>
                            <td>ЛК</td>
                            <td><img src={editIcon} atl='Редактировать'/></td>
                        </tr>
                        <tr>
                            <td>{discipline.discipline}</td>
                            <td>{discipline.seminarian}</td>
                            <td>ПЗ</td>
                            <td><img src={editIcon} atl='Редактировать'/></td>
                        </tr>
                    </>
                ))}
            </tbody>
        </table>

        // <ul className={classes.disciplines__list}>
        //     {disciplines.map(discipline => (
        //         <>
        //             <li className={classes.discipline__table}>
        //                 <p className={classes.discipline__info}>{discipline.discipline}</p>
        //                 <EditableItem 
        //                     listItems={teachersList} 
        //                     updateValue={updateTeacher}
        //                     discipline={discipline}
        //                     type={[1, 0]}
        //                 >{discipline.lecturer}</EditableItem>
        //                 <p>ЛК</p>
        //             </li>
        //             <li className={classes.discipline__table}>
        //                 <p className={classes.discipline__info}>{discipline.discipline}</p>
        //                 <EditableItem 
        //                     listItems={teachersList} 
        //                     updateValue={updateTeacher}
        //                     discipline={discipline}
        //                     type={[0, 1]}
        //                 >{discipline.seminarian}</EditableItem>
        //                 <p>ПЗ</p>
        //             </li>
        //         </>
        //     ))}
        // </ul>
    );
}
export default FieldProfessors;