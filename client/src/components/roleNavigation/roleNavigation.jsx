import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleNavigation = ({role}) => {

    switch (role) {
        case 'Студент': {
            return <Navigate to='/surveys'/>
        }

        case 'Староста': {
            return <Navigate to='/'/>
        }

        case 'Преподаватель': {
            return <Navigate to='/rating'/>
        }

        case 'Администратор': {
            return <Navigate to='/admin'/>
        }
            
        default:
            return <Navigate to='/auth'/>
    }
}
export default RoleNavigation;