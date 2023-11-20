exports.disciplineFetch = async (url, groups) => {
    const requestHeaders = {
        method: "POST",
    }
    const Authorization = JSON.parse(localStorage.getItem('authUser'))['Authorization']

    const response = await fetch(url + '?' + new URLSearchParams(groups) + '&Authorization=' + Authorization, requestHeaders)

    const jsonResponse = await response.json()

    return JSON.stringify(jsonResponse)
}

exports.getDisciplines = async (url, groups) => {
    const response = await this.disciplineFetch(url, groups)

    const parsedResponse = await JSON.parse(response)

    localStorage.setItem('disciplines', response)

    return parsedResponse
}
