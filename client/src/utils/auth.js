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
    const userData = (role === 'Студент' ? data.user : data);

    let dataUser = {
        'Authorization': data.token,
        'id': userData.id,
        'role': userData.role,
        'name': userData.name,
    }

    if (role === 'Студент') {
        dataUser = {...dataUser, 'group': userData.groups,}
    }

    return dataUser;
}

export const formatBodyRegistration = (fields, role) => {
    const body = {
        'name': fields.name,
        'surname': fields.surname,
        'patronymic': fields.patronymic,
        'email': fields.email,
        'password': fields.password,
        'groups': fields.groups,
        'role': role,
    }

    return body;
}