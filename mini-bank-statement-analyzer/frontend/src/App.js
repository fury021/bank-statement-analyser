import React, { useState } from "react";
import { fetchTransactions, fetchSummary } from "./api/index";
import FileUpload from './components/FileUpload'; 
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './App.css';  // Importing the CSS file

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function App() {
    const [transactions, setTransactions] = useState([]);
    //const [summary, setSummary] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // New state to track if data exists

    const loadData = async () => {
        try {
            const transactionsData = await fetchTransactions();
            //const summaryData = await fetchSummary();
            
            setTransactions(transactionsData.data);
            //setSummary(summaryData.data);
            setDataLoaded(true); // Show transactions only after fetching
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    
    return (
        <div className="app-container">
            <h1 className="app-title">Mini Bank Statement Analyzer</h1>
            <FileUpload onUploadSuccess={loadData} /> {/* Trigger loadData after upload */}
            
            {dataLoaded && ( // Only show data after an upload
                <div className="content-container">
                    <section className="transaction-details">
                        <h2>Transactions</h2>
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    {/* Dynamically generate column headers */}
                                    {transactions.length > 0 &&
                                        Object.keys(transactions[0]).map((key) => (
                                            <th key={key}>{key}</th>
                                        ))
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {/* Dynamically generate rows */}
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id}>
                                        {Object.keys(transaction).map((key) => (
                                            <td key={key}>{transaction[key]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>

                  
                </div>
            )}
        </div>
    );
}

export default App;
