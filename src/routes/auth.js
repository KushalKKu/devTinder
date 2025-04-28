const express = require('express');
const { validateSignUpData } = require('../utils/validation');
const User = require("../models/user");
const bcrypt = require('bcrypt');
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("Logout Successful!!");
  });

module.exports = authRouter;
