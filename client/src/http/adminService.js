import Requests from "./allRequest";

export default class AdminService { 
    static async getRatingForAllTeachers(dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/admin/`;

        const response = await Requests.get(dataUser, url);

        return response.json();
    }

    static async getReviewsForTeacherById (id, dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/admin/getCommentsByProfessorsId`;
        const body = {
            professors_id: id,
        }

        const response = await Requests.post(body, url, dataUser);

        return response.json();
    }
}