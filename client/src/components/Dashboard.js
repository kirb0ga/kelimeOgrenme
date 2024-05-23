import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; 

const Dashboard = () => {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/auth/user', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setUsername(res.data.username);
            } catch (err) {
                console.error('Fetch username error:', err);
            }
        };

        fetchUsername();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {username}</span>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
            <div className="menu">
                <button onClick={() => navigate('/add-word')}>Add Word</button>
                <button onClick={() => navigate('/quiz')}>Quiz</button>
                <button onClick={() => navigate('/report')}>Report</button>
                <button onClick={() => navigate('/settings')}>Settings</button>
            </div>
        </div>
    );
};

export default Dashboard;
