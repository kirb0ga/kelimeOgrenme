import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Quiz.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment-timezone';

const Quiz = () => {
    const [quizWords, setQuizWords] = useState([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [options, setOptions] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [timer, setTimer] = useState(null);
    const navigate = useNavigate();

    const generateOptions = useCallback(async (word) => {
        try {
            const res = await axios.get('http://localhost:5000/api/words/random', {
                headers: {
                    'x-auth-token': localStorage.getItem('token')
                }
            });
            const randomWords = res.data.map(w => w.turkish);
            const options = [word.turkish, ...randomWords].sort(() => Math.random() - 0.5);
            setOptions(options);
        } catch (err) {
            console.error('Fetch random words error:', err);
        }
    }, []);

    const startTimer = (endTime) => {
        const interval = setInterval(() => {
            const now = moment().tz('Europe/Istanbul');
            const duration = moment.duration(endTime.diff(now));

            if (duration.asSeconds() <= 0) {
                clearInterval(interval);
                setTimer(null);
                window.location.reload();
            } else {
                setTimer(`${duration.hours()}h ${duration.minutes()}m ${duration.seconds()}s`);
            }
        }, 1000);
    };

    useEffect(() => {
        const fetchQuizWords = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/quiz', {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                });

                if (res.data.remainingTime) {
                    const nextTime = moment().add(res.data.remainingTime, 'seconds').tz('Europe/Istanbul');
                    setRemainingTime(nextTime);
                    startTimer(nextTime);
                } else {
                    setQuizWords(res.data);
                    generateOptions(res.data[0]);
                }
            } catch (err) {
                console.error('Fetch quiz words error:', err);
            }
        };

        fetchQuizWords();
    }, [generateOptions]);

    const handleOptionClick = async (option) => {
        const currentWord = quizWords[currentWordIndex];
        setSelectedOption(option);
        if (option === currentWord.turkish) {
            setFeedback('Correct');
            setShowDetails(true);
            await updateWordStatus(currentWord.id, true);
        } else {
            setFeedback(`Incorrect (Correct Answer: ${currentWord.turkish})`);
            await updateWordStatus(currentWord.id, false);
        }
    };

    const updateWordStatus = async (wordId, isCorrect) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/quiz/update', { wordId, isCorrect }, {
                headers: {
                    'x-auth-token': token
                }
            });
        } catch (err) {
            console.error('Update word status error:', err);
        }
    };

    const handleNextQuestion = () => {
        setFeedback(null);
        setShowDetails(false);
        setSelectedOption(null);
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < quizWords.length) {
            setCurrentWordIndex(nextIndex);
            generateOptions(quizWords[nextIndex]);
        } else {
            handleCompleteQuiz();
        }
    };

    const handleCompleteQuiz = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/quiz/complete', {}, {
                headers: {
                    'x-auth-token': token
                }
            });
            alert('You have completed the quiz for today!');
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Complete quiz error:', err);
        }
    };

    if (remainingTime !== null) {
        return (
            <div className="quiz-container">
                <h2>Next quiz available in:</h2>
                <div className="timer">{timer}</div>
                <button onClick={() => navigate('/dashboard')} className="return-button">Return to Dashboard</button>
            </div>
        );
    }

    if (quizWords.length === 0) {
        return <div>Loading...</div>;
    }

    const currentWord = quizWords[currentWordIndex];

    return (
        <div className="quiz-container">
            <h2>Quiz</h2>
            <div className="question">{currentWord.english}</div>
            <div className="progress">{currentWordIndex + 1}/{quizWords.length}</div>
            <div className="options">
                {options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        disabled={selectedOption !== null}
                        className={`option-button ${selectedOption === option ? (option === currentWord.turkish ? 'correct' : 'incorrect') : ''}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {feedback && (
                <div className="feedback">
                    <p>{feedback}</p>
                    {showDetails && feedback === 'Correct' && (
                        <div className="details">
                            <img src={currentWord.image} alt={currentWord.english} />
                            <p>Sentence 1: {currentWord.sentences1}</p>
                            <p>Sentence 2: {currentWord.sentences2}</p>
                            <p>Sentence 3: {currentWord.sentences3}</p>
                            <p>Pronunciation: {currentWord.pronunciation}</p>
                        </div>
                    )}
                    <button onClick={handleNextQuestion}>Next</button>
                </div>
            )}
        </div>
    );
};

export default Quiz;
