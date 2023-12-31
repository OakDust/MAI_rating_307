export const authForm = [
    {
        type: 'login',
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

export const registrationForm = [
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
        type: 'text',
        title: 'Номер группы',
        name: 'group',
        placeholder: 'Введите номер группы (М3О-21Б-23)',
        pattern: /М[0-9]О-[0-9]{2}Б-[0-9]{2}/,
        message: 'Некорректное написание группы'
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