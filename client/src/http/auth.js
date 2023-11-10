
// POST /auth in authForm
exports.studentFetch = async (event, userObject, url) => {
    event.preventDefault()

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
    
    const data = await response.json()

    return JSON.stringify(data)
}

exports.formSubmit = async (event, url, login, password) => {
    let userObject = {email: login, password: password}

    // waiting till api return the response
    const apiResponse = await this.studentFetch(event, userObject, url)

    const parsedResponse = JSON.parse(apiResponse)

    const message = parsedResponse.message
    const token = parsedResponse.token
    const user = parsedResponse.user

    localStorage.setItem("Authorization", token)

    localStorage.setItem("User role", user.role)
    localStorage.setItem("User name", user.name)
    localStorage.setItem("User group", user.groups)

    // setting it to a state
    // setResponse(message)
    return [message, token]
}
