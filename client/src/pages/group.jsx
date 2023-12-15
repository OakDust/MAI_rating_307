import React, {useContext, useEffect, useState} from 'react';
import Main from '../components/main/main';
import FieldGroup from '../components/UI/fieldGroup/fieldGroup';
import { AuthContext } from '../context';
import { useFetching } from '../hooks/useFetching';
import { formattingGroupList } from '../utils/student';
import StudentService from '../http/studentService';

const Group = (props) => {
    const [groupList, setGroupList] = useState({students: [], headStudent: ''});
    const {dataUser} = useContext(AuthContext);
    const [fetchGroupList, groupListLoading] = useFetching( async () => {
        const response = await StudentService.getGroupList(dataUser);
        const formattedGroupList = formattingGroupList(response.students, response.surveys_passed);

        setGroupList({students: formattedGroupList.students, headStudent: formattedGroupList.headStudent});
    })

    const title = props.title + dataUser.group;
    document.title = title;

    useEffect(() => {
        fetchGroupList();
    }, [])

    return(
        <Main 
        title='Моя группа'  
        displayField={<FieldGroup groupList={groupList} dataUser={dataUser} loading={groupListLoading}/>}/>

    );
}
export default Group;