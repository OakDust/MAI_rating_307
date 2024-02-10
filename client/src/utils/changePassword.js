export const getRouteByRole = (role) => {
    let route = '/'

    if (role === 'Староста' || role === 'Студент') {
        route += 'student';
    }
    else if (role === 'Преподаватель') {
        route += 'professor';
    }
    else if (role === 'Администратор') {
        route += 'admin';
    }

    return route += '/changePassword';
}