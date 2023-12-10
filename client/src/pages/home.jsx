import React from 'react';
import Main from '../components/main/main';
import FieldHome from '../components/UI/fieldHome/fieldHome';


const Home = () => {

    return(
        <Main title={'Главная'} displayField={<FieldHome/>}/>
    )
}
export default Home;