import React, {useEffect, useState, useMemo} from 'react';
import {Link} from 'react-router-dom';
import socketio from 'socket.io-client';

import api from '../../services/api';
import './styles.css'

export default function Dashboard(){

    const [spots, setSpots] = useState([]);
    const [request,setRequest] = useState([]);

    const user_id = localStorage.getItem('user');
    const socket = useMemo(() => socketio('http://localhost:3333',{
        query:{user_id},
    }), [user_id]);
    
    useEffect(()=>{
        

        socket.on('booking_request', data =>{
            setRequest([...request, data]);
        });

    },[request,socket]);

    useEffect(()=>{

        async function loadSpots(){
            const user_id = localStorage.getItem('user');
            const response = await api.get('/dashboards',{
               headers: { user_id }
            });

           setSpots(response.data);
        }

        loadSpots();
    },[]);

    async function handleAccept(id){
        await api.post(`/bookings/${id}/approvals`,);

        setRequest(request.filter(request=> request._id!=id));
    }

    async function handleReject(id){
        await api.post(`/bookings/${id}/rejections`,);

        setRequest(request.filter(request=> request._id!=id));
    }

    return (
        <>
            <ul className='notifications'>
                {request.map(request => (
                    <li key={request._id}>
                        <p>
                            <strong>{request.user.email}</strong> is requesting a reservation in <strong>{request.spot.company}</strong> on the date of <strong>{request.date}</strong>
                        </p>
                        <button className='accept' onClick={()=> handleAccept(request._id)}>Accept</button>
                        <button className='reject' onClick={()=> handleReject(request._id)}>Reject</button>
                    </li>
                ))}

            </ul>

            <ul className='spot-list'>

                {spots.map(spot => (
                    <li key={spot._id}>
                        <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }}/>
                        <strong>{spot.company}</strong>
                        <span>{spot.price?`R$ ${spot.price}/dia`:`Free`}</span>
                    </li>
                )) }
            </ul>
            <Link to='/new'>
                <button className='btn '>Add Spot</button>
            </Link>
        </>
    );
}