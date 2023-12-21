import React, { useContext, useEffect, useState } from 'react';
import classes from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import ProfessorServise from '../../../http/professorService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';
import { checkNumberOfRating } from '../../../utils/professor';
import Errors from '../../../pages/errors';

const FieldRating = () => {
    const [totalScore, setTotalScore] = useState(0);
    const [ratingByDisciplines, setRatingByDisciplines] = useState([])
    const {dataUser} = useContext(AuthContext);
    const [fetchRating, isLoadingRating, error] = useFetching(async () => {
        const response = await ProfessorServise.getRating(dataUser);

        if (response?.totalScore && response?.teacherRatingByDiscipline) {
            setTotalScore(response.totalScore);
            setRatingByDisciplines(response.teacherRatingByDiscipline);
        }
    })

    useEffect(() => {
        fetchRating();
    }, [])

    if (isLoadingRating) {
        return (
            <Loader/>
        )
    }

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    return( 

        <div className={classes.rating__container}>
            <div className={classes.total__score}>
                <h5>Общий рейтинг:</h5>
                <h5>{totalScore}</h5>
            </div>

            <div className={classes.rating__table}>
                <h5>Дисциплины</h5>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>Форма</td>
                                <td>Название дисциплины</td>
                                <td>Оценка</td>
                            </tr>
                        </thead>
                        <tbody>
                            {ratingByDisciplines.length > 0
                            ? ratingByDisciplines.map((discipline, index) => (
                                <>
                                <tr>
                                    <td>ЛК</td>
                                    <td>{discipline.discipline_name}</td>
                                    <td>{checkNumberOfRating(discipline.lecturer_score)}</td>
                                </tr>
                                <tr>
                                    <td>ПЗ</td>
                                    <td>{discipline.discipline_name}</td>
                                    <td>{checkNumberOfRating(discipline.seminarian_score)}</td>
                                </tr>
                                </>
                            ))
                            : <tr><td>Нет данных</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
export default FieldRating;