const nodemailer = require('nodemailer')
const Student = require("../models/student");
const Professor = require("../models/professor");

exports.sendActivationMail = async (email, activationLink) => {
    const Client = {
        transporter: nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    const heartEmojiCode = '&#128153';

    try {
        await Client.transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: `Активация аккаунта «Опросы 307»`,
            text: '',
            html: `
                <div>
                    <p>Добрый день!</p>

                    <p>Перейдите по ссылке ниже, чтобы подтвердить свой аккаунт на платформе <b>«Опросы 307»</b>:</p>
                    <a href="${activationLink}">Активировать аккаунт</a>

                    <p>Если вы не регистрировались на сайте «Опросы 307», то можете игнорировать это письмо.</p>
                    <br/>
                    <p><i>*Письмо сгенерировано автоматически и на него не нужно отвечать</i></p>
                    
                    <h4>Спасибо! Команда разработки ${heartEmojiCode}</h4>
                </div>
            `
        })

        return true
    } catch (err) {
        return false
    }


}

exports.recoverPassword = async (req, res) => {
    const Client = {
        transporter: nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    const userData = {
        name: req.body.surname + ' ' + req.body.name + ' ' + req.body.patronymic,
        email: req.body.email,
        role: req.body.role
    }

    let user

    if (userData.role === 'Студент') {
        user = await Student.findOne({
            where: userData
        })
    } else if (userData.role === 'Преподаватель') {
        user = await Professor.findOne({
            where: userData
        })
    } else {
        res.status(400).json({
            message: 'Проверьте входные данные.',
            statusCode: res.statusCode,
        })

        return
    }

    try {
        if (!user) {
            res.status(400).json({
                message: 'Неправильный логин или пароль.',
                statusCode: res.statusCode,
            })

            return
        } else {
            const recoveryURL = `${process.env.REACT_APP_API_URL}/recoverPassword/${user.activation_link}`
            await Client.transporter.sendMail({
                from: process.env.SMTP_USER,
                to: userData.email,
                subject: `Восстановление пароля на сайте ${process.env.REACT_APP_API_URL}`,
                text: "",
                html:
                    `
                        <div>
                            <h1>Для восстановления пароля перейдите по ссылке:</h1>
                            <a href="${recoveryURL}">Восстановить пароль от аккаунта</a>
                        </div>
                    `
            })
        }

    } catch (err) {
        res.status(400).json({
            message: 'Проверьте входные данные.',
            statusCode: res.statusCode,
        })

        return
    }

    res.status(200).json({
        message: 'Письмо на почту отправлено.',
        statusCode: res.statusCode,
    })



    // if (userData.role === 'Студент') {
    //     try {
    //         const student = await Student.findOne({
    //             where: userData
    //         })
    //
    //         if (!student) {
    //             res.status(400).json({
    //                 message: 'Неправильный логин или пароль.',
    //                 statusCode: res.statusCode,
    //             })
    //
    //             return
    //         } else {
    //             const recoveryURL = `${process.env.REACT_APP_API_URL}/recoverPassword/${student.activation_link}`
    //             await Client.transporter.sendMail({
    //                 from: process.env.SMTP_USER,
    //                 to: userData.email,
    //                 subject: `Восстановление пароля на сайте ${process.env.REACT_APP_API_URL}`,
    //                 text: "",
    //                 html:
    //                     `
    //                         <div>
    //                             <h1>Для восстановления пароля перейдите по ссылке:</h1>
    //                             <a href="${recoveryURL}">Восстановить пароль от аккаунта</a>
    //                         </div>
    //                     `
    //             })
    //         }
    //
    //     } catch (err) {
    //         res.status(400).json({
    //             message: 'Проверьте входные данные.',
    //             statusCode: res.statusCode,
    //         })
    //
    //         return
    //     }
    // }

}