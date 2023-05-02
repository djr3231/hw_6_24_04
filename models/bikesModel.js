const mongoose = require("mongoose");
const Joi = require("joi");

const bikeSchema = new mongoose.Schema({
    company:String,
    model:String,
    year:Number,
    price:Number
  })
  exports.BikeModel = mongoose.model("bikes",bikeSchema);

  exports.validatBike = (_reqBody) => {
    const joiSchema = Joi.object({
    company:Joi.string().min(2).max(150).required(),
    model:Joi.string().min(2).max(150).required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    price:Joi.number().min(1).max(999).required()
    })
    return joiSchema.validate(_reqBody);
  }