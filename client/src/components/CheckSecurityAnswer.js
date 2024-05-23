import React, { useState } from 'react';
import axios from 'axios';
import ResetPassword from './ResetPassword';

const CheckSecurityAnswer = ({ username }) => {
    const [securityAnswer, setSecurityAnswer] = useState('');
    const [step, setStep] = useState(1);

    const handleSecurityAnswerSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/check-security-answer', { username, securityAnswer });
            setStep(2);
        } catch (error) {
            alert('Incorrect security answer. Please try again.');
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your security answer"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                    />
                    <button onClick={handleSecurityAnswerSubmit}>Submit</button>
                </div>
            )}
            {step === 2 && <ResetPassword username={username} />}
        </div>
    );
};

export default CheckSecurityAnswer;
