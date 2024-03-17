import React from 'react';
import './styles.css';
import yourImage from './assets/landingimage.png';
import { useLocation } from 'wouter';

const LandingPage: React.FC = () => {
    const [, navigate] = useLocation();

    return (
        <div className="bg-[#212326] text-white min-h-screen max-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="flex justify-between items-center p-4" style={{
                background: 'linear-gradient(to bottom, #4B616C, #212326)'
            }}>
                <h1 className="text-2xl font-bold cursor-pointer">VideoSage</h1>
                <div>
                    <a href="/login" className="text-md mr-3">Login </a>
                    <button onClick={() => navigate('/signup')}
                        className="text-white text-md py-2 px-4 rounded-full"
                        style={{
                            background: 'linear-gradient(to right, #49C7FE, #8D7FF1)'
                        }}>Get Started</button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex-grow flex flex-col justify-between">
                {/* Content Area */}
                <div className="flex flex-col md:flex-row flex-1">
                    {/* Left Half */}
                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center px-4">
                        <h2 className="text-3xl sm:text-3xl md:text-2xl lg:text-3xl xl:text-4xl mb-3 whitespace-nowrap">Revolutionizing Learning</h2>
                        <h3 className="text-4xl md:text-6xl font-bold text-gradient underlined">Across the World.</h3>
                    </div>

                    {/* Right Half */}
                    <div className="md:w-1/2 w-full" style={{ overflow: 'hidden' }}>
                        <img
                            src={yourImage}
                            alt="Graphic"
                            className="interactive-image w-full h-full object-cover cursor-pointer"
                            onClick={() => navigate('/input')}
                        />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default LandingPage;
