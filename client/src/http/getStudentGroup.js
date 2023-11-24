exports.getStudentGroup = async (userId, userGroup, url) => {
    const id = {id: userId, groups: userGroup};

    const requestHeaders = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Authorization": JSON.parse(localStorage.getItem('authUser'))['Authorization'],
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",

        body: JSON.stringify(id)
    }

    const response = await fetch(url, requestHeaders)
    const groupList = await response.json()
    
    console.log(groupList);

    const studentGroup = setInfoGroup(groupList.students, groupList.surveys_passed);

    return studentGroup;
}

const setInfoGroup = (groupList, surveysPassed) => {
    const [students, headStudent] = fillArray(groupList);
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

const fillArray = (array) => {
    let arr = []
    let headStudent
    for (let i = 0; i < array.length; i ++) {
        if (array[i].is_head_student === '1') { headStudent = array[i].name }

        const formattedName = formatName(array[i].name)
        arr.push(formattedName)
    }
    return [arr, headStudent]
}

const formatName = (fullName) => {
    const names = fullName.split(' ');
    const formattedNames = names.map(name => name.charAt(0) + name.slice(1).toLowerCase());
    return formattedNames.join(' ');
}

