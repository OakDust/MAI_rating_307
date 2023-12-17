import React, { useContext, useEffect, useState } from 'react';
import classes from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import ProfessorServise from '../../../http/professorService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';
import { checkNumberOfRating } from '../../../utils/professor';

const FieldRating = () => {
    const [totalScore, setTotalScore] = useState(0);
    const [ratingByDisciplines, setRatingByDisciplines] = useState([])
    const {dataUser} = useContext(AuthContext);
    const [fetchRating, isLoadingRating] = useFetching(async () => {
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

    const showRatingByDisciplines = () => {
        if (ratingByDisciplines.length > 0) {
            return (
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
                            {ratingByDisciplines.map((discipline) => (
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
                            ))}
                        </tbody>
                    </table>
                </div>
            )
        }
        else {
            return (
                <div className={classes.waste__list}>Нет данных...</div>
            )
        }
    }

    return( 

        <div className={classes.rating__container}>
            <div className={classes.total__score}>
                <h5>Общий рейтинг:</h5>
                <h5>{totalScore}</h5>
            </div>

            <div className={classes.rating__table}>
                <h5>Дисциплины</h5>
                {showRatingByDisciplines()}
            </div>
        </div>
    );
}
export default FieldRating;