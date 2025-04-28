const expreess = require("express");
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require('bcrypt');
const profileRouter = expreess.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send({ message: `${user.firstName} ${user.lastName}'s profile`, user });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
    try{
        const { newPassword } = req.body;
         const newHashPassword = await bcrypt.hash(newPassword, 10);
        const user = req.user;
        user.password = newHashPassword;
        await user.save();
        res.send("Password updated successfully");

    }catch(err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = profileRouter;
