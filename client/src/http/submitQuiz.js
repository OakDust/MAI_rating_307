export const postQuiz = async (answers) => {
    const requestHeaders = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem('authUser'))['Authorization'],
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",

        body: JSON.stringify(answers)
    }

    const url = `${process.env.REACT_APP_HOSTNAME}/student/quiz`

    const postData = await fetch(url, requestHeaders)

    const response = await postData.json()
    return response
}