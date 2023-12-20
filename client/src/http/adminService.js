export default class AdminService { 
    static async getRatingForAllTeachers(dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/admin/`;

        const response = await fetch(url, {headers: {'Authorization': dataUser.Authorization}});

        return response.json();
    }
}