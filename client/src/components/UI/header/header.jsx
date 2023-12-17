import React from 'react';
import classes from './styles.module.scss';
import LinkButton from '../linkButton/linkButton';

const Header = ({dataUser, setIsAuth}) => {
    const [name, surname] = dataUser.name.split(' ');

    const logout = () => {
        setIsAuth(false);
        localStorage.clear();
    }

    return(
        <div className={classes.main__header}>
            <div className={classes.user__info}>
                <h3>{name}</h3>
                <h3>{surname}</h3>
                <p>{dataUser.group}</p>
            </div>

            <h1>ОПРОС 307</h1>

            <LinkButton to="/auth" onClick={logout}>
                Выйти
            </LinkButton>
        </div>
    );
}
export default Header;