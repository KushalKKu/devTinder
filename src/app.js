const express = require('express');
const connectDB = require("./config/database")
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require('./utils/validation');
const bcrypt = require('bcrypt');
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth")
app.use(cookieParser());


app.use(express.json())

app.post("/signup", async (req, res) => {
    const user = req.body; 
    try {     
        validateSignUpData(user);
        user.password = await bcrypt.hash(user.password, 10);
        const newUser = new User({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
        });
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(400).json({ message: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }       
        const isMatch = await user.isPasswordMatch(password);  
        console.log(isMatch);   
        if(isMatch) {
             const token = await user.getJwtToken(); 
            res.cookie("token", token)
            res.status(200).json({ message: "Login successful", user });
        }
        else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error logging in" });
    }
})    

app.get("/profile", userAuth,  async (req, res) => {
    try {
        const user = req.user;
        res.send({message: `${user.firstName} ${user.lastName}'s profile`, user});
      } catch (err) {
        res.status(400).send("ERROR : " + err.message);
      }
    });

app.get("/sendConnectionRequest/:id", userAuth, async (req, res) => {
})

connectDB().then(() => {    
    console.log("MongoDB connected successfully");
    app.listen(7777,()=>{
        console.log("Server is running on port 7777")
    })
}).catch((err) => {
    console.log("MongoDB connection failed", err)
})
