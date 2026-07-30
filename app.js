const express = require("express");
const cors = require("cors");

const app = express();

const courseRoutes = require("./backend/routes/courses");
const assignmentRoutes = require("./backend/routes/assignment");

app.use(cors());
app.use(express.json());

app.use("/", courseRoutes);
app.use("/", assignmentRoutes);

app.listen(5000, () => {
    console.log("Server running...");
});