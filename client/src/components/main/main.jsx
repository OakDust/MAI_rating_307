import React, {useState} from 'react';
import classes from './styles.module.scss';
import pointerIcon from '../../assets/icons/pointer.webp';
import AboutUser from '../UI/aboutUser/aboutUser.jsx';
import MyButton from '../UI/myButton/myButton';
import FieldMain from '../UI/fieldMain/fieldMain.jsx';
import {Navigate} from "react-router-dom";

const Main = (props) => {
    let [logged, setLogged] = useState(true)

    const [userInfo, setUserInfo] = useState({
        role: localStorage.getItem('User role'),
        name: localStorage.getItem('User name'),
        groups: localStorage.getItem('User group')
    })

    const exit = (event) => {
        event.preventDefault()
        setLogged(false)
        localStorage.removeItem('Authorization')
    }

    return( 

        <div className={classes.container}>
            <div className={classes.main__header}>
                <div className={classes.main__title}>
                    <img src={pointerIcon} alt="pointer"/>
                    <h1>ОПРОС КАФЕДРЫ 307</h1>
                </div>

                <MyButton onClick={event => { exit(event) } }>
                    Выйти
                </MyButton>
            </div>

            <div className={classes.main__body}>
                <AboutUser userInfo={userInfo}/>
                <FieldMain title={props.title} displayField={props.displayField}/>
            </div>

            <div>
                {!logged ? <Navigate to='/auth'/> : null}
            </div>

        </div>
    );
}
export default Main;