import React, { FormEvent } from 'react';
import './styles.css';
import Image from './assets/signup_image.png';
import { auth, createUserWithEmailAndPassword, signInWithPopup, provider } from './firebase'; // Adjust the path as necessary
import { useLocation } from 'wouter';

const SignUp: React.FC = () => {
    const [, navigate] = useLocation();
    // Function to handle email/password sign-up
    const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const target = event.target as typeof event.target & {
            email: { value: string };
            password: { value: string };
            password_confirmation: { value: string };
        };

        const email = target.email.value;
        const password = target.password.value;
        const passwordConfirmation = target.password_confirmation.value;

        if (password !== passwordConfirmation) {
            alert("Passwords do not match");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // Success - User account created
            navigate('/input')
        } catch (error: any) {
            // Handle errors
            alert(error.message);
        }
    };

    // Function to handle Google sign-in
    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, provider);
            // Success - User signed in
            navigate('/input')
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
                            A revolutionary way to learn from video content.
                        </p>

                        <form onSubmit={handleSignUp} className="mt-8 grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                                <label htmlFor="Email" className="block text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="Email"
                                    name="email"
                                    className="mt-1 w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="Password" className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="Password"
                                    name="password"
                                    className="mt-1 w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="PasswordConfirmation" className="block text-sm font-medium text-gray-300">
                                    Password Confirmation
                                </label>
                                <input
                                    type="password"
                                    id="PasswordConfirmation"
                                    name="password_confirmation"
                                    className="mt-1 w-full rounded-md bg-gray-700 border border-gray-600 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div className="col-span-6">
                                <p className="text-sm text-gray-500">
                                    By creating an account, you agree to our terms.

                                </p>
                            </div>

                            <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                                <button
                                    className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500"
                                    style={{ background: 'linear-gradient(to right, #49C7FE, #8D7FF1)' }}
                                >
                                    Create an account
                                </button>

                                <p className="mt-4 text-sm text-gray-500 sm:mt-0"> Already have an account? <br /><a href="/login" className="text-gray-700 underline">Log in</a>.</p>
                            </div>
                        </form>



                        <div className="col-span-6">
                            <div className="flex items-center justify-center">
                                <div className="flex-grow border-t border-gray-600"></div>
                                <span className="mx-4 my-5 text-gray-400">OR</span>
                                <div className="flex-grow border-t border-gray-600"></div>
                            </div>
                        </div>

                        <div className="col-span-6">
                            <button
                                onClick={handleGoogleSignIn}
                                className="w-full py-2 rounded-md text-white transition hover:bg-opacity-90 focus:outline-none focus:ring"
                                style={{
                                    background: 'linear-gradient(to right, #DB4437, #F4B400)'
                                }}
                            >
                                Login with Google
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SignUp;
