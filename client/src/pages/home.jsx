import React, {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import Main from '../components/main/main';
import FieldHome from '../components/UI/fieldHome/fieldHome';

const Home = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')));

    const fetchUser = async () => {
        const dataUser = localStorage.getItem('authUser');
        
        if (!dataUser) {
            console.log('Пользователя нет');
            //Тут отправляю запрос на сервер, если по какой-то причине пропали данные из localstorage
        }

        setUser(JSON.parse(dataUser));
    }

    useEffect(() => {
        fetchUser();
    }, [])

    const userRole = user?.role ?? 'noRole';

    switch (userRole) {
        case 'noRole': {
            return(
                <Navigate to='/auth'/>
            )
        }
            
        case 'Студент': {
            return(
                <Navigate to='/surveys'/>
            )
        }
    
        default: {
            return(
                <Main title={'Главная'} displayField={<FieldHome/>}/>
            )
        }     
    }
}
export default Home;