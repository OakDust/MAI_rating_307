export const formattingProfessorsList = (disciplines) => {
    disciplines.forEach((discipline) => {
        if (discipline.lecturer === '') {
            discipline.lecturer = discipline.seminarian;
        } 
        else if (discipline.seminarian === '') {
            discipline.seminarian = discipline.lecturer;
        }
    })
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