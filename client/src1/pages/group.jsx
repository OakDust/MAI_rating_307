import React, {useEffect, useState} from 'react';
import Main from '../components/main/main';
import FieldGroup from '../components/UI/fieldGroup/fieldGroup';
import {getUserInfo} from "../http/getUserInfo";


const Group = () => {
    let [groupmates, setGroupmates] = useState([])
    let [headStudent, setHeadStudent] = useState()
    const url = process.env.REACT_APP_HOSTNAME + '/student/students_by_groups'

    useEffect(  () => {
        const backendService = async () => {
            const [groupmates, headStudent] = await getUserInfo(localStorage.getItem('User group'), url)

            setGroupmates(groupmates)
            setHeadStudent(headStudent)

            return [groupmates, headStudent]
        }

        backendService()
            .catch((err) => {
                return (
                    //500
                    <div>error</div>
                )
            })
            .then()
    }, [])

    if (localStorage['Authorization']) {
        const token = localStorage['Authorization']
        const [student, isAuth] = token.split(' ')

        return(
            <div>
                {
                    (isAuth && student == 'Student') ?
                        <Main title='Моя группа'  displayField={<FieldGroup groupmates={groupmates} headStudent={headStudent}/>}/>
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