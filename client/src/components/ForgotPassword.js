import React, { useState } from 'react';
import axios from 'axios';
import CheckSecurityAnswer from './CheckSecurityAnswer';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [securityQuestion, setSecurityQuestion] = useState('');
    const [step, setStep] = useState(1);

    const handleUsernameSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { username });
            setSecurityQuestion(response.data.securityQuestion);
            setStep(2);
        } catch (error) {
            alert('User not found. Please register.');
        }
    };

    return (
        <div>
            {step === 1 && (
                <div>
                    <h2>Forgot Password</h2>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleUsernameSubmit}>Submit</button>
                </div>
            )}
            {step === 2 && (
                <div>
                    <h2>Security Question</h2>
                    <p>{securityQuestion}</p>
                    <CheckSecurityAnswer username={username} />
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
