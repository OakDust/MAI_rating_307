import React from 'react';
import Auth from '../components/auth/auth';

const Registration = (props) => {
    document.title = props.title;
    
    return(

        <Auth isRegistration={true}/>
    );
}
export default Registration;