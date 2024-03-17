import React, { useState } from 'react';
import { useLocation } from "wouter";
import './styles.css'; // Make sure this path is correct
import { auth, signInWithEmailAndPassword, signInWithPopup, provider } from './firebase'; // Adjust the path as necessary
import Image from './assets/signup_image.png'; // Make sure this path is correct

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [location, navigate] = useLocation();

    const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            localStorage.setItem('user', 'authenticated'); // Set auth status on successful login
            navigate('/input'); // Adjust the path as necessary
        } catch (error: any) {
            // Handle errors
            alert(error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            localStorage.setItem('user', 'authenticated'); // Set auth status on successful login
            navigate('/input');
        } catch (error: any) {
            // Handle errors
            alert(error.message);
        }
    };

    return (
        <div className="bg-[#212326] min-h-screen">
            <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
                <aside className="relative block h-16 lg:order-last lg:col-span-5 lg:h-full xl:col-span-6">
                    <img
                        alt="Pattern"
                        src={Image}
                        className="absolute inset-0 h-full w-full"
                    />
                </aside>

                <main
                    className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6"
                >
                    <div className="max-w-xl lg:max-w-3xl">
                        <a className="block text-blue-600" href="/">
                            <span className="sr-only">Home</span>
                            {/* SVG logo placeholder */}
                        </a>

                        <h1 className="mt-6 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
                            Welcome to VideoSage
                        </h1>

                        <p className="mt-4 leading-relaxed text-gray-300">
                        </p>

                        <form className='max-w-[400px] w-full mx-auto bg-gray-900 p-8 px-8 shadow-xl rounded-lg' onSubmit={handleSignIn}>
                            {/* Email Input */}
                            <div className='flex flex-col text-gray-400 py-2'>
                                <label>Email</label>
                                <input className='rounded-lg bg-gray-700 mt-2 p-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="text" onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            {/* Password Input */}
                            <div className='flex flex-col text-gray-400 py-2'>
                                <label>Password</label>
                                <input className='p-2 rounded-lg bg-gray-700 mt-2 focus:border-blue-500 focus:bg-gray-800 focus:outline-none' type="password" onChange={(e) => setPassword(e.target.value)} />
                            </div>

                            {/* Forgot Password Link */}
                            <div className='flex justify-between text-gray-400 py-2'>
                                <p className='flex items-center'></p>
                                <a href="#">Forgot Password</a>
                            </div>

                            {/* Sign In Button */}
                            <button type='submit' className='w-full my-5 py-2 shadow-md shadow-gray-500/50 hover:shadow-gray-500/40 text-white rounded-lg' style={{
                                background: 'linear-gradient(to right, #49C7FE, #8D7FF1)'
                            }} >Sign In</button>

                            {/* Divider */}
                            <div className='text-center mb-4'>
                                <span className='text-gray-400'>OR</span>
                            </div>

                            {/* Google Sign In Button */}
                            <button type="button" className='w-full py-2 shadow-md shadow-gray-500/50 hover:shadow-gray-500/40 text-white rounded-lg' style={{
                                background: 'linear-gradient(to right, #DB4437, #F4B400)'
                            }} onClick={handleGoogleSignIn}>
                                Login with Google
                            </button>

                            {/* Signup Link */}
                            <div className='text-center mt-4'>
                                <span className='text-gray-400'>Don't have an account? </span>
                                <a href="/signup" className='text-blue-500 hover:text-blue-600'>Sign up</a>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Login;
