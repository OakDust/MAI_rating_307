import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import Loader from '../loader/loader';
import { AuthContext } from '../../../context';
import { useFetching } from '../../../hooks/useFetching';
import { formattingProfessorsList, formattingTeachersList} from '../../../utils/student';
import StudentService from '../../../http/studentService';
import EditableDiscipline from '../editableDiscipline/editableDiscipline';

const FieldProfessors = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading] = useFetching(async () => {
        const response = await StudentService.getDisciplines(dataUser);
        formattingProfessorsList(response.distributed_load);
        
        setDisciplines(response.distributed_load);
    })

    const [fetchTeachers, isTeachersLoading] = useFetching(async () => {
        const response = await StudentService.getTeachers(dataUser);
        const teachers = formattingTeachersList(response);

        setTeachersList(teachers);
    })

    useEffect(() => {
        fetchDisciplines();
        fetchTeachers();
    }, [])

    const updateTeacher = async (teacher, discipline, type) => {
        await StudentService.updateTeacher(teacher, discipline, dataUser, type);
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
                <td>Дисциплина</td>
                <td>ФИО преподавателя</td>
                <td>Форма</td>
                <td>Ред.</td>
            </thead>
            <tbody>
                {disciplines.map(discipline => (
                    <>
                        <EditableDiscipline
                            discipline={discipline} 
                            teacher={discipline.lecturer} 
                            type={'ЛК'}
                            listItems={teachersList}
                            updateValue={updateTeacher}
                        />
                        <EditableDiscipline 
                            discipline={discipline} 
                            teacher={discipline.seminarian} 
                            type={'ПЗ'}
                            listItems={teachersList}
                            updateValue={updateTeacher}
                        />
                    </>
                ))}
            </tbody>
        </table>
    );
}
export default FieldProfessors;