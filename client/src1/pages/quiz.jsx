import React from 'react';
import Main from '../components/main/main';
import FieldQuiz from '../components/UI/fieldQuiz/fieldQuiz';
import {useLocation} from 'react-router-dom';
// import { disciplinesList } from '../components/main/aboutUser';

// const disciplines = [
//     {
//         key: 'guid001',
//         discipline: 'Алгоритмы и обработка данных',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid002',
//         discipline: 'Базы данных',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid003',
//         discipline: 'Дифференциальные уравнения',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid004',
//         discipline: 'Иностранный язык',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid005',
//         discipline: 'Математическое моделирование',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid006',
//         discipline: 'Общая физика',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
//     {
//         key: 'guid007',
//         discipline: 'Основы психологии',
//         lecturer: 'Маркарян О.О',
//         seminarian: 'Маркарян О.О',
//     },
// ]
const Quiz = () => {
    const location = useLocation()
    const disciplines = location.state

    return(
        <Main title={`Опрос по дисциплине ${disciplines.discipline}`} displayField={<FieldQuiz disciplineInfo={disciplines}/>}/>
    );
}
export default Quiz;