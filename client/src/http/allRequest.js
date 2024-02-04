export default class Requests {
    static async post (body, url, dataUser) {
        let headers = {
            "Content-Type": "application/json",
        }

        if (dataUser) {
            headers = {
                ...headers, 
                "Authorization": dataUser.Authorization,
            }
        }

        const requestHeaders = {
            method: "POST", 
            mode: "cors",
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                ...headers,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);

        return response;
    }

    static async get (dataUser, url) {
        const requestHeaders = {
            headers: {
                'Authorization': dataUser.Authorization,
            }
        }

        const response = await fetch(url, requestHeaders);

        return response;
    }

    static async put (dataUser, body, url) {
        const requestHeaders = {
            method: "PUT", 
            mode: "cors",
            cache: "no-cache", 
            credentials: "same-origin", 
            headers: {
                "Authorization": dataUser.Authorization,
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);

        return response;
    }
}