import React from 'react';
import classes from './styles.module.scss';

const MySelect = ({options, defaultValue, value, onChange}) => {

    return( 
        <select 
            className={classes.my__select}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option disabled value=''>{defaultValue}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.name}
                </option>
            ))}
        </select>
    );
}
export default MySelect;