export const authStudent = async (url, login, password) => {

    const userObject = {email: login, password: password};

    const requestHeaders = {
        method: "POST", 
        mode: "cors",
        cache: "no-cache", 
        credentials: "same-origin", 
        headers: {
        "Content-Type": "application/json",
        
        },
        redirect: "follow",
        referrerPolicy: "no-referrer", 
        body: JSON.stringify(userObject)
    }

    

    const response = await fetch(url, requestHeaders)
    const studentData = await response.json()

    return studentData;
}

export const saveStudent = (data) => {
    const authStudent = {
        'Authorization': data.token,
        'role': data.user.role,
        'name': data.user.name,
        'group': data.user.groups,
        'id': data.user.id
    };

    localStorage.setItem('authUser', JSON.stringify(authStudent));
}

