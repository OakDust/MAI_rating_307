import React from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';
import { setFullFormatGroup } from '../../../utils/student';

const Header = ({dataUser, setIsAuth}) => {
    const [name, surname] = dataUser.name.split(' ');

    const logout = () => {
        setIsAuth(false);
        localStorage.clear();
    }

    return(
        <header className={classes.main__header}>
            <div className={classes.user__info}>
                <h3>{name}</h3>
                <h3>{surname}</h3>
                <p>{dataUser?.group ? setFullFormatGroup(dataUser.group) : null}</p>
            </div>

            <h1>ОПРОСЫ 307</h1>

            <LinkButton to="/auth" onClick={logout}>
                Выйти
            </LinkButton>
        </header>
    );
}
export default Header;