const mongoose = require("mongoose");
const Joi = require("joi");

const drinkSchema = new mongoose.Schema({
  name:String,
  ml:Number,
  price:Number,
  user_id:String
})

// export const DrinkModel
exports.DrinkModel = mongoose.model("drinks",drinkSchema);


exports.validatDrink = (_reqBody) => {
  const joiSchema = Joi.object({
    name:Joi.string().min(2).max(150).required(),
    ml:Joi.number().min(1).max(9999).required(),
    price:Joi.number().min(1).max(999).required()
  })
  return joiSchema.validate(_reqBody);
}