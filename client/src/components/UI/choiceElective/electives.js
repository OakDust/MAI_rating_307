export const electives = {
    'Иностранный язык': {
        type: 'language',
        route: '/student/fetchEnglish',
        title: `Введите и выберете своего преподавателя по иностранному языку`,
        key: 'id',
        value: 'seminarian',
        message: 'Пожалуйста, выберете преподавателя'
    },

    'Цепочка': {
        type: 'chain',
        route: '/student/defineIndividual?individual_type=chain',
        title: `Введите и выберете предмет, который соответствует вашей образовательной цепочке`,
        key: 'discipline_id',
        value: 'discipline_name',
        message: 'Пожалуйста, выберете предмет'
    },

    'Электив': {
        type: 'elective',
        route: '/student/defineIndividual?individual_type=elective',
        title: `Введите и выберете электив, который соответсвует вашему предмету на выбор`,
        key: 'discipline_id',
        value: 'discipline_name',
        message: 'Пожалуйста, выберете предмет'
    }
}