import React, { useState } from 'react';

type FlashcardProps = {
    question: string;
    answer: string;
};

const Flashcard: React.FC<FlashcardProps> = ({ question, answer }) => {
    console.log(question, answer);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="flip-card w-72 h-56 m-5" onClick={handleFlip}>
            <div className={`flip-card-inner h-auto w-max ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className="flip-card-front border border-gray-400 rounded-lg text-lg text-gray-800 text-center">
                    {question}
                </div>
                <div className="flip-card-back border border-gray-400 rounded-lg text-lg text-gray-800 text-center px-5">
                    {answer}
                </div>
            </div>
        </div>
    );
};

export default Flashcard;
