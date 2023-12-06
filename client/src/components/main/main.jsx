import React, { useContext } from 'react';
import classes from './styles.module.scss';
import pointerIcon from '../../assets/icons/pointer.webp';
import AboutUser from '../UI/aboutUser/aboutUser.jsx';
import LinkButton from '../UI/linkButton/linkButton.jsx';
import FieldMain from '../UI/fieldMain/fieldMain.jsx';
import { AuthContext } from '../../context/index.js';

const Main = (props) => {

    const {setIsAuth} = useContext(AuthContext);
    const userInfo = JSON.parse(localStorage.getItem('authUser'));

    const logout = () => {
        setIsAuth(false);
        localStorage.clear();
    }

    return( 

        <div className={classes.container}>
            <div className={classes.main__header}>
                <div className={classes.main__title}>
                    <img src={pointerIcon} alt="pointer"/>
                    <h1>ОПРОС КАФЕДРЫ 307</h1>
                </div>

                <LinkButton to="/auth" onClick={logout}>
                    Выйти
                </LinkButton>
            </div>

            <div className={classes.main__body}>
                <AboutUser userInfo={userInfo}/>
                <FieldMain title={props.title} displayField={props.displayField}/>
            </div>

        </div>
    );
}
export default Main;