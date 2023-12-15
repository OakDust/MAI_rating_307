import React, { useContext } from 'react';
import classes from './styles.module.scss';
import FieldMain from '../UI/fieldMain/fieldMain.jsx';
import { AuthContext } from '../../context/index.js';
import Header from '../UI/header/header.jsx';

const Main = (props) => {
    const {setIsAuth, dataUser} = useContext(AuthContext);

    return( 

        <div className={classes.container}>
            <Header dataUser={dataUser} setIsAuth={setIsAuth}/>
            
            <FieldMain 
                className={classes.main__body}
                title={props.title} 
                displayField={props.displayField} 
                dataUser={dataUser}
            />
        </div>
    );
}
export default Main;