import React, {useState} from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';
import SearchInput from '../searchInput/searchInput';
import StudentService from '../../../http/studentService';
import MyInput from '../myInput/myInput';
import MySelect from '../mySelect/mySelect';

const AddedDiscipline = ({dataUser, fetchDisciplines, isAddMode, teachersList}) => {
    const [disciplineName, setDisciplineName] = useState('');
    const [teacherName, setTeacherName] = useState({});
    const [typeDiscipline, setTypeDiscipline] = useState('ПЗ');

    const addDiscipline = async () => {
        if (teacherName && disciplineName) {
            await StudentService.addDiscipline(teacherName, disciplineName, typeDiscipline, dataUser);
            fetchDisciplines();
        }
    }

    if (isAddMode) {

        return( 
            <tr className={classes.added__row}>
                <td>
                    <MyInput
                        onChange={(e) => setDisciplineName(e.target.value)}
                        value={disciplineName}
                        placeholder='Название дисциплины'
                    />
                </td>
                <td>
                    <SearchInput
                        onChange={(e) => setTeacherName(e.target.value)}
                        value={teacherName}
                        setValue={setTeacherName}
                        list={teachersList}
                        placeholder='ФИО преподавателя'
                    />
                </td>
                <td>
                    <MySelect
                        defaultValue='Тип'
                        value={typeDiscipline}
                        onChange={(type) => setTypeDiscipline(type)}
                        options={[
                            {name: 'ПЗ', value: 'ПЗ'}, 
                            {name: 'ЛК', value: 'ЛК'}
                        ]}
                    />
                </td>
                <td><MyButton onClick={() => addDiscipline()}>Добавить</MyButton></td>
            </tr>
        );
    }
}
export default AddedDiscipline;