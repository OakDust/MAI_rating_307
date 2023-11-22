import React, {useEffect, useState} from 'react';
import Main from '../components/main/main';
import FieldGroup from '../components/UI/fieldGroup/fieldGroup';
import {getStudentGroup} from "../http/getStudentGroup";

const Group = () => {
    const [studentGroup, setStudentGroup] = useState({students: [], headStudent: ''});
    const user = JSON.parse(localStorage.getItem('authUser'));

    useEffect(() => {
        const fetchStudentGroup = async () => {
            const url = `${process.env.REACT_APP_HOSTNAME}/student/students_by_groups`;
            const userId = user.id;
            const userGroup = user.group
            const response = await getStudentGroup(userId, userGroup, url);

            setStudentGroup(response);
        }

        fetchStudentGroup()
    }, [])

    const students = studentGroup?.students ?? [];
    const headStudent = studentGroup?.headStudent ?? '';

    return(
        <Main 
        title='Моя группа'  
        displayField={<FieldGroup students={students} headStudent={headStudent} userRole={user.role}/>}/>

    );
}
export default Group;