import React, {useState} from 'react';
import editIcon from '../../../assets/icons/edit.webp';
import classes from './styles.module.scss';
import doneIcon from '../../../assets/icons/done.webp';

const EditableDiscipline = ({discipline, teacher, type, listItems, updateValue}) => {
    const [editMode, setEditMode] = useState(false);
    const [newValue, setNewValue] = useState('');

    const editHandler = () => {
        updateValue(newValue, discipline, type);
        setEditMode(false);
    }

    if (editMode) {
        return (
            <tr className={classes.selected__field}>
                <td>{discipline.discipline}</td>
                <td>
                    <select value={teacher.value} onChange={(event) => setNewValue((event.target.value))}>
                        <option>{teacher}</option>
                        {listItems.map(item => (
                            <option value={item.value}>{item.value}</option>
                        ))}
                    </select>
                </td>
                <td>{type}</td>
                <td>
                    <div className={classes.done__icon} onClick={() => editHandler()}>
                        <img src={doneIcon} alt='Отредактировать'/>
                    </div>
                </td>
            </tr>
        )
    }

    return( 

        <tr>
            <td>{discipline.discipline}</td>
            <td>{teacher}</td>
            <td>{type}</td>
            <td><img src={editIcon} alt='Редактировать' onClick={() => setEditMode(true)}/></td>
        </tr>
    );

    
}
export default EditableDiscipline;