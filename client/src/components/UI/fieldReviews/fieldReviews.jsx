import React, {useState, useContext, useEffect} from 'react';
import classes from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import AdminService from '../../../http/adminService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';

const FieldReviews = ({professorInfo}) => {
    const {dataUser} = useContext(AuthContext);
    const [reviewsTeacher, setReviewsTeacher] = useState();
    const [fetchReviews, reviewsLoading, error] = useFetching(async () => {
        const response = await AdminService.getReviewsForTeacherById(professorInfo.id, dataUser);
        
        setReviewsTeacher(response);
    })

    useEffect(() => {
        fetchReviews();
    }, [])

    if (reviewsLoading) {
        return (
            <Loader/>
        )
    }

    return( 
        <div className={classes.professor__info}>
            <div className={classes.total__score}>
                <h4>Общий рейтинг</h4>
                <p>{professorInfo.score}</p>
            </div> 

            <ul className={classes.reviews__list}>
                <h4>Комментарии</h4>
            </ul>
        </div>
    );
}
export default FieldReviews;