import React from 'react';
import classes from './styles.module.scss';
import starsIcon from '../../../assets/icons/stars.webp';

const Footer = () => {
    return( 

        <div className={classes.footer__container}>
            <p>Данный опрос сделан в целях улучшения образования и преподавания</p>

            <section className={classes.copyright}> 
                <img src={starsIcon} alt='Разработано на кафедре 307'/>
                <h5>Разработано на кафедре 307</h5>
            </section>
        </div>
    );
}
export default Footer;