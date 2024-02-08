import React, {useState, useContext} from 'react';
import editIcon from '../../../assets/icons/edit.webp';
import classes from './styles.module.scss';
import doneIcon from '../../../assets/icons/done.webp';
import SearchInput from '../searchInput/searchInput';
import deleteIcon from '../../../assets/icons/delete.webp';
import ModalWindow from '../modalWindow/modalWindow';
import DeleteWindow from '../deleteWindow/deleteWindow';

const EditableDiscipline = ({discipline, teacher, teacherId, type, listItems, updateValue, deleteDiscipline}) => {
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [newValue, setNewValue] = useState({key: '', value: ''});

    const editHandler = () => {
        const value = newValue?.value || newValue;

        if (value.length > 0) {
            updateValue(value, discipline, type);
        }

        setEditMode(false);
    }

    const deleteHandler = () => {
        deleteDiscipline(discipline.discipline_id, teacherId);
        
        setDeleteMode(false);
    }

    if (editMode) {
        return (
            <tr className={classes.selected__field}>
                <td>{discipline.discipline}</td>
                <td>
                    <SearchInput
                        list={listItems}
                        setValue={setNewValue}
                        searchKey='key'
                        searchValue='value'
                        placeholder='ФИО преподавателя'
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

    if (deleteMode) {
        return (
            <ModalWindow visible={deleteMode} setVisible={setDeleteMode}>
                <DeleteWindow
                    discipline={discipline}
                    type={type}
                    deleteHandler={deleteHandler}
                    setDeleteMode={setDeleteMode}
                />
            </ModalWindow>
        )
    }

    return(

        <tr>
            <td>{discipline.discipline}</td>
            <td>{teacher}</td>
            <td>{type}</td>
            <td className={classes.table__options}>
                <img src={editIcon} alt='Редактировать' onClick={() => setEditMode(true)}/>
                <img src={deleteIcon} alt='Удалить' onClick={() => setDeleteMode(true)}/>
            </td>
        </tr>
    );

    
}
export default EditableDiscipline;