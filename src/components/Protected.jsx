
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../store/userSlice';

const Protected = ({children}) => {

    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if(user) return;
        const token = localStorage.getItem("token");
        if(!token){
            return navigate("/auth")
        }
        axios.get(BASE_URL + "/api/auth/me", {
            headers: { Authorization : `bearer ${token}` }
        })
        .then((res) => {
            console.log(res);
            setUser(res.data.user)
            dispatch(addUser({user: res?.data?.user, token}))
        })
        .catch((err) => {
            navigate("/login")
        })
    },[])

    useEffect(() => {
        if(user && !user?.isVerified){
            return navigate("/auth")
        }
    },[user])


  return children;
}

export default Protected