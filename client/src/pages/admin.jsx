import React from 'react';
import Main from '../components/main/main';
import FieldAdmin from '../components/UI/fieldAdmin/fieldAdmin';

const Admin = (props) => {
    document.title = props.title;

    return( 

        <Main title='Рейтинг всех преподавателей' displayField={<FieldAdmin/>}/>
    );
}
export default Admin;