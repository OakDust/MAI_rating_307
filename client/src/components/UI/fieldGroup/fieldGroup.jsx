import React, {useEffect, useState} from 'react';
import classes from './styles.module.scss';
import background from '../../../assets/backgrounds/groupBackground.webp';


const FieldGroup = ({groupmates}) => {

    return( 

        <div className={classes.group__container}>
            <ul>
                {groupmates.map((student) => (
                    <li>
                        {student}
                    </li>
                ))}
                <li>Староста Круглянкин Владислав Сергеевич</li>
            </ul>

            <img className={classes.group__background} src={background} alt='group'/>
        </div>
    );
}
export default FieldGroup;