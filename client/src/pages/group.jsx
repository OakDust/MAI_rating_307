import React, {useEffect, useState} from 'react';
import Main from '../components/main/main';
import FieldGroup from '../components/UI/fieldGroup/fieldGroup';
import {getUserInfo} from "../http/getUserInfo";
import FieldSurveys from "../components/UI/fieldSurveys/fieldSurveys";

const Group = () => {
    let [groupmates, setGroupmates] = useState([])

    const url = process.env.REACT_APP_HOSTNAME + '/student/students_by_groups'

    useEffect(  () => {
        const backendService = async () => {
            const groupmates = await getUserInfo(localStorage.getItem('User Group'), url)

            setGroupmates(groupmates)

            return groupmates
        }

        backendService()
    }, [])

    if (localStorage['Authorization']) {
        const token = localStorage['Authorization']
        const [student, isAuth] = token.split(' ')

        return(
            <div>
                {
                    (isAuth && student == 'Student') ?
                        <Main title='Моя группа'  displayField={<FieldGroup groupmates={groupmates}/>}/>
                        :
                        <div>error</div>
                }
            </div>

        );
    } else {
        return(
            //401
            <div>error</div>
        )
    }
}
export default Group;