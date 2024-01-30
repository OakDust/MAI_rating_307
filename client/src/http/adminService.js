import Requests from "./allRequest";

export default class AdminService { 
    static async getRatingForAllTeachers(dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/admin/`;

        const response = await Requests.get(dataUser, url);

        return response.json();
    }
}