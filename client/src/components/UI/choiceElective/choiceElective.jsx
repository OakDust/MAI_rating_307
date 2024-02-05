import React, { useState, useContext, useEffect } from 'react';
import { electives } from './electives';
import { AuthContext } from '../../../context';
import { setDisciplineFormat } from '../../../utils/student';
import { useFetching } from '../../../hooks/useFetching';
import LinkButton from '../linkButton/linkButton';
import StudentService from '../../../http/studentService';
import SearchInput from '../searchInput/searchInput';
import classes from './styles.module.scss';
import Errors from '../../../pages/errors';


const ChoiceElective = ({typeElective}) => {
    const electiveInfo = electives[typeElective];
    const [electiveData, setElectiveData] = useState([]);
    const [selectedData, setSelectedData] = useState();
    const {dataUser} = useContext(AuthContext);

    const [fetchElectiveData, fetchElectiveDataLoading, error] = useFetching(async () => {
        const route = electiveInfo?.route;
        const response = await StudentService.getElectiveData(dataUser, route);

        setElectiveData(response);
    })

    useEffect(() => {
        fetchElectiveData();
    }, [])

    if (fetchElectiveDataLoading) {
        return (
            <div>Загрузка...</div>
        )
    }

    if (error) {
        return (
            <Errors message={error}/>
        )
    }

    return (
        <div className={classes.choice__content}>
            <p>{electiveInfo?.title}</p>

            <SearchInput 
                list={electiveData}
                searchKey={electiveInfo.key}
                searchValue={electiveInfo.value}
                setValue={setSelectedData}
                onlyChoice={true}
                placeholder='Поиск...'
            />

            <div>
                {selectedData ? 
                <LinkButton 
                    to={'/surveys/quiz'}
                    state={setDisciplineFormat(electiveInfo, selectedData)}>
                    Продолжить
                </LinkButton> : 
                <p className={classes.warning__text}>{electiveInfo.message}</p>}
            </div>
        </div>
    )
}
export default ChoiceElective;