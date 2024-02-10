import React from 'react';
import PasswordRecovery from '../components/passwordRecovery/passwordRecovery';

const Recovery = (props) => {
    document.title = props.title;

    return( 
        <PasswordRecovery/>
    );
}
export default Recovery;