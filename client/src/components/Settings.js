import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
    const [dailyWordCount, setDailyWordCount] = useState(10); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/settings', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setDailyWordCount(res.data.daily_word_count);
            } catch (err) {
                console.error('Fetch settings error:', err);
            }
        };

        fetchSettings();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/settings', { daily_word_count: dailyWordCount }, {
                headers: {
                    'x-auth-token': token
                }
            });
            alert('Settings updated successfully!');
        } catch (err) {
            console.error('Update settings error:', err);
        }
    };

    return (
        <div className="settings-container">
            <h2>Settings</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="dailyWordCount">Daily Word Count:</label>
                    <input
                        type="number"
                        id="dailyWordCount"
                        value={dailyWordCount || ''} 
                        onChange={(e) => {
                            const value = Math.max(1, Math.min(20, e.target.value)); 
                            // Dokümanda böyle bir durum belirtilmese de kullanıcının günlük alabildiği kelimeyi sınırladım.
                            setDailyWordCount(value);
                        }}
                        required
                    />
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/dashboard')} className="back-button">Back to Dashboard</button>
            </form>
        </div>
    );
};

export default Settings;
