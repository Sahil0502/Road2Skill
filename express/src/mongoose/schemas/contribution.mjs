// models/Contribution.js
import mongoose, { Schema } from "mongoose";

const contributionSchema = new Schema({
  title: {
    type: mongoose.Schema.Types.String,
    required: true,
    maxlength: 100,
  },
  contributorName: {
    type: mongoose.Schema.Types.String,
    maxlength: 50,
  },
  domain: {
    type: mongoose.Schema.Types.String,
    required: true,
    enum: [
      'web-development',
      'mobile-development', 
      'data-science',
      'machine-learning',
      'cybersecurity',
      'cloud-computing',
      'database',
      'game-development',
      'devops'
    ],
  },
  techStack: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  roadmapDescription: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  roadmapSteps: [
    {
      stepTitle: {
        type: mongoose.Schema.Types.String,
        required: true,
        maxlength: 100,
      },
      stepDescription: {
        type: mongoose.Schema.Types.String,
        maxlength: 1000,
      },
      resources: [
        {
          type: mongoose.Schema.Types.String,
          match: /^(http|https):\/\/[^ "]+$/,
        },
      ],
    },
  ],
  difficultyLevel: {
    type: mongoose.Schema.Types.String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  estimatedTimeToComplete: {
    type: mongoose.Schema.Types.String,
    maxlength: 20,
  },
  tags:{
    type: mongoose.Schema.Types.Array,
    required: true,
    maxlength: 20,

  },
  // Reference to the User schema
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Contribution = mongoose.model("Contribution", contributionSchema);

export default Contribution;
