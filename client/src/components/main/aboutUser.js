const disciplineFetch = async (url, groups) => {
    const requestHeaders = {
        method: "GET",
    }

    const response = await fetch(url + '?' + new URLSearchParams(groups), requestHeaders)

    const jsonResponse = await response.json()

    return JSON.stringify(jsonResponse)
}

const getDisciplines = async (url, groups) => {
    const response = await disciplineFetch(url, groups)

    const parsedResponse = await  JSON.parse(response)

    return parsedResponse
}

export const disciplinesList = await getDisciplines(
    process.env.REACT_APP_HOSTNAME + '/student/disciplines',
    {
        groups: localStorage.getItem('User group')
    })
