import { User } from './schemas/user.mjs';

export const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Check if system user already exists
    const existingUser = await User.findOne({ email: 'system@road2skill.com' });
    if (!existingUser) {
      await User.create({
        username: 'road2skill_system',
        email: 'system@road2skill.com',
        password: 'system_generated',
        isVerified: true
      });
      console.log('System user created');
    } else {
      console.log('System user already exists');
    }

    // Create test users for login testing
    const testUsers = [
      {
        username: 'dipu12',
        email: 'dipu@gmail.com',
        password: 'Dipu@12345',
        isVerified: true
      },
      {
        username: 'sahil',
        email: 'sahil@gmail.com',
        password: 'Sahil@123',
        isVerified: true
      }
    ];

    for (const userData of testUsers) {
      const existingTestUser = await User.findOne({ email: userData.email });
      if (!existingTestUser) {
        await User.create(userData);
        console.log(`Test user created: ${userData.username}`);
      } else {
        console.log(`Test user already exists: ${userData.username}`);
      }
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};