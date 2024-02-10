export const changeFields = [
    {
        type: 'password',
        title: 'Введите старый пароль',
        name: 'oldPassword',
        placeholder: 'Введите старый пароль',
        required: true,
    },
    {
        type: 'password',
        title: 'Введите новый пароль',
        name: 'password',
        placeholder: 'Введите новый пароль',
        minLength: 8,
        messege: 'Минимум 8 символов!',
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