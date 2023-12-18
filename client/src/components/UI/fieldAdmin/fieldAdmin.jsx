import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useFetching } from '../../../hooks/useFetching';
import AdminService from '../../../http/adminService';
import { AuthContext } from '../../../context';
import Loader from '../loader/loader';
import classes from './styles.module.scss';
import MyInput from '../myInput/myInput';
import MySelect from '../mySelect/mySelect';

const FieldAdmin = () => {
    const {dataUser} = useContext(AuthContext);
    const [ratingAllTeachers, setRatingAllTeachers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectQuery, setSelectQuery] = useState('');
    const [fetchRatingAllTeachers, ratingAllTeacherLoading] = useFetching(async () => {
        const response = await AdminService.getRatingForAllTeachers(dataUser);

        setRatingAllTeachers(response?.total_score || []);
    })

    useEffect(() => {
        fetchRatingAllTeachers();
    }, [])

    const sortedRatingTeachers = useMemo(() => {
        if (selectQuery) {
            return [...ratingAllTeachers].sort((a, b) => a[selectQuery].localeCompare(b[selectQuery]));
        }
        else {
            return ratingAllTeachers;
        }

    }, [selectQuery, ratingAllTeachers]);

    const sortedAndSearchedRatingTeachers = useMemo(() => {
        return sortedRatingTeachers.filter(teacher => teacher.name.toLowerCase().includes(searchQuery.toLowerCase()));
        
    }, [searchQuery, sortedRatingTeachers])

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
                            {name: 'По имени', value: 'name'},
                            {name: 'По возрастанию', value: 'score'}
                        ]}
                    />
                </div>
                {/* to do tables component */}
                <table className={classes.rating__table}>
                    <thead>
                        <tr>
                            <td>ФИО</td>
                            <td>Рейтинг</td>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndSearchedRatingTeachers.length > 0 
                        ? sortedAndSearchedRatingTeachers.map((teacher) => (
                            <tr key={teacher.name}>
                                <td>{teacher.name}</td>
                                <td>{teacher.score}</td>
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