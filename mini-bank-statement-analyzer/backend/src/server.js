const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const transactionsRoutes = require("./routes/transactions");
const summaryRoutes = require("./routes/summary");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionsRoutes);
app.use("/api/summary", summaryRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
