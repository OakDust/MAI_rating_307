import React from 'react';
import classes from './styles.module.scss';

const ModalWindow = ({children, visible, setVisible}) => {

    return( 

        <div 
            className={visible ? classes['modal__window'] + ' ' + classes.active : classes['modal__window']}
            onClick={() => setVisible(false)}
        >
            <div className={classes.modal__content} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}
export default ModalWindow;