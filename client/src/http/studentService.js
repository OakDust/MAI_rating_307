import { getInfoByType, setFullFormatGroup } from "../utils/student";

export default class StudentService {
    static async getDisciplines (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/disciplines?${new URLSearchParams({groups: dataUser.group})}`;

        const requestHeaders = {
            method: "POST",
            headers: {
                "Authorization": dataUser.Authorization
            }
        }
    
        const response = await fetch(url, requestHeaders);
    
        return response.json();
    }

    static async getGroupList (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/students_by_groups`;
        const body = {
            id: dataUser.id,
            groups: dataUser.group,
        }

        const requestHeaders = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": dataUser.Authorization,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
    
            body: JSON.stringify(body)
        }

        const response = await fetch(url, requestHeaders);

        return response.json();
    }

    static async submitQuiz (dataUser, body) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/quiz`

        const requestHeaders = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Authorization": dataUser.Authorization,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(body)
        }
    
        const response = await fetch(url, requestHeaders)

        return response.json();
    }

    static async getTeachers (dataUser) { 
        const url = `${process.env.REACT_APP_HOSTNAME}/student/getTeachers`;
        const response = await fetch(url, {headers: {"Authorization": dataUser.Authorization}});

        return response.json()
    }

    static async updateTeacher (teacher, discipline, dataUser, type) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/updateTeacher`;
        const [surname, name, patronymic] = teacher.split(' ');
        const fullFormatGroup = setFullFormatGroup(dataUser.group);

        const infoByType = getInfoByType(discipline, type);

        const body = {
            group_id: dataUser.group_id,
            group_name: fullFormatGroup,
            lectures: infoByType.lectures,
            practical: infoByType.practical,
            semester: 0,
            teacher_name: name,
            teacher_surname: surname,
            teacher_patronymic: patronymic,
            teacher_id: infoByType.teacherId,
            discipline_name: discipline.discipline,
            discipline_id: discipline.discipline_id,
        }

        console.log(body);

        const requestHeaders = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": dataUser.Authorization,
            },
            body: JSON.stringify(body)
        }
    
        const response = await fetch(url, requestHeaders);

        console.log(response);

        return response.json();
    }
}