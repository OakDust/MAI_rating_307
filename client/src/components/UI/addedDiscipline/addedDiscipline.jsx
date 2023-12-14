import React, {useState} from 'react';
import { setFullFormatGroup } from '../../../utils/student';

const AddedDiscipline = ({dataUser, fetchDisciplines}) => {
    const [disciplineName, setDisciplineName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [typeDiscipline, setTypeDiscipline] = useState('ПЗ');

    const addDiscipline = async () => {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/createDiscipline`;
        const [surname, name, patronymic] = teacherName.split(' ');
        const groupName = setFullFormatGroup(dataUser.group);

        const body = {
            discipline_name: disciplineName,
            teacher_surname: surname,
            teacher_name: name,
            teacher_patronymic: patronymic,
            group_id: dataUser.group_id,
            group_name: groupName,
            semester: 0,
            lectures: (typeDiscipline === 'ЛК' ? 1 : 0),
            practical: (typeDiscipline === 'ПЗ' ? 1 : 0),
            laboratory: 0,
        }

        console.log(body);
        
        const requestHeaders = {
            method: "PUT", 
            mode: "cors",
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                "Authorization": dataUser.Authorization,
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);
        const message = response.json();

        console.log(message);
        fetchDisciplines();
    }

    return( 

        <tr>
            <td>
                <input 
                    onChange={(e) => setDisciplineName(e.target.value)}
                    value={disciplineName}
                />
            </td>
            <td>
                <input 
                    onChange={(e) => setTeacherName(e.target.value)}
                    value={teacherName}
                />
            </td>
            <td>
                <select value={typeDiscipline} onChange={(e) => setTypeDiscipline(e.target.value)}>
                    <option value='ПЗ'>ПЗ</option>
                    <option value='ЛК'>ЛК</option>
                </select>
            </td>
            <td><div onClick={() => addDiscipline()}>add</div></td>
        </tr>
    );
}
export default AddedDiscipline;