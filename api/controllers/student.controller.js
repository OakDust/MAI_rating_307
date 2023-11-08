const Student = require('../models/student')
const StudentsByGroups = require('../models/studentsByGroups')
const cheerio = require('cheerio');
const {query} = require("express");


exports.parseTable = (html) => {
  // Загрузка HTML с помощью cheerio
  const $ = cheerio.load(html);

// Массив для хранения извлеченных данных
  const extractedData = [];

// Перебор строк таблицы
  $('table tr').each((rowIndex, row) => {
    const rowData = [];

    // Перебор ячеек строки
    $(row).find('td').each((cellIndex, cell) => {
      const cellText = $(cell).text().trim(); // Извлечение текста из ячейки
      rowData.push(cellText); // Сохранение текста в массив данных строки
    });

    extractedData.push(rowData); // Сохранение данных строки в массив извлеченных данных
  });

  return extractedData
}

exports.prettyArray = (array, req) => {
  const pretty = [{}]

  for (let i = 0; i < array.length; i++) {
    let discipline = array[i][0]
    let groups = array[i][1]

    if (array[i][0] !== 'Итого:' && array[i].length !== 0) {
      let string = groups.toString().substring(0, 4) + groups.toString().substring(5, groups.toString().length)

      pretty.push({
        discipline: discipline,
        groups: string,
      })
    }

    pretty.filter(value => Object.keys(value).length !== 0)
  }

  return pretty.splice(2, pretty.length)
}

exports.getUserInfo = async (req, res) => {

  const students = await StudentsByGroups.findAll({
    where: {
      groups: req.body.groups
    }
  })

  const output = JSON.stringify(students, null, 2)
  await res.status(200).json(students)
}

exports.show = async (req, res) => {
  const students = await Student.findAll()

  const output = JSON.stringify(students, null, 2)

  res.status(200).json(students)
}

exports.checkHeadStudent = async (req, res) => {
  const groupmates = await Student.findAll({
    where: {
      groups: req.body.groups
    }
  })

  let headStudent = false

  for (const student of groupmates) {
    if (student.dataValues.is_head_student) {
      headStudent = true
      break
    }
  }

  return headStudent
}

exports.sortDataByGroup = (groups, array) => {
  let result = [{}]

  for (let i = 0; i < array.length; i++) {

    if (groups === array[i].groups) {
      result.push({
        discipline: array[i].discipline,
        groups: array[i].groups
      })
    }
  }

  return result.filter(value => Object.keys(value).length !== 0)

}

exports.fetchDisciplines = async (req, res) => {
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

  let response
  await fetch('http://n20230.xmb.ru/', requestHeaders)
      .then((res) => res.text())
      .then((text) => {
        response = text
      })

  const parsed = this.parseTable(response)

  const pretty = this.prettyArray(parsed, req)

  const dataByGroup = this.sortDataByGroup(req.query.groups, pretty)

  res.status(200).json(dataByGroup)
}