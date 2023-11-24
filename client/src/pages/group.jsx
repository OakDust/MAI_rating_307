import React, {useEffect, useState} from 'react';
import Main from '../components/main/main';
import FieldGroup from '../components/UI/fieldGroup/fieldGroup';
import {getStudentGroup} from "../http/getStudentGroup";

const Group = () => {
    const [infoGroup, setInfoGroup] = useState({students: [], headStudent: ''});
    const user = JSON.parse(localStorage.getItem('authUser'));
    const userId = user.id;
    const userGroup = user.group;

    useEffect(() => {
        const fetchStudentGroup = async () => {
            const url = `${process.env.REACT_APP_HOSTNAME}/student/students_by_groups`;
            const response = await getStudentGroup(userId, userGroup, url);

            setInfoGroup(response);
        }

        fetchStudentGroup()
    }, [userId, userGroup])

    const students = infoGroup?.students ?? [];
    const headStudent = infoGroup?.headStudent ?? '';

    return(
        <Main 
        title='Моя группа'  
        displayField={<FieldGroup students={students} headStudent={headStudent} userRole={user.role}/>}/>

    );
}
export default Group;