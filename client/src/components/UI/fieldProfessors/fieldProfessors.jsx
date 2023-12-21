import React, {useState, useEffect, useContext} from 'react';
import classes from './styles.module.scss';
import Loader from '../loader/loader';
import { AuthContext } from '../../../context';
import { useFetching } from '../../../hooks/useFetching';
import { formattingTeachersList} from '../../../utils/student';
import StudentService from '../../../http/studentService';
import EditableDiscipline from '../editableDiscipline/editableDiscipline';
import AddedDiscipline from '../addedDiscipline/addedDiscipline';
import MyButton from '../myButton/myButton';
import Errors from '../../../pages/errors';

const FieldProfessors = () => {
    const [disciplines, setDisciplines] = useState([]);
    const [teachersList, setTeachersList] = useState([]);
    const [addDiscipline, setAddDiscipline] = useState({mode: false, title: 'Добавить дисциплину'});
    const [error, setError] = useState('');
    const {dataUser} = useContext(AuthContext);
    const [fetchDisciplines, isDisciplinesLoading, errorFetchDisciplines] = useFetching(async () => {
        const response = await StudentService.getDisciplines(dataUser);
        
        setDisciplines(response?.distributed_load || []);
    })
    const [fetchTeachers, isTeachersLoading, errorFetchTeachers] = useFetching(async () => {
        const response = await StudentService.getTeachers(dataUser);
        const teachers = formattingTeachersList(response);

        setTeachersList(teachers);
    })

    useEffect(() => {
        fetchDisciplines();
        fetchTeachers();
    }, [])

    const updateTeacher = async (teacher, discipline, type) => {
        try {
            await StudentService.updateTeacher(teacher, discipline, dataUser, type);
            fetchDisciplines();
        }
        catch (e) {
            setError(e.message);
        }
        
    }

    const addDisciplineHandler = () => {
        setAddDiscipline(
            addDiscipline.mode 
            ? {mode: false, title: 'Добавить дисциплину'} 
            : {mode: true, title: 'Отменить'}
        )
    }

    const showNotEmptyTeacher = (discipline, teacher, type) => {
        if (teacher) {
            return (
                <EditableDiscipline
                    discipline={discipline} 
                    teacher={teacher} 
                    type={type}
                    listItems={teachersList}
                    updateValue={updateTeacher}
                />
            )
        }
    }

    if (isDisciplinesLoading || isTeachersLoading) {
        return (
            <Loader/>
        )
    }

    const occurredError = errorFetchDisciplines || errorFetchTeachers || error

    if (occurredError) {
        return (
            <Errors message={occurredError}/>
        )
    }
    
    return( 
        <div className={classes.disciplines__container}>
            <MyButton onClick={() => addDisciplineHandler()}>{addDiscipline.title}</MyButton>
            <div className={classes.table__block}>
                <table className={classes.disciplines__table}>
                    <thead>
                        <tr>
                            <td>Дисциплина</td>
                            <td>ФИО преподавателя</td>
                            <td>Форма</td>
                            <td>Ред.</td>
                        </tr>
                    </thead>
                    <tbody>
                        <AddedDiscipline 
                            dataUser={dataUser} 
                            fetchDisciplines={fetchDisciplines}
                            teachersList={teachersList}
                            isAddMode={addDiscipline.mode}
                        />
                        {disciplines.map(discipline => (
                            <>
                                {showNotEmptyTeacher(discipline, discipline.lecturer, 'ЛК')}
                                {showNotEmptyTeacher(discipline, discipline.seminarian, 'ПЗ')}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        
    );
}
export default FieldProfessors;