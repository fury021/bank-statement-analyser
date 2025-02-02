const natural = require('natural'); 
const classifier = new natural.BayesClassifier();

// Sample labeled dataset
const trainingData = [
    { text: "salary deposit", category: "Income" },
    { text: "monthly rent", category: "Expense" },
    { text: "grocery shopping", category: "Expense" },
    { text: "loan EMI", category: "EMI" },
    { text: "credit card bill", category: "Expense" },
    { text: "dining at restaurant", category: "Entertainment" },
    { text: "stock investment", category: "Investment" },
];

// Train the classifier
const categorizeTransaction = (description) => {
    // Example categorization logic based on keywords
    if (description.includes("Salary") || description.includes("Bonus")) {
        return "Salary";
    }
    if (description.includes("Groceries") || description.includes("Store")) {
        return "Groceries";
    }
    if (description.includes("ATM Withdrawal")) {
        return "ATM Withdrawal";
    }
    // Add more conditions as per your needs
    return "Others"; // Default category
};

module.exports = { categorizeTransaction };
