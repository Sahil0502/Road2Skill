import mongoose from 'mongoose';
import { seedUsers } from './seed-users.mjs';
import { seedContributions } from './seed-contributions.mjs';
import { seedCareerGuidance } from './seed-career-guidance.mjs';
import { seedCommunityPosts } from './seed-community.mjs';
import { seedResources } from './seed-resources.mjs';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || "mongodb://mongodb:27017/roadmapapp";
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB for seeding');
    }
    
    // Seed users first (required for other collections)
    await seedUsers();
    
    // Then seed contributions (roadmaps)
    await seedContributions();
    
    // Seed career guidance
    await seedCareerGuidance();
    
    // Seed community posts
    await seedCommunityPosts();
    
    // Seed resources
    await seedResources();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;