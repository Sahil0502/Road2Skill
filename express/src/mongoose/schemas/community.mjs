import mongoose, { Schema } from "mongoose";

// Community Post Schema
const communityPostSchema = new Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true,
        maxlength: 5000
    },
    category: {
        type: String,
        enum: ['question', 'showcase', 'discussion', 'resource', 'achievement'],
        required: true
    },
    tags: [String],
    relatedRoadmap: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contribution'
    },
    likes: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        likedAt: { type: Date, default: Date.now }
    }],
    comments: [{
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }],
    views: { type: Number, default: 0 },
    isPinned: { type: Boolean, default: false },
    isResolved: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Resource Schema for curated content
const resourceSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    url: {
        type: String,
        required: true,
        match: /^(http|https):\/\/[^ "]+$/
    },
    type: {
        type: String,
        enum: ['video', 'article', 'course', 'book', 'tool', 'documentation', 'tutorial'],
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    duration: String, // e.g., "2 hours", "5 minutes"
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now }
    }],
    tags: [String],
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isVerified: { type: Boolean, default: false },
    bookmarkedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

// Career Guidance Schema
const careerGuidanceSchema = new Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['resume', 'interview', 'portfolio', 'networking', 'job-search', 'career-change'],
        required: true
    },
    targetRole: String,
    experienceLevel: {
        type: String,
        enum: ['entry', 'mid', 'senior', 'all'],
        default: 'all'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    tags: [String]
}, {
    timestamps: true
});

export const CommunityPost = mongoose.model("CommunityPost", communityPostSchema);
export const Resource = mongoose.model("Resource", resourceSchema);
export const CareerGuidance = mongoose.model("CareerGuidance", careerGuidanceSchema);
