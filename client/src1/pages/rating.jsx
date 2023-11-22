import React from 'react';
import Main from '../components/main/main';
import FieldRating from '../components/UI/fieldRating/fieldRating';

const Raiting = () => {
    // const token = localStorage['Authorization']
    // const [professor, isAuth] = token.split(' ')

    const isAuth = true
    const professor = 'Professor'

    return(
        <div>
            {
                (isAuth && professor === 'Professor') ? <Main title='Рейтинг' displayField={<FieldRating/>}/> : <div>error</div>
            }
        </div>

    );
}
export default Raiting;