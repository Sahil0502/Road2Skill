import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    profile: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' },
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' }
    },
    progress: {
        completedRoadmaps: [{
            roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' },
            completedAt: { type: Date, default: Date.now },
            progress: { type: Number, default: 0 }, // 0-100
            completedSteps: [{ type: Number }] // Array of step indices
        }],
        totalXP: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        streak: { type: Number, default: 0 },
        lastActiveDate: { type: Date, default: Date.now }
    },
    badges: [{
        name: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
        earnedAt: { type: Date, default: Date.now },
        category: { type: String, enum: ['learning', 'contribution', 'community', 'achievement'], default: 'achievement' }
    }],
    preferences: {
        darkMode: { type: Boolean, default: false },
        emailNotifications: { type: Boolean, default: true },
        publicProfile: { type: Boolean, default: true },
        preferredLearningStyle: { type: String, enum: ['visual', 'auditory', 'kinesthetic', 'reading'], default: 'visual' }
    },
    onboarding: {
        completed: { type: Boolean, default: false },
        completedAt: { type: Date },
        experience: { type: String },
        domains: [{ type: String }],
        currentStudy: { type: String },
        goals: [{ type: String }],
        timeCommitment: { type: String },
        preferredLearningStyle: { type: String },
        currentSkills: [{ type: String }],
        careerStage: { type: String }
    },
    recommendations: {
        lastGenerated: { type: Date },
        roadmaps: [{ type: mongoose.Schema.Types.Mixed }],
        videos: [{ type: mongoose.Schema.Types.Mixed }],
        resources: [{ type: mongoose.Schema.Types.Mixed }],
        notes: [{ type: mongoose.Schema.Types.Mixed }]
    },
    bookmarkedRoadmaps: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Contribution' }],
    followedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, {
    timestamps: true
});

// Calculate level based on XP
userSchema.methods.calculateLevel = function() {
    this.level = Math.floor(this.progress.totalXP / 100) + 1;
    return this.level;
};

// Add XP and update level
userSchema.methods.addXP = function(points) {
    this.progress.totalXP += points;
    this.calculateLevel();
    return this.save();
};

export const User = mongoose.model("User", userSchema);
