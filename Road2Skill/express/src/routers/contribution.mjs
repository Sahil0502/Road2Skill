import { request, response, Router } from "express";
import mongoose from "mongoose";
import Contribution from "../mongoose/schemas/contribution.mjs";
import { User } from "../mongoose/schemas/user.mjs";

const contributionRouter = Router();

// Create a new contribution
contributionRouter.post("/api/auth/contributions", async (req, res) => {
  const { title, contributorName, techStack, roadmapDescription, roadmapSteps, difficultyLevel, estimatedTimeToComplete, tags } = req.body;
  
  try {
    // Assuming req.user.id is correctly set up by your authentication middleware
    const userId = req.user.id;
    console.log(userId);

    // Find the user making the contribution
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure tags is an array
    const tagsArray = Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : []);

    // Create a new contribution linked to the user
    const contribution = new Contribution({
      title,
      contributorName,
      techStack,
      roadmapDescription,
      roadmapSteps,
      difficultyLevel,
      estimatedTimeToComplete,
      tags: tagsArray, // Use the processed tags array
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

// Get all roadmaps with filtering and searching
contributionRouter.get('/api/roadmaps', async (req, res) => {
  const { category, search } = req.query;

  try {
    // Build the query object
    let query = {};

    if (category) {
      query.techStack = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { roadmapDescription: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const roadmaps = await Contribution.find(query);
    res.status(200).json(roadmaps);
  } catch (error) {
    console.error('Error fetching roadmaps:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Additional route in routes/roadmapRouter.js
contributionRouter.get('/api/roadmaps/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const roadmap = await Contribution.findById(id);
    if (!roadmap) {
      return res.status(404).json({ message: 'Roadmap not found' });
    }
    res.status(200).json(roadmap);
  } catch (error) {
    console.error('Error fetching roadmap by ID:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});


export default contributionRouter;