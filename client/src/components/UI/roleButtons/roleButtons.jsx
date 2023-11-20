import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';

const RoleButtons = ({role, setRole}) => {

    const [isStudent, setIsStudent] = useState(true);

    useEffect(() => {
        setIsStudent(role === 'student');

    }, [role, setRole])

    const activeButtonStyle = classes['role__button'] + ' ' + classes.active;

    return(

        <div className={classes.button__container}>
            <button className={isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('student')}>
                Студент
            </button>
            <button className={!isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('professor')}>
                Преподаватель
            </button>
        </div>
    );
}
export default RoleButtons;