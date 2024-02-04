import { getDisciplineInfoByType, setFullFormatGroup } from "../utils/student";
import Requests from "./allRequest";

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

        const response = await Requests.post(body, url, dataUser);

        return response.json();
    }

    static async submitQuiz (dataUser, body) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/quiz`
    
        const response = await Requests.post(body, url, dataUser);

        return response;
    }

    static async getTeachers (dataUser) { 
        const url = `${process.env.REACT_APP_HOSTNAME}/student/getTeachers`;

        const response = await Requests.get(dataUser, url);

        return response.json()
    }

    static async updateTeacher (teacher, discipline, dataUser, type) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/updateTeacher`;
        const [surname, name, patronymic] = teacher.split(' ');

        const fullFormatGroup = setFullFormatGroup(dataUser.group);
        const infoByType = getDisciplineInfoByType(discipline, type);

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
    
        const response = await Requests.put(dataUser, body, url);

        return response.json();
    }

    static async addDiscipline (teacherName, disciplineName, typeDiscipline, dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/createDiscipline`;

        const newDisciplineName = disciplineName?.value || disciplineName;
        const fullTeacherName = teacherName?.value || teacherName;
        const [surname, name, patronymic] = fullTeacherName.split(' ');
        const groupName = setFullFormatGroup(dataUser.group);

        const body = {
            discipline_name: newDisciplineName,
            teacher_surname: surname,
            teacher_name: name,
            teacher_patronymic: patronymic,
            group_id: dataUser.group_id,
            group_name: groupName,
            semester: 0,
            lectures: (typeDiscipline === 'ЛК' ? 1 : 0),
            practical: (typeDiscipline === 'ПЗ' ? 1 : 0),
            laboratory: 0,
        }

        const response = await Requests.put(dataUser, body, url);

        return response.json();
    }

    static async deleteDiscipline (disciplineId, teacherId, dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/deleteDiscipline`;

        const body = {
            teacher_id: teacherId,
            discipline_id: disciplineId,
            group_id: dataUser.group_id,
            student_id: dataUser.id,
        }

        const response = await Requests.put(dataUser, body, url);

        return response.json();
    }

    static async getAllDisciplines (dataUser) {
        const url = `${process.env.REACT_APP_HOSTNAME}/student/getDisciplines`;
    
        const response = await Requests.get(dataUser, url);
    
        return response.json();
    }
}