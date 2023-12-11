import React, { useContext } from 'react';
import classes from './styles.module.scss';
import LinkButton from '../UI/linkButton/linkButton.jsx';
import FieldMain from '../UI/fieldMain/fieldMain.jsx';
import { AuthContext } from '../../context/index.js';

const Main = (props) => {

    const {setIsAuth, dataUser} = useContext(AuthContext);

    const [name, surname] = dataUser.name.split(' ');

    const logout = () => {
        setIsAuth(false);
        localStorage.clear();
    }

    return( 

        <div className={classes.container}>
            <div className={classes.main__header}>
                <div className={classes.user__info}>
                    <h3>{name}</h3>
                    <h3>{surname}</h3>
                    <p>{dataUser.group}</p>
                </div>

                <h1>ОПРОС КАФЕДРЫ 307</h1>

                <LinkButton to="/auth" onClick={logout}>
                    Выйти
                </LinkButton>
            </div>

            <div className={classes.main__body}>
                <FieldMain title={props.title} displayField={props.displayField} dataUser={dataUser}/>
            </div>

        </div>
    );
}
export default Main;