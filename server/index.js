import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./routes/auth.js";
import questions from "./routes/questions.js";
import answers from "./routes/answers.js";
import votes from "./routes/votes.js";
import comments from "./routes/comments.js";
import users from "./routes/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/stackoverflow",
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
};

connectDB();

app.use("/api/v1/auth", auth);
app.use("/api/v1/questions", questions);
app.use("/api/v1/answers", answers);
app.use("/api/v1/votes", votes);
app.use("/api/v1/comments", comments);
app.use("/api/v1/users", users);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ success: false, error: err.message || "Server Error" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
