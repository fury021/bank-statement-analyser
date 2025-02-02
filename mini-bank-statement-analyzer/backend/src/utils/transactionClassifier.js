const natural = require("natural");
const classifier = new natural.BayesClassifier();

// Expanded Training Data
const trainingData = [
    // Existing training data
    { description: "Walmart Superstore", category: "Groceries" },
    { description: "Costco Wholesale", category: "Groceries" },
    { description: "Whole Foods Market", category: "Groceries" },
    { description: "Uber Ride", category: "Transport" },
    { description: "Lyft Trip", category: "Transport" },
    { description: "Bus Pass - Monthly", category: "Transport" },
    { description: "Netflix Subscription", category: "Entertainment" },
    { description: "Spotify Premium", category: "Entertainment" },
    { description: "Hulu Monthly Fee", category: "Entertainment" },
    { description: "McDonald's", category: "Dining" },
    { description: "Starbucks Coffee", category: "Dining" },
    { description: "KFC Takeout", category: "Dining" },
    { description: "Shell Gas Station", category: "Fuel" },
    { description: "BP Gasoline", category: "Fuel" },
    { description: "Chevron Petrol", category: "Fuel" },
    { description: "Direct Deposit - Salary", category: "Income" },
    { description: "Freelance Payment", category: "Income" },
    { description: "PayPal Transfer", category: "Income" },
    { description: "Electricity Bill", category: "Utilities" },
    { description: "Water Bill Payment", category: "Utilities" },
    { description: "Internet - Comcast", category: "Utilities" },
    { description: "Visa Credit Card Payment", category: "Debt Payment" },
    { description: "MasterCard Bill Pay", category: "Debt Payment" },
    { description: "Amazon Order", category: "Shopping" },
    { description: "eBay Purchase", category: "Shopping" },
    { description: "Nike Online Store", category: "Shopping" },
    { description: "Planet Fitness Membership", category: "Health & Fitness" },
    { description: "GNC Vitamin Store", category: "Health & Fitness" },
    { description: "Pharmacy - Walgreens", category: "Health & Fitness" },
    { description: "Home Loan EMI", category: "Loans" },
    { description: "Auto Loan Payment", category: "Loans" },
    { description: "Car Insurance Premium", category: "Insurance" },
    { description: "Health Insurance Fee", category: "Insurance" },
    { description: "Life Insurance Payment", category: "Insurance" },
    { description: "Stock Investment - Robinhood", category: "Investments" },
    { description: "Mutual Funds - Fidelity", category: "Investments" },
    { description: "Bitcoin Buy - Coinbase", category: "Investments" },
    { description: "University Tuition Fee", category: "Education" },
    { description: "Online Course - Udemy", category: "Education" },
    { description: "Bookstore Purchase", category: "Education" },
    { description: "Hospital Bill", category: "Medical" },
    { description: "Doctor's Appointment Fee", category: "Medical" },
    { description: "Prescription Medicine", category: "Medical" },

    // Transaction Data from CSV
    { description: "Opening Balance", category: "Banking" },
    { description: "Salary Credit", category: "Income" },
    { description: "Groceries at Local Store", category: "Groceries" },
    { description: "Electricity Bill", category: "Utilities" },
    { description: "ATM Withdrawal", category: "Cash Withdrawal" },
    { description: "Loan EMI Payment #1234", category: "Loans" },
    { description: "Online Transfer from ABC Inc", category: "Income" },
    { description: "Dining Out: Pizza Place", category: "Dining" },
    { description: "Bank Fee", category: "Banking" },
    { description: "Mobile Recharge", category: "Utilities" },
];

// Train the classifier
trainingData.forEach(({ description, category }) => {
    classifier.addDocument(description.toLowerCase(), category);
});

classifier.train();

// Function to classify transactions
const classifyTransaction = (description) => {
    if (!description) return "Uncategorized"; // Default category if no description
    return classifier.classify(description.toLowerCase());
};

module.exports = { classifyTransaction };
