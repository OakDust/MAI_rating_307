export const checkEmptyTeacher = (teacher) => {
    if (!teacher) {
        return 'Не распределено'
    }

    return teacher
}

export const formatBodyAnswers = (answers, dataUser, disciplineInfo) => {
    const body = [{
        "student_id": dataUser.id,
        "groups": dataUser.group,
        "lecturer_name": disciplineInfo.lecturer,
        "seminarian_name": disciplineInfo.seminarian,
        "discipline_id": disciplineInfo.discipline_id,
    },
        ...answers
    ]

    return body;
}

export const formattingGroupList = (groupList, surveysPassed) => {
    const [students, headStudent] = fillGroupList(groupList);
    let groupMembers = {}

    if (surveysPassed.length > 1) {
        surveysPassed.sort((a, b) => a.student_id - b.student_id);

        const aboutStudents = []

        for (let i = 0; i < groupList.length; i++) {
            const infoStudent = {
                id: groupList[i].id,
                name: students[i],
                submitted_surveys: surveysPassed[i].submitted_surveys,
            }

            aboutStudents.push(infoStudent);
        }

        groupMembers = {
            'students': aboutStudents,
            'headStudent': headStudent,
        }
    } 
    else {
        groupMembers = {
            'students': students,
            'headStudent': headStudent,
        }
    }
    
    return groupMembers;
}

const fillGroupList = (array) => {
    let students = []
    let headStudent = '';

    for (let i = 0; i < array.length; i ++) {
        if (array[i].is_head_student === '1') { 
            headStudent = array[i].name;
        }
        
        const formattedName = formattingName(array[i].name)
        students.push(formattedName)
    }

    return [students, headStudent]
}

const formattingName = (fullName) => {
    const names = fullName.split(' ');
    const formattedNames = names.map(name => name.charAt(0) + name.slice(1).toLowerCase());

    return formattedNames.join(' ');
}

export const formattingTeachersList = (teachersList) => {
    let formattedTeachersList = [];

    teachersList.map((teacher) => (
        formattedTeachersList.push({
            key: teacher.id,
            value: `${teacher.surname} ${teacher.name} ${teacher.patronymic}` 
        })
    ))

    return formattedTeachersList;
}

export const getDisciplineInfoByType = (discipline, type) => {
    let disciplineInfoByType = {
        lectures: 1,
        practical: 0,
        teacherId: discipline.lecturer_id,
    }

    if (type === 'ПЗ') { 
        disciplineInfoByType = {
            lectures: 0,
            practical: 1,
            teacherId: discipline.seminarian_id,
        }
    }

    return disciplineInfoByType;
}

export const setShortFormatGroup = (group) => {
    let [instituteId, groupName, year] = group.split('-');
    groupName = groupName.slice(1);
    const shortStudentGroup = `${instituteId}-${groupName}-${year}`;

    return shortStudentGroup;
} 

export const setFullFormatGroup = (group) => {
    const yearOfStudy = getYearOfStudy(group);
    const codeGroup = group.split('-');
    const fullFormatGroup = codeGroup[0] + '-' + yearOfStudy + codeGroup[1] + '-' + codeGroup[2];

    return fullFormatGroup;
}

const getYearOfStudy = (group) => {
    const currentDate = new Date();
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const receiptMonth = 8;
    const receiptYear = `20${group.split('-')[2]}`;

    const countMounts = Math.abs(receiptYear - year) * 12 + month - receiptMonth;

    return Math.ceil(countMounts / 12);
}

export const checkSubmittedSurveys = (surveysPassed, disciplineId) => {
    const submittedSurveys = surveysPassed?.submitted_surveys;
    let submitted = false;

    if (submittedSurveys) {
        submittedSurveys.forEach(survey => {
            if (survey.discipline_id === disciplineId) {
                submitted = true;
            }
        });
    }

    return submitted;
}