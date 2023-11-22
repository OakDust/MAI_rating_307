exports.authStudent = async (event, url, login, password) => {
    event.preventDefault()

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
    console.log(response)
    const studentData = await response.json()

    saveStudent(studentData)
}

const saveStudent = (data) => {
    const authStudent = {
        'Authorization': data.token,
        'role': data.user.role,
        'name': data.user.name,
        'group': data.user.groups,
        'id': data.user.id
    };

    localStorage.setItem('authUser', JSON.stringify(authStudent));
}

