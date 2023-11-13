const cheerio = require("cheerio");
const Teacher = require("../models/teacher");


exports.clearArray = (array) => {
    const replacedArray = []

    array.map((element) => {
        const temp = element.toString()
        replacedArray.push(temp.replace('.', ''))
    })

    return replacedArray
}

exports.prettyArray = (array, obj) => {
    const pretty = [{}]

    for (let i = 0; i < array.length - 2; i++) {
        let discipline = array[i][0]
        let groups = array[i][1]
        let lecturer = obj[i].lecturer
        let seminarian = obj[i].seminarian

        if (array[i][0] !== 'Итого:' && array[i].length !== 0) {
            let string = groups.toString().substring(0, 4) + groups.toString().substring(5, groups.toString().length)

            pretty.push({
                lecturer: lecturer,
                seminarian: seminarian,
                discipline: discipline,
                groups: string,
            })
        }

        pretty.filter(value => Object.keys(value).length !== 0)
    }

    return pretty.splice(2, pretty.length)
}

exports.parseTable = (html) => {
    // Загрузка HTML с помощью cheerio
    const $ = cheerio.load(html);

// Массив для хранения извлеченных данных
    const extractedData = [];
    const links = []
// Перебор строк таблицы
    $('table tr').each((rowIndex, row) => {
        const rowData = [];

        // Перебор ячеек строки
        const current = $(row).find('td').last().text()

        if (current !== 'Не распределено.') {
            $(row).find('td').each((cellIndex, cell) => {
                const cellText = $(cell).text().trim(); // Извлечение текста из ячейки

                const a = $(cell).find('a').first().attr('href')
                if (a !== undefined) {
                    links.push(a)
                }

                if (cellText !== '' && cellText !== undefined && cellText !== 'Не распределено.') {
                    rowData.push(cellText); // Сохранение текста в массив данных строки
                }
            });
        }

        extractedData.push(rowData); // Сохранение данных строки в массив извлеченных данных
    });

    const linkArray = links.filter(val => val)

    const outArray = this.clearArray(linkArray)

    return [outArray, extractedData]
}

exports.teacherExists = async (body) => {
    const [lecturerSurname, lecturerName, lecturerPatronymic] = body[0].split(' ')
    const [seminarianSurname, seminarianName, seminarianPatronymic] = body[1].split(' ')

    const lecturer = await Teacher.findOne({
        where: {
            name: lecturerName,
            surname: lecturerSurname,
            patronymic: lecturerPatronymic,
        }
    })

    const seminarian = await Teacher.findOne({
        where: {
            name: seminarianName,
            surname: seminarianSurname,
            patronymic: seminarianPatronymic,
        }
    })

    return [lecturer, seminarian]
}

exports.fetchProfessorLoad = async (req, res, link) => {
    const requestHeaders = {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "text/html",

        },
        body: {
            "username": process.env.DISCIPLINE_API_USERNAME,
            "password": process.env.DISCIPLINE_API_PASSWORD
        }
    }


    const url = new URL(link, 'http://n20230.xmb.ru')

    let response
    await fetch(url, requestHeaders)
        .then((res) => res.text())
        .then((text) => {
            response = text
        })

    const [links, parsed] = this.parseTable(response)
    const pretty = parsed.filter(val => val !== '' && val.length !== 0)

    const test = pretty.splice(1, pretty.length - 2)


    let lecturer = ''
    let seminarian = ''

    for (let i = 0; i < test.length; i++) {
        if (test[i][1] !== '-') { lecturer = test[i][0] }

        if (test[i][2] !== '-') { seminarian = test[i][0] }

    }

    const obj = {
        lecturer: lecturer,
        seminarian: seminarian
    }

    return obj
}

exports.sortDataByGroup = (groups, array) => {
    let result = [{}]

    for (let i = 0; i < array.length; i++) {

        if (groups === array[i].groups && array.length !== 0) {
            result.push({
                key: i,
                lecturer: array[i].lecturer,
                seminarian: array[i].seminarian,
                discipline: array[i].discipline,
                groups: array[i].groups
            })
        }
    }

    return result.filter(value => Object.keys(value).length !== 0)

}