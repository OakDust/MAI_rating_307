exports.disciplineFetch = async (url, groups) => {
    const requestHeaders = {
        method: "POST",
    }

    const response = await fetch(url + '?' + new URLSearchParams(groups), requestHeaders)

    const jsonResponse = await response.json()

    return JSON.stringify(jsonResponse)
}

exports.getDisciplines = async (url, groups) => {
    const response = await this.disciplineFetch(url, groups)

    const parsedResponse = await  JSON.parse(response)

    localStorage.setItem('disciplines', response)

    return parsedResponse
}
