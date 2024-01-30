export const authFields = [
    {
        type: 'email',
        title: 'E-mail',
        name: 'email',
        placeholder: 'Введите ваш E-mail',
    },
    {
        type: 'password',
        title: 'Пароль',
        name: 'password',
        placeholder: 'Введите ваш пароль',
    },
]

export const registrationFields = [
    {
        type: 'text',
        title: 'Фамилия',
        name: 'surname',
        placeholder: 'Введите фамилию',
    },
    {
        type: 'text',
        title: 'Имя',
        name: 'name',
        placeholder: 'Введите имя'
    },
    {
        type: 'text',
        title: 'Отчество',
        name: 'patronymic',
        placeholder: 'Введите отчество',
    },
    {
        type: 'email',
        title: 'Почта',
        name: 'email',
        placeholder: 'Введите E-mail',
        //eslint-disable-next-line
        pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        message: 'Неккоректный E-mail',
    },
    {
        type: 'password',
        title: 'Пароль (минимум 8 символов)',
        name: 'password',
        placeholder: 'Введите пароль',
        messege: 'Минимум 8 символов!',
        minLength: 8,
    },
    {
        type: 'password',
        title: 'Повторите пароль',
        name: 'cpassword',
        placeholder: 'Повторите пароль',
    },
]