import React, {useState, useContext, useEffect} from 'react';
import classes from './styles.module.scss';
import { useFetching } from '../../../hooks/useFetching';
import AdminService from '../../../http/adminService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';
import ReviewsList from '../reviewsList/reviewsList';
import Errors from '../../../pages/errors';

const FieldReviews = ({professorInfo}) => {
    const {dataUser} = useContext(AuthContext);
    const [reviewsTeacher, setReviewsTeacher] = useState([]);
    const [fetchReviews, reviewsLoading, error] = useFetching(async () => {
        const response = await AdminService.getReviewsForTeacherById(professorInfo.id, dataUser);
        console.log(response);

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

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    return( 
        <div className={classes.professor__info}>
            <div className={professorInfo.score > 3.5 ? classes.total__score : classes['total__score'] + ' ' + classes.warning}>
                <h4>Общий рейтинг:</h4>
                <span>{professorInfo.score}</span>
            </div> 

            <div className={classes.comment__block}>
                <h4>Комментарии:</h4>

                <ReviewsList reviewsTeacher={reviewsTeacher}/>
            </div>
        </div>
    );
}
export default FieldReviews;