import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import AddWord from './components/AddWord'; 
import Quiz from './components/Quiz';
import Report from './components/Report';
import Settings from './components/Settings';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route exact path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/add-word" element={<AddWord />} /> {}
                    <Route path="/quiz" element={<Quiz />} /> {}
                    <Route path="/report" element={<Report />} /> {}
                    <Route path="/settings" element={<Settings />} /> {}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
