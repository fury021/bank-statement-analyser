import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const fetchTransactions = async () => {
    return axios.get(`${API_URL}/transactions`);
};

export const fetchSummary = async () => {
    return axios.get(`${API_URL}/summary`);
};
