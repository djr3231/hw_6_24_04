const express = require("express");
const bcrypt = require("bcrypt");
const {auth} = require("../middlewares/auth");
const { UserModel, validateUser, validateLogin, createToken } = require("../models/userModel");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json({ msg: "Users endpoint" });
})

router.get("/userInfo", auth,async(req,res) => {
  try{
    const user = await UserModel.findOne({_id:req.tokenData._id}, {password:0})
    res.json(user)
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }})


router.post("/", async (req, res) => {
  const validBody = validateUser(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    const user = new UserModel(req.body);
    // הצפנה של הסיסמא
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    // שינוי תצוגת הסיסמא לצד לקוח המתכנת
    user.password = "*****";
    res.status(201).json(user);
  }
  catch (err) {
    if (err.code == 11000) {
      return res.status(401).json({ err: "Email already in system", code: 11000 })
    }
    console.log(err);
    res.status(502).json({ err })
  }
})

router.post("/login", async (req, res) => {
  const validBody = validateLogin(req.body);
  if (validBody.error) {
    return res.status(400).json(validBody.error.details);
  }
  try {
    // לבדוק בכלל אם יש משתמש שיש לו אימייל שנשלח בבאדי
    const user = await UserModel.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).json({ err: "Email not found" })
    }
    // לבדוק אם הסיסמא המוצפנת ברשומה של המשתמש שמצאנו לפי המייל תואמת לסיסמא שנשלחה בבאדי
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
      return res.status(401).json({ err: "Password worng" })
    }
    const newToken = createToken(user._id,"user")
    // נשלח טוקן בחזרה למשתמש
    res.json({ token:newToken, role:"user" })
  }
  catch (err) {
    console.log(err);
    res.status(502).json({ err })
  }
})


module.exports = router;