import React, {useState} from 'react';
import classes from './styles.module.scss';
import { Link } from 'react-router-dom';
import DropDownRating from '../dropDownRating/dropDownRating';

const FieldRating = () => {

    const [dropDownActive, setDropDownActive] = useState(false);

    return( 

        <div className={classes.rating__container}>
            <Link to='/rating/professors'>Общий рейтинг</Link>

            <div>
                <p>Рейтинг по группам</p>
                <span 
                className={dropDownActive ? classes['dropdown__button'] + ' ' + classes.active : classes.dropdown__button} 
                onClick={() => {setDropDownActive(!dropDownActive)}}
                >{`>`}</span>
            </div>
            <DropDownRating/>
        </div>
    );
}
export default FieldRating;