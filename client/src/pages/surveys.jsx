import React from 'react';
import Main from '../components/main/main';
import FieldSurveys from '../components/UI/fieldSurveys/fieldSurveys';
import {useLocation} from "react-router-dom";


const Surveys = () => {

    if (localStorage['Authorization']) {
        const token = localStorage['Authorization']
        const [student, isAuth] = token.split(' ')

        return(
            <div>
                {
                    (isAuth && student == 'Student') ? <Main title='Опросы' displayField={<FieldSurveys />}/> : <div>error</div>
                }
            </div>

        );
    } else {
        return (

            //401
            <div>error</div>
        )
    }

}
export default Surveys;