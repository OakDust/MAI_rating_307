const fillArray = (array) => {
    let arr = []
    for (let i = 0; i < array.length; i ++) {
        arr.push(array[i].name)
    }
    return arr
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

    const userInfo = await fetch(url, requestHeaders)

    const userData = await userInfo.json()

    return JSON.stringify(userData)
}

exports.getUserInfo = async (userGroup, url) => {
    const groups = {groups: userGroup}
    const apiResponse = await this.userFetch(groups, url)

    const parsedResponse = JSON.parse(apiResponse)

    let arr = fillArray(parsedResponse)

    return arr
}