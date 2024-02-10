export const recoveryFields = [
    {
        type: 'text',
        title: 'Фамилия',
        name: 'surname',
        placeholder: 'Введите фамилию',
        required: true,
    },
    {
        type: 'text',
        title: 'Имя',
        name: 'name',
        placeholder: 'Введите имя',
        required: true,
    },
    {
        type: 'text',
        title: 'Отчество',
        name: 'patronymic',
        placeholder: 'Введите отчество',
        required: false,
    },
    {
        type: 'email',
        title: 'E-mail',
        name: 'email',
        placeholder: 'Введите ваш E-mail',
        //eslint-disable-next-line
        pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        message: 'Неккоректный E-mail',
        required: true,
    },
]

export const passwordFields = [
    {
        type: 'password',
        title: 'Введите новый пароль',
        name: 'password',
        placeholder: 'Введите новый пароль',
        message: 'Минимум 8 символов!',
        minLength: 8,
        required: true,
    },
    {
        type: 'password',
        title: 'Повторите пароль',
        name: 'cpassword',
        placeholder: 'Повторите пароль',
        required: true,
    },
]