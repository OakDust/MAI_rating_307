const Professor = require('../models/professor')
const Student = require('../models/student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const generateAccessToken = (id, role) => {
    const payload = {
        id, role
    }

    return jwt.sign(payload, process.env.AUTH_SECRET, {expiresIn: '4h'})
}

exports.professorAuth = async (req, res, next) => {
    const professor = await Professor.findOne({
        where: {
            p_email: req.body.email
        }
    })

    if (!professor) {
        await res.status(400).json({
            message: "Пользователь не существует",
            token: false
        })
        return
    } 

    const validPasswordProfessor = bcrypt.compareSync(req.body.password, professor.p_password); 

    if (!validPasswordProfessor) {
        await res.status(400).json({
            message: "Логин или пароль введен неправильно!",
            token: false
        })
        return
    } 

    const token = await generateAccessToken(professor.p_id)

    await res.json({
        message: false,
        token: token
    })
}

exports.studentAuth = async (req, res, next) => {
    const student = await Student.findOne({
        where: {
            email: req.body.email
        }
    })

    if (!student) {
        await res.status(400).json({
            message: "Пользователь не существует",
            token: false
        })
        return
    } 

    const validPasswordStudent = bcrypt.compareSync(req.body.password, student.password);

    if (!validPasswordStudent) {
        await res.status(400).json({
            message: "Логин или пароль введен неправильно!",
            token: false
        })
        return
    } 

    const token = await generateAccessToken(student.id, 'Student')
    console.log(student.dataValues)
    await res.json({
        user: student.dataValues,
        message: false,
        token: 'Student ' + token
    })
}