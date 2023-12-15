import React, {useState} from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import SearchInput from '../searchInput/searchInput';
import StudentService from '../../../http/studentService';

const AddedDiscipline = ({dataUser, fetchDisciplines, isAddMode, teachersList}) => {
    const [disciplineName, setDisciplineName] = useState('');
    const [teacherName, setTeacherName] = useState({});
    const [typeDiscipline, setTypeDiscipline] = useState('ПЗ');

    const addDiscipline = async () => {
        await StudentService.addDiscipline(teacherName, disciplineName, typeDiscipline, dataUser);

        fetchDisciplines();
    }

    if (isAddMode) {

        return( 
            <tr className={classes.added__row}>
                <td>
                    <input 
                        onChange={(e) => setDisciplineName(e.target.value)}
                        value={disciplineName}
                    />
                </td>
                <td>
                    <SearchInput
                        onChange={(e) => setTeacherName(e.target.value)}
                        value={teacherName}
                        setValue={setTeacherName}
                        list={teachersList}
                    />
                </td>
                <td>
                    <select value={typeDiscipline} onChange={(e) => setTypeDiscipline(e.target.value)}>
                        <option value='ПЗ'>ПЗ</option>
                        <option value='ЛК'>ЛК</option>
                    </select>
                </td>
                <td><MyButton onClick={() => addDiscipline()}>Добавить</MyButton></td>
            </tr>
        );
    }
}
export default AddedDiscipline;