import React, { useState } from "react";
import { fetchTransactions } from "./api/index";
import FileUpload from "./components/FileUpload"; 
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Register the point element for line charts
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./App.css";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement, // Ensure PointElement is registered
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function App() {
  const [transactions, setTransactions] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions"); // "transactions", "summary", "chart", "lineChart"

  // Fetch transactions from backend and compute Amount if necessary
  const loadData = async () => {
    try {
      const transactionsData = await fetchTransactions();
      // Process the transactions to compute "Amount" if needed
      const processed = transactionsData.data.map((tx) => {
        // If deposit and withdrawal exist, compute Amount; otherwise, use existing Amount
        if (tx.deposit !== undefined && tx.withdrawal !== undefined) {
          const deposit = parseFloat(tx.deposit) || 0;
          const withdrawal = parseFloat(tx.withdrawal) || 0;
          return { ...tx, Amount: deposit - withdrawal };
        } else if (tx.Amount !== undefined) {
          return { ...tx, Amount: parseFloat(tx.Amount) || 0 };
        }
        return tx;
      });
      setTransactions(processed);
      setDataLoaded(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calculate summary (total income and total expense) based on computed Amount
  const calculateSummary = () => {
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach((tx) => {
      if (tx.Amount > 0) {
        totalIncome += tx.Amount;
      } else {
        totalExpense += Math.abs(tx.Amount);
      }
    });
    return { totalIncome, totalExpense };
  };

  // Generate Pie Chart data based on category totals.
  const generatePieChartData = () => {
    const categoryTotals = {};
    transactions.forEach((tx) => {
      // Use "Category" field from the transaction (adjust field name as needed)
      const category = tx.Category || tx.category || "Uncategorized";
      categoryTotals[category] =
        (categoryTotals[category] || 0) + Math.abs(tx.Amount || 0);
    });

    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);

    return {
      labels,
      datasets: [
        {
          label: "Transaction Categories",
          data,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4CAF50",
            "#FF5733",
            "#8e44ad",
          ],
          hoverOffset: 4,
        },
      ],
    };
  };

  // Generate Line Chart data for net balance over time.
  const generateLineChartData = () => {
    // Sort transactions by date (using "transaction_date" or "Date")
    const sortedTx = [...transactions].sort((a, b) => {
      const dA = new Date(a.transaction_date || a.Date);
      const dB = new Date(b.transaction_date || b.Date);
      return dA - dB;
    });

    const labels = [];
    const data = [];
    let balance = 0;
    sortedTx.forEach((tx) => {
      const date = new Date(tx.transaction_date || tx.Date);
      labels.push(date.toLocaleDateString());
      balance += tx.Amount || 0;
      data.push(balance);
    });

    return {
      labels,
      datasets: [
        {
          label: "Net Account Balance",
          data,
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    };
  };

  const summaryData = calculateSummary();

  return (
    <div className="app-container">
      <h1 className="app-title">Mini Bank Statement Analyzer</h1>
      <FileUpload onUploadSuccess={loadData} />
      
      <div className="tabs">
        <button
          onClick={() => setActiveTab("transactions")}
          className={activeTab === "transactions" ? "active" : ""}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={activeTab === "summary" ? "active" : ""}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab("chart")}
          className={activeTab === "chart" ? "active" : ""}
        >
          Chart
        </button>
        <button
          onClick={() => setActiveTab("lineChart")}
          className={activeTab === "lineChart" ? "active" : ""}
        >
          Line Graph
        </button>
      </div>

      {dataLoaded && (
        <div className="content-container">
          {activeTab === "transactions" && (
            <section className="transaction-details">
              <h2>Transactions</h2>
              <table className="transaction-table">
                <thead>
                  <tr>
                    {transactions.length > 0 &&
                      Object.keys(transactions[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      {Object.keys(tx).map((key) => (
                        <td key={key}>{tx[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          )}

          {activeTab === "summary" && (
            <section className="summary-details">
              <h2>Summary</h2>
              <div>
                <p>Total Income: {summaryData.totalIncome}</p>
                <p>Total Expense: {summaryData.totalExpense}</p>
              </div>
            </section>
          )}

          {activeTab === "chart" && (
            <section className="chart-details">
              <h2>Category Pie Chart</h2>
              <div className="chart-wrapper">
                <Pie data={generatePieChartData()} options={{ maintainAspectRatio: false }} />
              </div>
            </section>
          )}

          {activeTab === "lineChart" && (
            <section className="line-chart-details">
              <h2>Net Account Balance Line Graph</h2>
              <div className="chart-wrapper">
                <Line key={activeTab} data={generateLineChartData()} options={{ maintainAspectRatio: false }} />
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
