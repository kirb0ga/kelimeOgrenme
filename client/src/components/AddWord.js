import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddWord = () => {
    const [formData, setFormData] = useState({
        english: '',
        turkish: '',
        sentences1: '',
        sentences2: '',
        sentences3: '',
        pronunciation: '',
        image: '',
        level: 'A1-A2' 
    });

    const navigate = useNavigate();
    const { english, turkish, sentences1, sentences2, sentences3, pronunciation, image, level } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token')
                }
            };
            const body = JSON.stringify({ english, turkish, sentences1, sentences2, sentences3, pronunciation, image, level });
            await axios.post('http://localhost:5000/api/words', body, config);
            alert('Word added successfully');
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Error adding word:', err.response.data);
            alert('Error adding word');
        }
    };

    return (
        <div>
            <h2>Add Word</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label>English</label>
                    <input type="text" name="english" value={english} onChange={onChange} required />
                </div>
                <div>
                    <label>Turkish</label>
                    <input type="text" name="turkish" value={turkish} onChange={onChange} required />
                </div>
                <div>
                    <label>Sentence 1</label>
                    <input type="text" name="sentences1" value={sentences1} onChange={onChange} required />
                </div>
                <div>
                    <label>Sentence 2</label>
                    <input type="text" name="sentences2" value={sentences2} onChange={onChange} required />
                </div>
                <div>
                    <label>Sentence 3</label>
                    <input type="text" name="sentences3" value={sentences3} onChange={onChange} required />
                </div>
                <div>
                    <label>Pronunciation</label>
                    <input type="text" name="pronunciation" value={pronunciation} onChange={onChange} />
                </div>
                <div>
                    <label>Image</label>
                    <input type="text" name="image" value={image} onChange={onChange} />
                </div>
                <div>
                    <label>Level    </label>
                    <select name="level" value={level} onChange={onChange}>
                        <option value="A1-A2">A1-A2</option>
                        <option value="B1-B2">B1-B2</option>
                        <option value="C1-C2">C1-C2</option>
                    </select>
                </div>
                <button type="submit">Add Word</button>
                <button type="button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button> {}
            </form>
        </div>
    );
};

export default AddWord;
