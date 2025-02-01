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
    const [summary, setSummary] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false); // New state to track if data exists

    const loadData = async () => {
        try {
            const transactionsData = await fetchTransactions();
            const summaryData = await fetchSummary();
            
            setTransactions(transactionsData.data);
            setSummary(summaryData.data);
            setDataLoaded(true); // Show transactions only after fetching
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    // Function to categorize transactions based on their category
    const categorizeTransactions = () => {
        return transactions.reduce((categories, transaction) => {
            if (!categories[transaction.category]) {
                categories[transaction.category] = [];
            }
            categories[transaction.category].push(transaction);
            return categories;
        }, {});
    };

    // Function to calculate the summary (total credits, total debits, net)
    const calculateSummary = () => {
        let totalCredits = 0;
        let totalDebits = 0;

        transactions.forEach((transaction) => {
            if (transaction.amount > 0) {
                totalCredits += transaction.amount;
            } else {
                totalDebits += Math.abs(transaction.amount);
            }
        });

        return {
            totalCredits,
            totalDebits,
            net: totalCredits - totalDebits,
        };
    };

    const categorizedTransactions = categorizeTransactions();
    const { totalCredits, totalDebits, net } = calculateSummary();

    // Prepare data for the bar chart
    const chartData = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount',
                data: [totalCredits, totalDebits],
                backgroundColor: ['#4CAF50', '#FF6347'], // Green for income, Red for expenses
                borderColor: ['#388E3C', '#D32F2F'],
                borderWidth: 1,
            },
        ],
    };

    // Prepare data for the pie chart (category-wise distribution)
    const categoryData = Object.keys(categorizedTransactions).map(category => {
        const totalCategoryAmount = categorizedTransactions[category].reduce((sum, transaction) => sum + transaction.amount, 0);
        return { category, total: totalCategoryAmount };
    });

    const pieChartData = {
        labels: categoryData.map(item => item.category),
        datasets: [
            {
                data: categoryData.map(item => item.total),
                backgroundColor: [
                    '#FF6347', '#4CAF50', '#FFD700', '#1E90FF', '#8A2BE2', '#FF4500', '#32CD32', '#D2691E'
                ], // Different colors for each category
                borderColor: '#fff',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Expense vs. Income',
            },
        },
        maintainAspectRatio: false, // Prevents auto scaling
    };

    const pieChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Transaction Categories Breakdown',
            },
            legend: {
                position: 'top',
            },
        },
        maintainAspectRatio: false, // Prevents auto scaling
    };

    return (
        <div className="app-container">
            <h1 className="app-title">Mini Bank Statement Analyzer</h1>
            <FileUpload onUploadSuccess={loadData} /> {/* Trigger loadData after upload */}
            
            {dataLoaded && ( // Only show data after an upload
                <div className="content-container">
                    <section className="transaction-details">
                        <h2>Transactions</h2>
                        {Object.keys(categorizedTransactions).map((category) => (
                            <div key={category} className="category-section">
                                <h3>{category}</h3>
                                <ul className="transaction-list">
                                    {categorizedTransactions[category].map((t) => (
                                        <li key={t.id} className="transaction-item">
                                            {t.description}: ${t.amount}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </section>

                    <section className="summary">
                        <h2>Summary</h2>
                        <ul className="summary-list">
                            <li>Total Credits: ${totalCredits}</li>
                            <li>Total Debits: ${totalDebits}</li>
                            <li>Net: ${net}</li>
                        </ul>
                    </section>

                    <section className="charts">
                        <h2>Expense vs. Income Visualization</h2>
                        <div className="chart-container">
                            <Bar data={chartData} options={chartOptions} />
                        </div>

                        <h2>Transaction Categories Breakdown</h2>
                        <div className="chart-container">
                            <Pie data={pieChartData} options={pieChartOptions} />
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}

export default App;
