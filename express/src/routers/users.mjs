import { Router } from "express";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helper.mjs";
import passport from "passport";

const userRouter = Router();

// Middleware for authentication
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ msg: 'Unauthorized. Please login.' });
};

// Middleware for validating user input
const validateUser = (req, res, next) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).send({ msg: "Username and password are required." });
  }

  // Validate username length
  if (username.length < 5 || username.length > 10) {
    return res.status(400).send({ msg: "Username must be between 5 and 10 characters long." });
  }

  // Validate password complexity
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[a-zA-Z\d!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      msg: "Password must be at least 8 characters long, contain at least one letter, one number, and one special character.",
    });
  }

  next();
};

// Route for creating a new user
userRouter.post("/api/users", validateUser, async (req, res) => {
  const { body } = req;
  try {
    body.password = hashPassword(body.password);
    const newUser = new User(body);
    const savedUser = await newUser.save();
    return res.status(201).send({ msg: "User created successfully." });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) { // Duplicate key error (e.g., user already exists)
      return res.status(400).send({ msg: "User already exists." });
    }
    return res.status(500).send({ msg: "Server error. Please try again later." });
  }
});

// Route for retrieving a user by username
userRouter.get("/api/users/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).send({ msg: "User not found." });
    }
    return res.send(user);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ msg: "Server error. Please try again later." });
  }
});

// Route for getting user progress
userRouter.get("/api/user/progress", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('progress');
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    return res.json(user.progress);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

// Route for starting a roadmap (add to user's progress)
userRouter.post("/api/user/progress/start/:roadmapId", requireAuth, async (req, res) => {
  const { roadmapId } = req.params;
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Check if roadmap is already in progress
    const existingProgress = user.progress.completedRoadmaps.find(
      r => r.roadmapId.toString() === roadmapId
    );

    if (existingProgress) {
      return res.status(400).json({ msg: "Roadmap already started." });
    }

    // Add new roadmap to progress
    user.progress.completedRoadmaps.push({
      roadmapId: roadmapId,
      progress: 0,
      completedSteps: []
    });

    await user.save();
    return res.json({ msg: "Roadmap started successfully." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

// Route for updating step progress
userRouter.post("/api/user/progress/:roadmapId", requireAuth, async (req, res) => {
  const { roadmapId } = req.params;
  const { stepIndex, completed } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }

    // Find the roadmap in user's progress
    const roadmapProgress = user.progress.completedRoadmaps.find(
      r => r.roadmapId.toString() === roadmapId
    );

    if (!roadmapProgress) {
      return res.status(404).json({ msg: "Roadmap not found in user progress." });
    }

    // Update completed steps
    if (completed) {
      if (!roadmapProgress.completedSteps.includes(stepIndex)) {
        roadmapProgress.completedSteps.push(stepIndex);
      }
    } else {
      roadmapProgress.completedSteps = roadmapProgress.completedSteps.filter(
        step => step !== stepIndex
      );
    }

    // Update progress percentage (you'll need to get total steps from roadmap)
    // For now, assuming you pass totalSteps in the request
    const { totalSteps } = req.body;
    if (totalSteps) {
      roadmapProgress.progress = Math.round(
        (roadmapProgress.completedSteps.length / totalSteps) * 100
      );
    }

    await user.save();
    return res.json({
      msg: "Progress updated successfully.",
      progress: roadmapProgress.progress,
      completedSteps: roadmapProgress.completedSteps
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

export default userRouter;
