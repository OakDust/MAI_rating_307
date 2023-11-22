import React from 'react';
import Main from '../components/main/main';
import FieldSurveys from '../components/UI/fieldSurveys/fieldSurveys';

const Surveys = () => {

        return(
                <Main title='Опросы' displayField={<FieldSurveys/>}/>
        );
}
export default Surveys;