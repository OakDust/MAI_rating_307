import React from 'react';
import FieldProfessors from '../components/UI/fieldProfessors/fieldProfessors';
import Main from '../components/main/main';

const Professors = () => {
    return( 

        <Main title='Список преподавателей' displayField={<FieldProfessors/>}/>
    );
}
export default Professors;