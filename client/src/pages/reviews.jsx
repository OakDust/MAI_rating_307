import React from 'react';
import { useLocation } from 'react-router-dom';
import Main from '../components/main/main';
import FieldReviews from '../components/UI/fieldReviews/fieldReviews';

const Reviews = (props) => {
    const location = useLocation();
    const professorInfo = location.state;
    document.title = props.title + professorInfo.name;
    
    return( 
        <Main displayField={<FieldReviews professorInfo={professorInfo}/>} title={professorInfo.name}/>
    );
}
export default Reviews;