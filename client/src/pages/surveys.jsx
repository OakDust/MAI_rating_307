import React from 'react';
import Main from '../components/main/main';
import FieldSurveys from '../components/UI/fieldSurveys/fieldSurveys';

const Surveys = (props) => {
        document.title = props.title;
        
        return(
                <Main title='Опросы' displayField={<FieldSurveys/>}/>
        );
}
export default Surveys;