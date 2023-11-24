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

    console.log(groupList)

    const studentGroup = setFormatGroup(groupList.students);

    return studentGroup;
}

const setFormatGroup = (groupList) => {
    const [students, headStudent] = fillArray(groupList);
    const groupMembers = {
        'students': students,
        'headStudent': headStudent,
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

