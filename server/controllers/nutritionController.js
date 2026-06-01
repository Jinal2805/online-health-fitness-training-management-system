const Nutrition = require("../models/Nutrition");

// GET
const getNutrition = async (req, res) => {
  const { email } = req.params;

  let data = await Nutrition.findOne({ email });

  if (!data) {
    data = await Nutrition.create({ email, meals: [] });
  }

  res.json(data);
};

// ADD MEAL
const addMeal = async (req, res) => {
  try {
    // console.log("BODY:", req.body);

    const { email, name, calories, type } = req.body;

    // 🔹 Step 1: Find document
    let nutrition = await Nutrition.findOne({ email });

    // 🔹 Step 2: If not exist → create fresh (clean structure)
    if (!nutrition) {
      nutrition = new Nutrition({
        email,
        goal: "Weight Loss",
        meals: []
      });
    }

    // 🔹 Step 3: FORCE RESET meals array if corrupted
    if (!Array.isArray(nutrition.meals)) {
      nutrition.meals = [];
    }

    // 🔹 Step 4: Push new meal safely
    nutrition.meals.push({
      name: String(name),
      calories: Number(calories),
      type: String(type)
    });

    // 🔹 Step 5: Save
    await nutrition.save();

    res.json(nutrition);

  } catch (err) {
    console.error("ADD MEAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

// UPDATE GOAL
const updateGoal = async (req, res) => {
  const { email, goal } = req.body;

  const updated = await Nutrition.findOneAndUpdate(
    { email },
    { goal },
    { new: true, upsert: true }
  );

  res.json(updated);
};


// DELETE MEAL
const deleteMeal = async (req, res) => {
  const { email, index } = req.params;

  const nutrition = await Nutrition.findOne({ email });
  nutrition.meals.splice(index, 1);
  await nutrition.save();

  res.json(nutrition);
};

// UPDATE MEAL
const updateMeal = async (req, res) => {
  const { email, index } = req.params;
  const { name, calories, type } = req.body;

  const nutrition = await Nutrition.findOne({ email });

  nutrition.meals[index] = { name, calories: Number(calories), type };
  await nutrition.save();

  res.json(nutrition);
};

module.exports = { getNutrition, addMeal, updateGoal, deleteMeal, updateMeal };

