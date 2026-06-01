const express = require("express");
const router = require("express").Router();

const Plan = require("../models/Plan");
const Member = require("../models/Member");

const { protect } = require("../middleware/authMiddleware");


// ✅ GET ALL PLANS
router.get("/", protect, async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate("assignedMembers", "name");

    res.json(plans);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ✅ CREATE PLAN
router.post("/", protect, async (req, res) => {
  try {

    const plan = new Plan({
      ...req.body,
      trainer: req.user._id,
    });

    await plan.save();

    res.status(201).json(plan);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ✅ UPDATE PLAN
router.put("/:id", protect, async (req, res) => {
  try {

    const updated = await Plan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ✅ DELETE PLAN
router.delete("/:id", protect, async (req, res) => {
  try {

    await Plan.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Plan deleted",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// ✅ ASSIGN PLAN
router.put(
  "/assign/:planId/:memberId",
  protect,
  async (req, res) => {
    try {

      const plan = await Plan.findById(
        req.params.planId
      );

      const member = await Member.findById(
        req.params.memberId
      );

      if (!plan || !member) {
        return res.status(404).json({
          message: "Not found",
        });
      }

      if (
        !plan.assignedMembers.includes(
          member._id
        )
      ) {
        plan.assignedMembers.push(
          member._id
        );
      }
      if (!member.assignedPlans) {
        member.assignedPlans = [];
      }

      const alreadyAssigned =
        member.assignedPlans.find(
          (p) => p._id.toString() === plan._id.toString()
        );

      if (!alreadyAssigned) {

        member.assignedPlans.push({
          ...plan.toObject(),
          completed: false,
        });

      }

      await member.save();
      await plan.save();

      res.json({
        message: "Plan assigned",
      });

    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ✅ COMPLETE ASSIGNED PLAN
router.put(
  "/complete/:userId/:planId",
  async (req, res) => {

    try {

      const { userId, planId } =
        req.params;

      const member =
        await Member.findById(userId);

      if (!member) {

        return res.status(404).json({
          message: "Member not found",
        });

      }

      member.assignedPlans =
        member.assignedPlans.map(
          (plan) => {

            if (
              plan._id.toString() ===
              planId
            ) {

              return {
                ...plan,
                completed: true,
              };
            }

            return plan;
          }
        );

      await member.save();

      res.json({
        message:
          "Plan completed successfully",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server Error",
      });

    }
  }
);

module.exports = router;