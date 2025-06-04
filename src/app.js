const express = require('express');
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();
// Middleware - Proper order is crucial
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173","http://56.228.9.31/"],
  credentials: true,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// SAFE OPTIONS handler that won't trigger path-to-regexp error
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', corsOptions.origin);
    res.header('Access-Control-Allow-Methods', corsOptions.methods.join(','));
    res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(','));
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(204);
  }
  next();
});

//testing for .env
// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");   
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter); 
app.use("/", requestRouter);
app.use("/", userRouter);

// Database connection
connectDB().then(() => {    
    console.log("MongoDB connected successfully");
    app.listen(process.env.PORT, () => {
        console.log("Server is running on port 7777");
    });
}).catch((err) => {
    console.log("MongoDB connection failed", err);
}); 
