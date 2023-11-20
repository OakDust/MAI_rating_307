function fillArray(array) {
    let arr = []
    let headStudent
    for (let i = 0; i < array.length; i ++) {
        if (array[i].is_head_student == 1) { headStudent = array[i].name }

        const formattedName = formatName(array[i].name)
        arr.push(formattedName)
    }
    return [arr, headStudent]
}

function formatName(fullName) {
    const names = fullName.split(' ');
    const formattedNames = names.map(name => name.charAt(0) + name.slice(1).toLowerCase());
    return formattedNames.join(' ');
}

exports.userFetch = async (groups, url) => {
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

        body: JSON.stringify(groups)
    }
    const Authorization = JSON.parse(localStorage.getItem('authUser'))['Authorization']

    const userInfo = await fetch(url + '?' + new URLSearchParams(groups) + '&Authorization=' + Authorization, requestHeaders)

    const userData = await userInfo.json()

    return JSON.stringify(userData)
}

exports.getUserInfo = async (userGroup, url) => {
    const groups = {groups: userGroup}
    const apiResponse = await this.userFetch(groups, url)

    const parsedResponse = JSON.parse(apiResponse)

    let [arr, headStudent] = fillArray(parsedResponse)

    return [arr, headStudent]
}