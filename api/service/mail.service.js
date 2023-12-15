const nodemailer = require('nodemailer')

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

    await Client.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Активация аккаунта ${process.env.REACT_APP_API_URL}`,
        text: '',
        html: `
            <div>
                <h1>Для активации аккаунта перейдите по ссылке:</h1>
                <a href="${activationLink}">Активировать аккаунт</a>
            </div>
        `
    })
}