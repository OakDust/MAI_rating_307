export default class ProfessorServise { 
    static async getRating (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/professor/myRating`;
        console.log(dataUser.Authorization)
        const response = await fetch(url, {headers: {'Authorization': dataUser.Authorization}});

        return response.json();
    }
}