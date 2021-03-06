import React, {useState, useMemo} from 'react';
import api from '../../services/api'

import './styles.css'

import camera from '../../assets/camera.svg'

export default function New({history}){

    const [thumbnail,setThumbnail] = useState(null);
    const [company,setCompany] = useState('');
    const [techs,setTechs] = useState('');
    const [price,setPrice] = useState('');

    const preview = useMemo(()=>{
        return thumbnail?URL.createObjectURL(thumbnail):null;
    },[thumbnail]);

    async function handleSubmit(event){
        event.preventDefault();

        const user_id = localStorage.getItem('user')
        const data = new FormData();

        data.append("thumbnail",thumbnail);
        data.append("company",company);
        data.append("techs",techs);
        data.append("price",price);

        await api.post('/spots',data,{
            headers:{user_id}
        })

        history.push('/dashboard');

    }
    
    return (
        <form onSubmit={handleSubmit} >

            <label 
                id="thumbnail" 
                style={{backgroundImage:`url(${preview})`}}
                className={thumbnail?'has-thumbnail':''}
            >
                <input type="file" onChange={event => setThumbnail(event.target.files[0])}/>
                <img src={camera} alt="select img"/>
            </label>

            <label htmlFor="Company">Company *</label>
            <input 
                id='company' 
                placeholder='Your company'
                value = {company}
                onChange = {event => setCompany(event.target.value)}              
            />

            <label htmlFor="techs"> Techs * <span>( comma separated )</span></label>
            <input 
                id='techs' 
                placeholder='What technologies do you use?'
                value = {techs}
                onChange = {event => setTechs(event.target.value)}              
            />

            <label htmlFor="price"> Daily price <span>(blank for free)</span></label>
            <input 
                id='price' 
                placeholder='Amount charged per day'
                value = {price}
                onChange = {event => setPrice(event.target.value)}              
            />
            <button type="submit" className='btn'>Register</button>
        </form>

    );
}