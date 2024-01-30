import { formatBodyRegistration, getAuthUrlByRole, getRegistrateUrlByRole } from "../utils/auth";
import Requests from "./allRequest";

export default class AuthService {
    static async authUser(role, authFields) {
        let url = getAuthUrlByRole(role);

        const response = await Requests.post(authFields, url);

        return response.json();
    }

    static async getGroupsList() {
        const url = `${process.env.REACT_APP_HOSTNAME}/register`;

        const response = await fetch(url);

        return response.json()
    }

    static async registrateUser(role, registraionFields, studentGroup) {
        const url = getRegistrateUrlByRole(role);
        const body = formatBodyRegistration(registraionFields, role, studentGroup);

        const response = await Requests.post(body, url)
        
        return response.json();
    }
}

