import { formatBodyRegistration, getUrlByRole } from "../utils/auth";

export default class AuthService {
    static async authUser(role, authFields) {
        let url = getUrlByRole(role);

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
            body: JSON.stringify(authFields)
        }

        const response = await fetch(url, requestHeaders);

        return response.json();
    }

    static async getGroupsList() {
        const url = `${process.env.REACT_APP_HOSTNAME}/register`;
        const response = await fetch(url);

        return response.json()
    }

    static async registrateUser(role, registraionFields, studentGroup) {
        const url = `${process.env.REACT_APP_HOSTNAME}/register`;
        const body = formatBodyRegistration(registraionFields, role, studentGroup);
        
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
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);

        return response.json();
    }
}

