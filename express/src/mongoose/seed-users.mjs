import { User } from './schemas/user.mjs';
import { hashPassword } from '../utils/helper.mjs';

export const seedUsers = async () => {
  try {
    console.log('Seeding users...');
    
    // Clear existing test users to recreate with hashed passwords
    await User.deleteMany({ 
      email: { $in: ['dipu@gmail.com', 'sahil@gmail.com', 'system@road2skill.com'] } 
    });
    console.log('Cleared existing test users');
    
    // Create system user
    await User.create({
      username: 'road2skill_system',
      email: 'system@road2skill.com',
      password: hashPassword('system_generated'),
      isVerified: true
    });
    console.log('System user created');

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
      // Hash the password before creating the user
      const hashedPassword = hashPassword(userData.password);
      await User.create({
        ...userData,
        password: hashedPassword
      });
      console.log(`Test user created: ${userData.username} with hashed password`);
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};