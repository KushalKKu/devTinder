const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough, Password must have minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 ")
        }
    }
},
    age:{
        type: Number,
        required: false,
        min:18,
        max: 100
    },
    gender:{
        type: String,
        lowercase: true,
        trim: true,
        enum:["male","female","other","prefer not to say"],
        default: "prefer not to say"
            },
    profilePicture: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZwFQlGVN6PKDwi5_rGrArjUWFH3XnGcQWsQ&s",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Invalid URL");
            }
        },

    },
    about:{
        type: String,
        default: "This is a default bio.",
        max: 200
    },
    skills:{
        type: [String],
        default: []
    },
 
}, { timestamps: true });

userSchema.index({firstName: 1, lastName: 1});

userSchema.methods.getJwtToken = async function () {
    const user = this;
      const token = await jwt.sign({ _id: user._id }, "Password@123",{ expiresIn: "1h" });
      return token;
}  

userSchema.methods.isPasswordMatch = async function (passwordInput) {
    const user = this;
    const passwordHash = user.password;
   const isMatch= await bcrypt.compare(passwordInput, passwordHash);
   return isMatch;
}

module.exports = mongoose.model("User", userSchema);