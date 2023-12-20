export default class ProfessorServise { 
    static async getRating (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/professor/myRating`;
        
        const response = await fetch(url, {headers: {'Authorization': dataUser.Authorization}});

        return response.json();
    }
}