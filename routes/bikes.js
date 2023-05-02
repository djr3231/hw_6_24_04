const express = require("express");
const {BikeModel, validatBike} = require("../models/bikesModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async(req,res) => {
  try{
    const perPage = 5;
    const page = req.query.page - 1 || 0;
    const data = await BikeModel
    .find({})
    .limit(perPage)
    .skip(page * perPage)
    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

router.get("/singel/:id", async(req,res) => {
  try{
    const data = await BikeModel
    .findOne({_id: req.params.id})

    if(!data) {
      return res.status(404).json({message: "bike not found"});
    }

    res.json(data);

  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})



//? auth -> בודק אם יש טוקן
router.post("/", auth ,async(req,res) => {
  //* בודק שהמידע שמגיע מצד לקוח תקין לפני שמעביר
  //* למסד נתונים
  const validBody = validatBike(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    //* לייצר רשומה חדשה מהבאדי
    const bike = new BikeModel(req.body);
    //* מוסיף לרשומה את האיי די של המשתמש
    //*  ששלח את הבקשה מהטוקן שנשלח אליה
    bike.user_id = req.tokenData._id
    await bike.save();
    res.status(201).json(bike);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

//todo עדכון רשומה לפי איי די
router.put("/:id", async(req,res) => {
  const validBody = validatBike(req.body);
  if(validBody.error){
    return res.status(400).json(validBody.error.details)
  }
  try{
    const id = req.params.id;
    const data = await BikeModel.updateOne({_id:id},req.body);
    // modfiedCount:1
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

//! למחוק רשומה לפי איי די
router.delete("/:id", async(req,res) => {
  try{
    const id = req.params.id;
    const data = await BikeModel.deleteOne({_id:id});
    // deletedCount:1
    res.json(data);
  }
  catch(err){
    console.log(err);
    res.status(502).json({err})
  }
})

module.exports = router;