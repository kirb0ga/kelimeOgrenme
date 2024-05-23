import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ username }) => {
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/reset-password', { username, newPassword });
            setMessage('Password successfully reset. You will be redirected to the login page.');
            setTimeout(() => {
                navigate('/');
            }, 3000); 
        } catch (error) {
            alert('Error resetting password. Please try again.');
        }
    };

    return (
        <div>
            <input
                type="password"
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
            />
            <button onClick={handlePasswordReset}>Reset Password</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
