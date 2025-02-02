Updated features to add:
1.) Dynamic file reading not hardcoded.
2.) tabs for diff things like summary, transaction separate from the upload page.
3.) Use ML i.e. NLP to do the categorization of the transactions.






This is a well-structured project that will demonstrate your full-stack development skills. Here’s how I suggest breaking it down:

Project Plan
Day 1: Backend Development
Set Up Project Structure

Initialize a Git repository.
Set up a backend (Flask/FastAPI for Python, Express.js for Node).
Choose and configure a database (SQLite for simplicity, PostgreSQL for scalability).
Implement Core API Endpoints

/api/upload-statement (POST) – Accepts CSV/JSON file, parses transactions, and stores them.
/api/transactions (GET) – Retrieves all transactions.
/api/summary (GET) – Aggregates income, expenses, net balance.
Transaction Categorization

Implement basic rule-based categorization (e.g., “Salary” → Income, “Rent” → Expense).
Store categories in the database.
Security Considerations

Validate input formats (CSV structure, JSON schema).
Basic authentication (JWT or session-based).
Sanitize inputs to prevent injection attacks.
Day 2: Frontend & Deployment
Frontend Development (React/Vue/Vanilla JS)

Create a simple form to upload CSV/JSON.
Fetch and display transactions in a table.
Show a summary of income, expenses, and net balance.
Implement basic error handling (e.g., invalid file format, server errors).
Enhancements

Add data visualization (e.g., bar/line charts for income/expenses).
Implement file format validation on the client side.
Documentation & Deployment

Write a README with setup instructions.
Create an architecture diagram (using draw.io or similar).
(Optional) Deploy using Docker or a cloud service (e.g., Heroku, Netlify).
