import React, {useEffect, useState} from 'react';
import editIcon from '../../../assets/icons/edit.webp';
import classes from './styles.module.scss';
import SearchInput from '../searchInput/searchInput';
import doneIcon from '../../../assets/icons/done.webp';

const EditableItem = ({children, listItems, updateValue, discipline, type}) => {
    const [editMode, setEditMode] = useState(false);
    const [newValue, setNewValue] = useState();

    const editHandler = () => {
        updateValue(newValue, discipline, type);
        setEditMode(false);
    }

    if (editMode) {
        return (
            <div className={classes.editable__item}>
                <SearchInput list={listItems} setValue={setNewValue}/>
                <div className={classes.done} onClick={() => editHandler()}>
                    <img src={doneIcon} alt='Завершить редактирование'/>
                </div>
            </div>
        )
    }

    return( 

        <div className={classes.editable__item}>
            <p>{children}</p>
            <img src={editIcon} alt='Редактировать' onClick={() => setEditMode(true)}/>
        </div>
    );

    
}
export default EditableItem;