import { request, response, Router } from "express";
import mongoose from "mongoose";
import Contribution from "../mongoose/schemas/contribution.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const contributionRouter = Router();

// Create a new contribution
contributionRouter.post("/api/auth/contributions", async (req, res) => {
  const { title, contributorName, techStack, roadmapDescription, roadmapSteps, difficultyLevel, estimatedTimeToComplete } = req.body;
   // Assuming user ID is available from the authenticated user context
    

  try {
    const userId = req.user.id;
    console.log(userId);
    // Find the user making the contribution
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new contribution linked to the user
    const contribution = new Contribution({
      title,
      contributorName,
      techStack,
      roadmapDescription,
      roadmapSteps,
      difficultyLevel,
      estimatedTimeToComplete,
      user: user._id, // Link to the user
    });

    const newContribution = await contribution.save();
    res.status(201).json(newContribution);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});



// Get all contributions with user details
contributionRouter.get("/api/auth/contributions", async (req, res) => {
    try {
      const contributions = await Contribution.find().populate("user", "username email");
      res.json(contributions);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


export default contributionRouter;

