import React from 'react';
import Main from '../components/main/main';
import FieldSurveys from '../components/UI/fieldSurveys/fieldSurveys';


const Surveys = () => {

    if (localStorage['authUser']) {
        const user = JSON.parse(localStorage['authUser']);
        const token = user.Authorization;
        const [student, isAuth] = token.split(' ')

        return(
            <div>
                {
                    (isAuth && student == 'Student')
                     ? <Main title='Опросы' displayField={<FieldSurveys/>}/>
                     : <div>error</div>
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