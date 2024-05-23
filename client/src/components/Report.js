import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import './Report.css';

const Report = () => {
    const [reportData, setReportData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/api/report', {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setReportData(res.data);
            } catch (err) {
                console.error('Error fetching report:', err);
            }
        };

        fetchReport();
    }, []);

    const downloadPdf = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Level', 'Total Words', 'Known Words', 'Success Rate']],
            body: reportData.map(row => [
                row.level,
                row.totalWords,
                row.knownWords,
                `${row.successRate.toFixed(2)}%`
            ])
        });
        doc.save('report.pdf');
    };

    return (
        <div className="report-container">
            <h2>Learning Report</h2>
            <table>
                <thead>
                    <tr>
                        <th>Level</th>
                        <th>Total Words</th>
                        <th>Known Words</th>
                        <th>Success Rate</th>
                    </tr>
                </thead>
                <tbody>
                    {reportData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.level}</td>
                            <td>{row.totalWords}</td>
                            <td>{row.knownWords}</td>
                            <td>{row.successRate.toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={downloadPdf}>Download Report as PDF</button>
            <button onClick={() => navigate('/dashboard')} className="return-button">Back to Dashboard</button>
        </div>
    );
};

export default Report;
