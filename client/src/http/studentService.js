export default class StudentService {
    static async getDisciplines (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/disciplines?${new URLSearchParams({groups: dataUser.group})}`;

        const requestHeaders = {
            method: "POST",
            headers: {
                "Authorization": dataUser.Authorization
            }
        }
    
        const response = await fetch(url, requestHeaders);
    
        return response.json();
    }

    static async getGroupList (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/students_by_groups`;
        const body = {
            id: dataUser.id,
            groups: dataUser.group,
        }

        const requestHeaders = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": dataUser.Authorization,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
    
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);

        return response.json();
    }

    static async submitQuiz (dataUser, body) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/quiz`

        const requestHeaders = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": dataUser.Authorization,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(body)
        }
    
        const response = await fetch(url, requestHeaders)

        return response.json();
    }
}