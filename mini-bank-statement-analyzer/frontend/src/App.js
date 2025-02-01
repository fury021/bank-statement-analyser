import React, { useEffect, useState } from "react";
import { fetchTransactions, fetchSummary } from "./api/index";
import FileUpload from './components/FileUpload'; 

function App() {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState([]);

    useEffect(() => {
        fetchTransactions().then((res) => setTransactions(res.data));
        fetchSummary().then((res) => setSummary(res.data));
    }, []);

    return (
        <div>
          <div>
            <h1>Mini Bank Statement Analyzer</h1>
              <FileUpload />
          </div>
            <h1>Mini Bank Statement Analyzer</h1>
            <h2>Transactions</h2>
            <ul>
                {transactions.map((t) => (
                    <li key={t.id}>{t.description}: ${t.amount}</li>
                ))}
            </ul>
            <h2>Summary</h2>
            <ul>
                {summary.map((s, index) => (
                    <li key={index}>{s.category}: ${s.total}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
