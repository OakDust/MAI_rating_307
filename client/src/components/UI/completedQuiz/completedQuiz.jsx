import React from 'react';
import { Link } from 'react-router-dom';
import classes from './styles.module.scss';
import completeIcon from '../../../assets/icons/completedQuiz.webp';
import nextQuizIcon from '../../../assets/icons/nextQuiz.webp';

const CompletedQuiz = () => {
    return( 

        <div className={classes.quiz__completed}>
            <img src={completeIcon} alt='Опрос завершен'/>
            <h3>Спасибо, что прошел опрос!</h3>

            <div className={classes.next__quiz}>
                <Link to='/surveys'>Пройти следующий опрос</Link>
                <img src={nextQuizIcon} alt='Следующий опрос'/>
            </div>
        </div>
    );
}
export default CompletedQuiz;