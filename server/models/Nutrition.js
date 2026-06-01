const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema({
  email: String,
  goal: {
    type: String,
    default: "Weight Loss"
  },
 meals: {
  type: [
    {
      name: { type: String },
      calories: { type: Number },
      type: { type: String }
    }
  ],
  default: []
}

});

module.exports = mongoose.models.Nutrition || mongoose.model("Nutrition", nutritionSchema);