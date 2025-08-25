import mongoose from 'mongoose';
import { seedUsers } from './seed-users.mjs';
import { seedContributions } from './seed-contributions.mjs';
import { seedCareerGuidance } from './seed-career-guidance.mjs';

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Ensure MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/roadmapapp";
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB for seeding');
    }
    
    // Seed users first
    await seedUsers();
    
    // Then seed contributions
    await seedContributions();
    
    // Finally seed career guidance
    await seedCareerGuidance();
    
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedDatabase;