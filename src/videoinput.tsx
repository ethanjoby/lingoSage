import React, { useState, useEffect } from 'react';
import './styles.css';
import { useLocation } from 'wouter';
import useAuth from './useAuth'; // Import the useAuth hook
import ReactMarkdown from 'react-markdown';
import Flashcard from './flashcard';

interface Flashcard {
  question: string;
  answer: string;
}


const VideoInput: React.FC = () => {
  const isAuthenticated = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, navigate]);

  const [youtubeLink, setYoutubeLink] = useState('');
  const [language, setLanguage] = useState('English');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const languages = ["English", "Spanish", "French", "German", "Japanese"];

  const handleLogoClick = () => {
    navigate('/'); // Navigate to the home page
  };

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear auth status on logout
    navigate('/');
  };

  const handleYoutubeLinkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setYoutubeLink(event.target.value);
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(event.target.value);
  };

  const [notes, setNotes] = useState<string | null>(null); // State to store the notes
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ youtube_link: youtubeLink, lang: language }),
      });
      const data = await response.json();
      if (response.ok && data.notes) {
        setApiResponse(`output_audio.mp3`);
        setNotes(data.notes); // Set the notes received from the API
        console.log("success");
        if (data.flashcards) {
          console.log(data.flashcards);
          if (typeof data.flashcards === 'string') {
            const parsedFlashcards = JSON.parse(data.flashcards);
            setFlashcards(parsedFlashcards);
            console.log(parsedFlashcards);
            console.log(flashcards);
          } else {
            setFlashcards(data.flashcards);
            console.log(flashcards);
          }
        }
      } else {
        console.error('API response not successful:', data);
        setApiResponse(null);
        setNotes(null);
      }
    } catch (error) {
      console.error('Error:', error);
      setApiResponse(null);
      setNotes(null);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const goToNextFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
  };

  const goToPreviousFlashcard = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
  };


  return (
    <div className="bg-[#212326] text-white min-h-screen flex flex-col">
      <nav className="flex justify-between items-center p-4" style={{
        background: 'linear-gradient(to bottom, #4B616C, #212326)'
      }}>
        <h1 className="text-2xl font-bold cursor-pointer" onClick={handleLogoClick}>VideoSage</h1>
        <div>
          <button className="text-md mr-4" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="mx-auto flex gap-4 items-center mt-8 mb-10">
        <input
          type="text"
          placeholder="Enter URL"
          className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 rounded-md w-full"
          value={youtubeLink}
          onChange={handleYoutubeLinkChange}
        />
        <select
          className="bg-gray-800 text-white px-4 py-2 rounded-md cursor-pointer"
          value={language}
          onChange={handleLanguageChange}
        >
          {languages.map((language, index) => (
            <option key={index} value={language}>
              {language}
            </option>
          ))}
        </select>
        <button
          className="bg-gradient-to-r from-[#49C7FE] to-[#8D7FF1] text-white py-2 px-4 rounded-md"
          onClick={handleSubmit}
        >
          Go
        </button>
      </div>

      {apiResponse && (
        <audio controls src={'http://localhost:5000/outputs/output_audio.mp3'} style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto' }} > Your browser does not support the audio element. </audio>
      )}

      {notes && (
        <div dangerouslySetInnerHTML={{ __html: notes }} className="markdown-content mx-7" style={{ marginTop: '25px' }} />
      )}

      <div className="flex justify-center items-center mt-4 mb-4">
        {flashcards.length > 1 && (

          <div className="flex items-center justify-center">
            <button className="mx-2 font-black" onClick={goToPreviousFlashcard}>←</button>
            <Flashcard
              key={currentIndex}
              question={flashcards[currentIndex].question}
              answer={flashcards[currentIndex].answer}
            />
            <button className="mx-2 font-black" onClick={goToNextFlashcard}>→</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInput;
