export const authFields = [
    {
        type: 'email',
        title: 'Логин',
        name: 'email',
        placeholder: 'Введите логин',
    },
    {
        type: 'password',
        title: 'Пароль',
        name: 'password',
        placeholder: 'Введите пароль',
    },
]

export const registrationFields = [
    {
        type: 'text',
        title: 'Имя',
        name: 'name',
        placeholder: 'Введите имя'
    },
    {
        type: 'text',
        title: 'Фамилия',
        name: 'surname',
        placeholder: 'Введите фамилию',
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
        placeholder: 'Введите почту',
        //eslint-disable-next-line
        pattern: /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
        message: 'Неккоректный email',
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