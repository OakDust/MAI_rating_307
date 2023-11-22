import React from 'react';
import classes from './styles.module.scss';
import loaderIcon from '../../../assets/icons/loader.webp';

const Loader = () => {
    return( 

        <div className={classes.loader__container}>
            <img src={loaderIcon} alt='Загрузка'/>
            
            <h3>Загружаем ваши данные</h3>
        </div>
    );
}
export default Loader;