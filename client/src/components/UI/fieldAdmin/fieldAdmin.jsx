import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import AdminService from '../../../http/adminService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';
import classes from './styles.module.scss';
import MyInput from '../myInput/myInput';
import MySelect from '../mySelect/mySelect';
import Errors from '../../../pages/errors';
import LinkButton from '../linkButton/linkButton';

const FieldAdmin = () => {
    const {dataUser} = useContext(AuthContext);
    const [ratingAllTeachers, setRatingAllTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectQuery, setSelectQuery] = useState('');
    const [fetchRatingAllTeachers, ratingAllTeacherLoading, error] = useFetching(async () => {
        const response = await AdminService.getRatingForAllTeachers(dataUser);

        setRatingAllTeachers(response?.total_score || []);
    })

    useEffect(() => {
        fetchRatingAllTeachers();
    }, [])

    const sortedByParameter = (parameter, a, b) => {
        if (parameter === 'up') {
            return a.localeCompare(b);
        }
        else {
            return b.localeCompare(a);
        }
    }

    const sortedRatingTeachers = useMemo(() => {
        if (selectQuery) {
            const [field, parameter] = selectQuery.split(' ');

            return [...ratingAllTeachers].sort((a, b) => sortedByParameter(parameter, a[field], b[field]));
        }
        else {
            return ratingAllTeachers;
        }

    }, [selectQuery, ratingAllTeachers]);

    const sortedAndSearchedRatingTeachers = useMemo(() => {
        return sortedRatingTeachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
    }, [searchQuery, sortedRatingTeachers])

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    if (ratingAllTeacherLoading) {
        return (
            <Loader/>
        )
    }

    if (ratingAllTeachers.length > 0) {
        return (
            <div className={classes.overall__rating}>
                <div className={classes.formatting__table}>
                    <MyInput 
                        placeholder='Поиск преподавателя....'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <MySelect
                        value={selectQuery}
                        onChange={(sort) => setSelectQuery(sort)}
                        defaultValue='Сортировка'
                        options={[
                            {name: 'По алфавиту от А до Я', value: 'name up'},
                            {name: 'По алфавиту от Я до А', value: 'name down'},
                            {name: 'По возрастанию', value: 'score up'},
                            {name: 'По убыванию', value: 'score down'}
                        ]}
                    />
                </div>
                {/* to do tables component */}
                <table className={classes.rating__table}>
                    <thead>
                        <tr>
                            <td>ФИО</td>
                            <td>Рейтинг</td>
                            <td>Комментарии</td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndSearchedRatingTeachers.length > 0 
                        ? sortedAndSearchedRatingTeachers.map((teacher) => (
                            <tr key={teacher.name}>
                                <td>{teacher.name}</td>
                                <td>{teacher.score}</td>
                                <td>
                                    <LinkButton to={'/admin/reviews'} state={teacher}>
                                        Подробнее
                                    </LinkButton>
                                </td>
                            </tr>
                        )) 
                        : <tr>
                            <td>Ничего не найдено</td>
                        </tr>}
                    </tbody>
                </table>
            </div>
        )
    } else {
        return (
            <div>Недостаточно прав для просмотра данной страницы</div>
        )
    }
}
export default FieldAdmin;