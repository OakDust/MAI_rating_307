import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';
import { useParams } from 'react-router-dom';

const RoleButtons = ({role, setRole, isRegistration}) => {
    const [isStudent, setIsStudent] = useState(true);
    let {registrationId} = useParams();

    useEffect(() => {
        setIsStudent(role === 'Студент')

    }, [role, setRole])

    const activeButtonStyle = classes['role__button'] + ' ' + classes.active;

    const isStudentRegistration = () => {
        if (!isRegistration || registrationId === process.env.REACT_APP_REGISTRATION_PROFESSOR_LINK) {
            return false;
        }

        return true;
    }

    return(

        <div className={classes.button__container}>
            <button className={isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('Студент')}>
                Студент
            </button>
            
            <button disabled={isStudentRegistration()} className={!isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('Преподаватель')}>
                Преподаватель
            </button>
        </div>
    );
}
export default RoleButtons;