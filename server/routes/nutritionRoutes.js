const express = require("express");
const {
  getNutrition,
  addMeal,
  updateGoal,
  deleteMeal,
  updateMeal
} = require("../controllers/nutritionController");

const router = express.Router();

router.get("/:email", getNutrition);
router.post("/meal", addMeal);
router.put("/goal", updateGoal);
router.delete("/meal/:email/:index", deleteMeal);
router.put("/meal/:email/:index", updateMeal);

module.exports = router;