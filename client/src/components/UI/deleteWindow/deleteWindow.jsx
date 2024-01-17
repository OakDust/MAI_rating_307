import React from 'react';
import classes from './styles.module.scss';
import MyButton from '../myButton/myButton';

const DeleteWindow = ({discipline, type, deleteHandler, setDeleteMode}) => {
    return( 

        <div className={classes.message__block}>
            <p>Вы уверены, что хотите удалить <span>{type}</span> по дисциплине: 
            <div><span>"{discipline.discipline}"</span> ?</div></p>

            <div className={classes.buttons__block}>
                <MyButton onClick={() => deleteHandler()}>Да</MyButton>
                <MyButton onClick={() => setDeleteMode(false)}>Отмена</MyButton>
            </div> 
        </div>
    );
}
export default DeleteWindow;