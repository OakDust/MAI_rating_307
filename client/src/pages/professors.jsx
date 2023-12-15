import React from 'react';
import FieldProfessors from '../components/UI/fieldProfessors/fieldProfessors';
import Main from '../components/main/main';

const Professors = (props) => {
    document.title = props.title;

    return( 

        <Main title='Список предметов и преподавателей' displayField={<FieldProfessors/>}/>
    );
}
export default Professors;