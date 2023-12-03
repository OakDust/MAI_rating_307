import React, {useState, useEffect} from 'react';
import classes from './styles.module.scss';

const RoleButtons = ({role, setRole}) => {

    const [isStudent, setIsStudent] = useState(true);

    useEffect(() => {
        setIsStudent(role === 'Студент');

    }, [role, setRole])

    const activeButtonStyle = classes['role__button'] + ' ' + classes.active;

    return(

        <div className={classes.button__container}>
            <button className={isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('Студент')}>
                Студент
            </button>
            <button className={!isStudent ? (activeButtonStyle) : classes.role__button} onClick={() => setRole('Преподаватель')}>
                Преподаватель
            </button>
        </div>
    );
}
export default RoleButtons;