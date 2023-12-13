export const getUrlByRole = (role) => {
    let url = `${process.env.REACT_APP_HOSTNAME}/auth/`;

    if (role === 'Студент') {
        url += `studentAuth`;
    } 
    else {
        url += `professor`;
    }

    return url;
}

export const formatUserData = (data, role) => {
    const userData = data.user;

    let dataUser = {
        'Authorization': data.token,
        'id': userData.id,
        'role': userData.role,
        'name': userData.name,
    }

    if (role === 'Студент') {
        dataUser = {...dataUser, 'group': userData.groups, 'group_id': userData.group_id}
    }

    return dataUser;
}

export const formatBodyRegistration = (fields, role, studentGroup) => {
    const body = {
        'name': fields.name,
        'surname': fields.surname,
        'patronymic': fields.patronymic,
        'email': fields.email,
        'password': fields.password,
        'groups': studentGroup.value,
        'role': role,
    }

    return body;
}

export const formattingGroupsList = (groupsArray) => {
    let groupsList = []

    groupsArray.map((group) => (
        groupsList.push({
            key: group.group_id,
            value: group.group_name
    })))

    return groupsList;
}