const validator = require('validator');
const validateSignUpData = (user) => {
    const { firstName, lastName, email, password } = user;

    if (!firstName || !lastName || !email || !password) {
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

    if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    }
};

exports.validateSignUpData = validateSignUpData;