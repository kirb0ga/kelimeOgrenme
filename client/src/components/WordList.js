import React, { useEffect, useState } from 'react';
import axios from 'axios';

const WordList = () => {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const config = {
                    headers: {
                        'x-auth-token': localStorage.getItem('token')
                    }
                };
                const res = await axios.get('http://localhost:5000/api/words', config);
                setWords(res.data);
                setLoading(false);
            } catch (err) {
                console.error('Fetch words error:', err.response.data);
                setLoading(false);
            }
        };

        fetchWords();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (words.length === 0) {
        return <div>No words available.</div>;
    }

    return (
        <div>
            <h2>Word List</h2>
            <ul>
                {words.map(word => (
                    <li key={word.id}>
                        <p><strong>English:</strong> {word.english}</p>
                        <p><strong>Turkish:</strong> {word.turkish}</p>
                        <p><strong>Pronunciation:</strong> {word.pronunciation}</p>
                        <p><strong>Sentence 1:</strong> {word.sentences1}</p>
                        <p><strong>Sentence 2:</strong> {word.sentences2}</p>
                        <p><strong>Sentence 3:</strong> {word.sentences3}</p>
                        {word.image && (
                            <div>
                                <p><strong>Image:</strong></p>
                                <img src={word.image} alt={word.english} style={{ width: '200px', height: 'auto' }} />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default WordList;
