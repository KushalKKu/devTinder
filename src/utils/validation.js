const validator = require('validator');
const validateSignUpData = (user) => {
    const { firstName, lastName, emailId, password } = user.body;

    if (!firstName || !lastName || !emailId || !password) {
        throw new Error("All fields are required");
    }

    if (firstName.length < 3 || firstName.length > 30) {
        throw new Error("First name must be between 3 and 30 characters");
    }

    if (validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }) === false) {
        throw new Error("Password is not strong enough, Password must have minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address");
    }
};


const validateEditProfileData = (req) => {
    const allowedEditFields = [
      "firstName",
      "lastName",
      "emailId",
      "photoUrl",
      "gender",
      "age",
      "about",
      "skills",
    ];
 
    const isEditAllowed = Object.keys(req.body).every((field) =>
      allowedEditFields.includes(field)
    );
  
    return isEditAllowed;
  };;

module.exports = {validateSignUpData,validateEditProfileData};