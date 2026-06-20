import applicationRoute from "./routes/application.route.js";
import jobRoute from "./routes/job.route.js";
import companyRoute from "./routes/company.route.js";
import userRoute from "./routes/user.route.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Job Portal Backend Running");
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});