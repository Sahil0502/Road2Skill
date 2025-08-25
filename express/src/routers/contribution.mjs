import { request, response, Router } from "express";
import mongoose from "mongoose";
import Contribution from "../mongoose/schemas/contribution.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { CommunityPost, Resource, CareerGuidance } from "../mongoose/schemas/community.mjs";

const contributionRouter = Router();

// Create a new contribution
contributionRouter.post("/api/auth/contributions", async (req, res) => {
  const { title, contributorName, domain, techStack, roadmapDescription, roadmapSteps, difficultyLevel, estimatedTimeToComplete, tags } = req.body;
  
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
      domain,
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

// Get a single contribution by ID
contributionRouter.get('/api/auth/contributions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const contribution = await Contribution.findById(id).populate('user', 'username email');
    if (!contribution) {
      return res.status(404).json({ message: 'Contribution not found' });
    }
    res.status(200).json(contribution);
  } catch (error) {
    console.error('Error fetching contribution by ID:', error);
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


// User Progress Routes
contributionRouter.post('/api/user/progress/:roadmapId', async (req, res) => {
  const { roadmapId } = req.params;
  const { stepIndex, completed } = req.body;
  
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let roadmapProgress = user.progress.completedRoadmaps.find(
      rp => rp.roadmapId.toString() === roadmapId
    );

    if (!roadmapProgress) {
      roadmapProgress = {
        roadmapId,
        progress: 0,
        completedSteps: []
      };
      user.progress.completedRoadmaps.push(roadmapProgress);
    }

    if (completed && !roadmapProgress.completedSteps.includes(stepIndex)) {
      roadmapProgress.completedSteps.push(stepIndex);
      await user.addXP(10); // Award XP for completing a step
    } else if (!completed) {
      roadmapProgress.completedSteps = roadmapProgress.completedSteps.filter(s => s !== stepIndex);
    }

    // Calculate progress percentage
    const roadmap = await Contribution.findById(roadmapId);
    roadmapProgress.progress = Math.round((roadmapProgress.completedSteps.length / roadmap.roadmapSteps.length) * 100);

    await user.save();
    res.json({ progress: roadmapProgress.progress, xp: user.progress.totalXP, level: user.progress.level });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user progress
contributionRouter.get('/api/user/progress', async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate('progress.completedRoadmaps.roadmapId');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Community Posts Routes
contributionRouter.get('/api/community/posts', async (req, res) => {
  const { category, search, page = 1, limit = 10 } = req.query;
  
  try {
    let query = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await CommunityPost.find(query)
      .populate('author', 'username profile.firstName profile.lastName profile.avatar')
      .populate('relatedRoadmap', 'title')
      .sort({ isPinned: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CommunityPost.countDocuments(query);
    
    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create community post
contributionRouter.post('/api/community/posts', async (req, res) => {
  try {
    const userId = req.user.id;
    const post = new CommunityPost({
      ...req.body,
      author: userId
    });
    
    await post.save();
    await post.populate('author', 'username profile.firstName profile.lastName profile.avatar');
    
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Resources Routes
contributionRouter.get('/api/resources', async (req, res) => {
  const { category, type, difficulty, search, page = 1, limit = 12 } = req.query;
  
  try {
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (type && type !== 'all') query.type = type;
    if (difficulty && difficulty !== 'all') query.difficulty = difficulty;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('submittedBy', 'username')
      .sort({ 'rating.average': -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Resource.countDocuments(query);
    
    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Career Guidance Routes
contributionRouter.get('/api/career-guidance', async (req, res) => {
  const { category, experienceLevel, search, page = 1, limit = 10 } = req.query;
  
  try {
    let query = {};
    
    if (category && category !== 'all') query.category = category;
    if (experienceLevel && experienceLevel !== 'all') query.experienceLevel = experienceLevel;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { targetRole: { $regex: search, $options: 'i' } }
      ];
    }

    const guidance = await CareerGuidance.find(query)
      .populate('author', 'username profile.firstName profile.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CareerGuidance.countDocuments(query);
    
    res.json({
      guidance,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Profile Routes
contributionRouter.get('/api/user/profile/:userId?', async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    const user = await User.findById(userId)
      .populate('progress.completedRoadmaps.roadmapId', 'title techStack')
      .populate('bookmarkedRoadmaps', 'title techStack')
      .select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
contributionRouter.put('/api/user/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default contributionRouter;