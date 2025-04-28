
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { toast } from 'react-toastify';
import { addUser } from '../store/userSlice';
import { BASE_URL } from '../utils/constants';
import { useDispatch } from 'react-redux';
import Loading from '../components/Loading';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();


    const handleRegister = (e) => {
        e.preventDefault();
        if (username.length <= 0 && email.length <= 0 && password.length <= 0) return;
        setLoading(true);
        axios.post(BASE_URL + "/api/auth/signUp", { username, email, password })
        .then((res) => {
            let { user, message } = res?.data;
            dispatch(addUser({user,token: null}))
            toast.success(message);
            setLoading(false);
            navigate("/verify");
        })
        .catch((err) => {
            setLoading(false);
            let { message, errors } = err?.response?.data;
            if (message) toast.error(message);
            else toast.error(errors[0].msg);
        });
    };

    const handleGoogleLogin = (access_token) => {
    axios.post(BASE_URL + "/api/auth/google-login", { accessToken: access_token })
      .then((res) => {
        const {token,user,message} = res.data;
        console.log(user);
        localStorage.setItem("token",token)
        dispatch(addUser({user,token}))
        toast.success(message)
        navigate("/");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
        console.log(err);
      });
    };

    const googleLogin = useGoogleLogin({
        onSuccess : (response) => {
            handleGoogleLogin(response.access_token);
        },
        onError : () => toast("Google Login Failed...!")
    })


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg">

        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Create your account
        </h2>

        <div className="w-full flex items-center justify-center gap-5 mt-5">
          <div className="btn px-6 md:px-10 bg-black text-white border-black">
            <svg
              aria-label="GitHub logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                fill="white"
                d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
              ></path>
            </svg>
            Github
          </div>

          <div onClick={googleLogin}  className="btn px-6 md:px-10 bg-white text-black border-[#e5e5e5]">
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            Google
          </div>
        </div>

         <div className="relative my-6">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-gray-300 dark:border-gray-600" />
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
               Or sign up with email
             </span>
           </div>
         </div>

        <form className="mt-6 space-y-6" onSubmit={handleRegister}>
          <div>
            <label htmlFor="name" className="sr-only">username</label>
            <input
              id="username" name="username" type="text" autoComplete="username" required
              value={username} onChange={(e) => setUsername(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Full Name"
            />
          </div>
          <div>
            <label htmlFor="email-signup" className="sr-only">Email address</label>
            <input
              id="email-signup" name="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password-signup" className="sr-only">Password</label>
            <input
              id="password-signup" name="password" type="password" autoComplete="new-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="appearance-none relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-fuchsia-500 hover:bg-fuchsia-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
              {loading ? <Loading/> : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className=" text-fuchsia-600 hover:text-fuchsia-700 dark:text-indigo-400 dark:hover:text-indigo-300 ">
                Log In
            </Link>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;