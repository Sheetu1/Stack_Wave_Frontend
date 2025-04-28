
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { BASE_URL } from '../utils/constants';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from '../components/Loading';

const VerifyOTP = () => {

    const otpLength = new Array(6).fill("");
    const [input,setInput] = useState(otpLength);
    const ref = useRef([]);
    const [timer, setTimer] = useState(60);
    const [loading,setLoading] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.user)
    

    const OnchangeHandler = (value,idx) => {
        if(isNaN(value)) return;
        const newInput = [...input];
        newInput[idx] = value;
        setInput(newInput);

        if(value && idx < otpLength.length){
            ref.current[idx + 1]?.focus();
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (timer > 0) {
                setTimer((prev) => prev - 1);
            } else {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const onKeyDownHandler = (e,idx) => {
        if(e.key === "Backspace" && !input[idx] && idx >= 0){
            ref.current[idx - 1]?.focus();
        }
    }

    const handleSubmitOTP = () => {
        if(!input[0]) return;
        axios.post(BASE_URL + "/api/auth/verify", {otp: input.join(""),email: user.email})
        .then((res) => {
            const {token,message} = res.data;
            toast(message)
            localStorage.setItem("token",token);
            navigate("/")
            console.log(res);
        })
        .catch((err) => {
            console.log(err);
            toast.error(err.response.data.message)
        })
    }


    const handleResendOTP = () => {
        setLoading(true);
        axios.post(BASE_URL + "/api/auth/resend-otp", {email: user.email})
        .then((res) => {
            setLoading(false);
            console.log(res);
            toast.success(res.data.message)
            setTimer(60);
        })
        .catch((err) => {
            setLoading(false);
            toast.error(err.response.data.message)
            console.log(err);
        })
    }


  return (
    <div className='w-full h-screen flex items-center justify-center bg-gray-200'>
        <div className='shadow-xl bg-white rounded-2xl px-8 md:px-12 py-8'>
            <h2 className='text-center mb-5 text-2xl md:text-3xl font-semibold text-gray-600'>OTP Verification</h2>
            <div className='flex items-center gap-2 md:gap-4 flex-wrap'>
                {
                    input.map((i,idx) => (
                        <input 
                            ref={(el) => ref.current[idx] = el}
                            type="text"
                            key={idx}
                            maxLength={1}
                            className="w-10 h-10 md:w-14 md:h-14 text-center text-2xl font-bold rounded-lg border-2 
                            border-purple-500 focus:border-purple-600 focus:ring-2 focus:ring-purple-300 outline-none 
                            transition-all duration-200 ease-in-out shadow-md"
                            value={input[idx]}
                            onChange={(e) => OnchangeHandler(e.target.value, idx)}
                            onKeyDown={(e) => onKeyDownHandler(e,idx)}
                         />
                    ))
                }
            </div>
            <div className='text-center mt-5'>

                <button onClick={handleSubmitOTP} className='px-6 py-2 bg-purple-500 hover:bg-purple-600 transition-all duration-200 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-400'>
                    Submit
                </button>

                { timer > 0 ? <p className='mt-4'>OTP expires in <strong>{timer}</strong> seconds</p> : 
                    <button onClick={handleResendOTP} className='mx-4 px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-alltext-white font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400'>
                        {loading ? <Loading/> : "Resend OTP"}
                    </button>
                }

            </div>
        </div>
    </div>
  )
}

export default VerifyOTP