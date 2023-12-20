import React from 'react';
import Auth from '../components/auth/auth.jsx';

const Authorization = (props) => {
    document.title = props.title
    
    return(

        <Auth/>
    );
}
export default Authorization;