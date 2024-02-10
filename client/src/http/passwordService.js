import Requests from "./allRequest";

export default class PasswordService { 
    static async changePassword (route, dataUser, fields) {
        const url = process.env.REACT_APP_HOSTNAME + route;

        const body = {
            old_password: fields.oldPassword,
            new_password: fields.password,
        }

        const response = await Requests.post(body, url, dataUser)

        return response.json();
    }

    static async recoverMail (role, fields) {
        const url = `${process.env.REACT_APP_HOSTNAME}/recoveryMail`;
        const body = {
            ...fields,
            role: role,
        }

        const response = await Requests.post(body, url);

        return response.json();
    }

    static async getFieldsForChange (route) {
        const url = `${process.env.REACT_APP_HOSTNAME}/recoverPassword/${route}`;

        const response = await fetch(url);

        return response.json();
    }

    static async recoverPassword (fields, email, role) {
        const url = `${process.env.REACT_APP_HOSTNAME}/recoverPassword`;
        const body = {
            role: role,
            email: email,
            new_password: fields.password,
        }

        const response = await Requests.post(body, url);

        return response.json();
    }
}