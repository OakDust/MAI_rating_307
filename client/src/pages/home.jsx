import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context';
import Main from '../components/main/main';
import FieldHome from '../components/UI/fieldHome/fieldHome';


const Home = () => {
    const {dataUser} = useContext(AuthContext);

    switch (dataUser.role) {
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