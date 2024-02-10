import React, {useState} from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import userIcon from '../../../assets/icons/user.webp';
import { setFullFormatGroup } from '../../../utils/student';
import ModalWindow from '../modalWindow/modalWindow';
import ChangePassword from '../changePassword/changePassword';

const Header = ({dataUser, setIsAuth}) => {
    const [name, surname] = dataUser.name.split(' ');
    const [changePasswordMode, setChangePasswordMode] = useState(false);

    const logout = () => {
        setIsAuth(false);
        localStorage.clear();
    }

    return(
        <header className={classes.main__header}>
            <div className={classes.user__block}>
                <img src={userIcon} alt={surname}/>

                <div className={classes.user__info}>
                    <h3>{name}</h3>
                    <h3>{surname}</h3>
                    <div className={classes.change__password} onClick={() => setChangePasswordMode(true)}>Сменить пароль</div>
                    <p>{dataUser?.group ? setFullFormatGroup(dataUser.group) : null}</p>
                </div>
            </div>

            <h1>ОПРОСЫ 307</h1>

            <LinkButton to="/auth" onClick={logout}>
                Выйти
            </LinkButton>

            {changePasswordMode && 
            <ModalWindow visible={changePasswordMode} setVisible={setChangePasswordMode}>
                <ChangePassword/>
            </ModalWindow>}
        </header>
    );
}
export default Header;