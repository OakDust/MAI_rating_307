import React, {useState} from 'react';
import editIcon from '../../../assets/icons/edit.webp';
import classes from './styles.module.scss';
import doneIcon from '../../../assets/icons/done.webp';
import SearchInput from '../searchInput/searchInput';

const EditableDiscipline = ({discipline, teacher, type, listItems, updateValue}) => {
    const [editMode, setEditMode] = useState(false);
    const [newValue, setNewValue] = useState({key: '', value: ''});

    const editHandler = () => {
        const value = newValue?.value || newValue;
        updateValue(value, discipline, type);
        setEditMode(false);
    }

    if (editMode) {
        return (
            <tr className={classes.selected__field}>
                <td>{discipline.discipline}</td>
                <td>
                    <SearchInput
                        list={listItems}
                        setValue={setNewValue}
                    />
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