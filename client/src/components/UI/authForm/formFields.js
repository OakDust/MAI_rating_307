export const authFields = [
    {
        type: 'email',
        title: 'E-mail',
        name: 'email',
        placeholder: 'Введите ваш E-mail',
        required: true,
    },
    {
        type: 'password',
        title: 'Пароль',
        name: 'password',
        placeholder: 'Введите ваш пароль',
        required: true,
    },
]

export const registrationFields = [
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
        title: 'Почта',
        name: 'email',
        placeholder: 'Введите E-mail',
        //eslint-disable-next-line
        pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        message: 'Неккоректный E-mail',
        required: true,
    },
    {
        type: 'password',
        title: 'Пароль (минимум 8 символов)',
        name: 'password',
        placeholder: 'Введите пароль',
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