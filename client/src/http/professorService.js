import Requests from "./allRequest";

export default class ProfessorServise { 
    static async getRating (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/professor/myRating`;
        
        const response = await Requests.get(dataUser, url);

        return response.json();
    }
}