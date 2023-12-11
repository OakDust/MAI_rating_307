import React, { useContext, useEffect, useState } from 'react';
import classes from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import ProfessorServise from '../../../http/professorService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';

const FieldRating = () => {
    const [professorRating, setProfessorRating] = useState({});
    const {dataUser} = useContext(AuthContext);
    const [fetchRating, isLoadingRating] = useFetching(async () => {
        const response = await ProfessorServise.getRating(dataUser);

        setProfessorRating(response);
    })

    useEffect(() => {
        fetchRating();
    }, [])

    if (isLoadingRating) {
        return (
            <Loader/>
        )
    }

    return( 

        <div className={classes.rating__container}>
            <h5>Общий рейтинг:</h5>
            <h5>{professorRating.totalScore}</h5>
        </div>
    );
}
export default FieldRating;