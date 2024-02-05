import React, {useState} from 'react';
import Main from '../components/main/main';
import FieldQuiz from '../components/UI/fieldQuiz/fieldQuiz';
import {useLocation} from 'react-router-dom';

const Quiz = (props) => {
    const location = useLocation()
    const disciplineInfo = location.state;
    const disciplineName = disciplineInfo.discipline ?? disciplineInfo.discipline_name;

    const teachersByDiscipline = [
        {
            type: 'Лектор',
            subject_type: 'Лекции',
            role: 'lecturer',
            name: disciplineInfo.lecturer,
            id: disciplineInfo.lecturer_id,
        },
        {
            type: 'Семинарист',
            subject_type: 'Семинары',
            role: 'seminarian',
            name: disciplineInfo.seminarian,
            id: disciplineInfo.seminarian_id,
        }
    ]

    document.title = `${props.title} ${disciplineName}`;

    const [title, setTitle] = useState(`Опрос по дисциплине "${disciplineName}"`) 

    return(
        <Main title={title} 
        displayField={<FieldQuiz 
            disciplineInfo={disciplineInfo} 
            teachersByDiscipline={teachersByDiscipline} 
            setTitle={setTitle}/>}/>
    );
}
export default Quiz;