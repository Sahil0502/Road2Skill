import mongoose from 'mongoose';
import { CommunityPost } from './schemas/community.mjs';
import { User } from './schemas/user.mjs';
import Contribution from './schemas/contribution.mjs';

const sampleCommunityPosts = [
  {
    title: "Just completed my first MERN stack project! 🎉",
    content: "After 3 months of learning, I finally built a full-stack e-commerce application. The journey was challenging but incredibly rewarding. Here are some key things I learned:\n\n1. Always plan your database schema first\n2. State management in React is crucial\n3. Error handling on both frontend and backend\n4. Authentication is more complex than it seems\n\nAny tips for optimizing performance? My app is a bit slow with large datasets.",
    category: "showcase",
    tags: ["MERN", "react", "nodejs", "mongodb", "fullstack"]
  },
  {
    title: "How to handle CORS errors in development?",
    content: "I keep running into CORS issues when developing my React app with Express backend. I've tried various solutions but nothing seems to work consistently. Can someone explain the best practices for handling CORS in development vs production?",
    category: "question",
    tags: ["cors", "express", "react", "development", "backend"]
  },
  {
    title: "Machine Learning Roadmap Discussion",
    content: "I've been following the ML roadmap for 2 months now. Currently working through linear algebra and statistics. The math is challenging but I can see how it connects to the algorithms.\n\nWhat I've completed so far:\n✅ Python basics\n✅ NumPy and Pandas\n✅ Basic statistics\n📚 Currently: Linear Algebra\n\nNext up: Calculus and then diving into actual ML algorithms. Anyone else on a similar journey?",
    category: "discussion",
    tags: ["machine-learning", "mathematics", "python", "roadmap"]
  },
  {
    title: "Free AI/ML Resources Compilation",
    content: "Here's a curated list of free resources I've found helpful for learning AI/ML:\n\n📚 Books (Free PDFs):\n- The Elements of Statistical Learning\n- Pattern Recognition and Machine Learning\n- Introduction to Statistical Learning\n\n🎥 Video Courses:\n- Andrew Ng's ML Course (Coursera)\n- Fast.ai Practical Deep Learning\n- 3Blue1Brown Neural Networks Series\n\n💻 Practice Platforms:\n- Kaggle Learn\n- Google Colab\n- Papers with Code\n\nFeel free to add more in the comments!",
    category: "resource",
    tags: ["machine-learning", "resources", "free", "courses", "books"]
  },
  {
    title: "Tips for Landing Your First Tech Job",
    content: "After 8 months of job hunting, I finally landed my first software developer role! Here's what worked for me:\n\n🔥 What helped the most:\n1. Building 3-4 solid portfolio projects\n2. Contributing to open source projects\n3. Networking on LinkedIn and Twitter\n4. Practicing system design interviews\n5. Mock interviews with friends\n\n❌ What didn't work:\n- Applying to hundreds of jobs without customizing applications\n- Focusing only on coding challenges\n- Ignoring soft skills\n\nHappy to answer questions about the process!",
    category: "discussion",
    tags: ["job-search", "career", "interview", "portfolio", "networking"]
  },
  {
    title: "React vs Vue vs Angular - Which to choose in 2025?",
    content: "I'm starting my frontend journey and confused about which framework to pick. I've heard good things about all three:\n\n🔵 React: Most popular, huge ecosystem\n🟢 Vue: Easier learning curve, great documentation\n🔴 Angular: Enterprise-ready, TypeScript first\n\nWhat factors should I consider? My goal is to become job-ready as quickly as possible. Any advice from experienced developers?",
    category: "question",
    tags: ["react", "vue", "angular", "frontend", "frameworks"]
  },
  {
    title: "My AWS Cloud Practitioner Journey",
    content: "Just passed the AWS Cloud Practitioner exam! 🏆\n\nStudy timeline: 6 weeks\nScore: 850/1000\n\nResources I used:\n- AWS Training and Certification portal\n- A Cloud Guru course\n- Practice exams on Whizlabs\n- AWS documentation deep dives\n\nKey tips:\n1. Hands-on practice is crucial\n2. Understand the billing model\n3. Know the core services well\n4. Practice with real scenarios\n\nNext step: Solutions Architect Associate!",
    category: "achievement",
    tags: ["aws", "cloud", "certification", "exam", "study-guide"]
  },
  {
    title: "Open Source Contribution Guide for Beginners",
    content: "Contributing to open source can be intimidating, but it's one of the best ways to improve your skills. Here's how to get started:\n\n🎯 How to find projects:\n- GitHub's 'good first issue' label\n- Up For Grabs website\n- Your favorite tools/libraries\n- Documentation improvements\n\n📝 Types of contributions:\n- Bug fixes\n- Documentation\n- New features\n- Tests\n- Translations\n\n💡 Pro tips:\n- Start small\n- Read contribution guidelines\n- Be patient with code review\n- Ask questions if stuck\n\nWho else is interested in open source?",
    category: "resource",
    tags: ["open-source", "github", "contribution", "beginners", "community"]
  },
  {
    title: "Database Design Best Practices",
    content: "After working with databases for 2 years, here are some lessons I've learned:\n\n✅ Do:\n- Normalize your data (to a point)\n- Use meaningful column names\n- Add proper indexes\n- Set up foreign key constraints\n- Plan for scalability\n\n❌ Don't:\n- Over-normalize (sometimes denormalization is good)\n- Ignore query performance\n- Store calculated values unnecessarily\n- Use generic column names like 'data'\n\nWhat other tips would you add?",
    category: "discussion",
    tags: ["database", "design", "sql", "best-practices", "performance"]
  },
  {
    title: "Cybersecurity Learning Path - Need Advice",
    content: "I'm transitioning from web development to cybersecurity. Looking for advice on the best learning path:\n\nMy background:\n- 2 years web development\n- Basic networking knowledge\n- Some Linux experience\n\nGoals:\n- Penetration testing\n- Ethical hacking certifications\n- Eventually bug bounties\n\nShould I focus on:\n1. CompTIA Security+ first?\n2. Jump straight into CEH?\n3. Build a home lab?\n4. Focus on specific tools (Burp Suite, Metasploit)?\n\nAny cybersecurity professionals here who can guide me?",
    category: "question",
    tags: ["cybersecurity", "career-change", "certifications", "ethical-hacking", "advice"]
  },
  {
    title: "Mobile App Development: Native vs Cross-platform",
    content: "Planning to build my first mobile app and debating between:\n\n📱 Native Development:\n- iOS: Swift/SwiftUI\n- Android: Kotlin/Jetpack Compose\n- Pros: Best performance, platform-specific features\n- Cons: Need to learn two tech stacks\n\n🔄 Cross-platform:\n- React Native\n- Flutter\n- Xamarin\n- Pros: Single codebase, faster development\n- Cons: Performance limitations, platform inconsistencies\n\nThe app will be a fitness tracker with real-time GPS. What would you recommend?",
    category: "question",
    tags: ["mobile-development", "react-native", "flutter", "ios", "android"]
  },
  {
    title: "Game Development with Unity - Week 1 Update",
    content: "Started learning Unity and C# for game development. It's been a fascinating week!\n\nWhat I've learned:\n- Unity interface and workflow\n- Basic C# scripting\n- Physics and colliders\n- Sprite animations\n- Scene management\n\nCurrent project: 2D platformer game\nProgress: Player movement and basic jumping ✅\nNext: Enemy AI and level design\n\nThe visual scripting system is amazing for beginners. Any Unity devs here with tips for a newbie?",
    category: "showcase",
    tags: ["game-development", "unity", "csharp", "2d-games", "beginners"]
  },
  {
    title: "DevOps Tools Comparison: Jenkins vs GitHub Actions",
    content: "Setting up CI/CD for my projects and comparing different tools:\n\n🔧 Jenkins:\n✅ Highly customizable\n✅ Extensive plugin ecosystem\n✅ Self-hosted control\n❌ Complex setup\n❌ Maintenance overhead\n\n🚀 GitHub Actions:\n✅ Easy setup for GitHub repos\n✅ Great integration\n✅ No server maintenance\n❌ Can get expensive\n❌ Vendor lock-in\n\nFor small to medium projects, GitHub Actions seems like the winner. What's your experience?",
    category: "discussion",
    tags: ["devops", "ci-cd", "jenkins", "github-actions", "automation"]
  },
  {
    title: "Data Science Project: Predicting House Prices",
    content: "Just finished my first end-to-end data science project! 📊\n\nProject: House price prediction using the Boston Housing dataset\n\nTech stack:\n- Python, Pandas, NumPy\n- Scikit-learn for modeling\n- Matplotlib/Seaborn for visualization\n- Jupyter Notebooks\n\nModels tried:\n1. Linear Regression (baseline)\n2. Random Forest\n3. XGBoost (best performance)\n\nFinal RMSE: $3,200\n\nNext: Deploy the model as a web app using Flask. Any suggestions for hosting?",
    category: "showcase",
    tags: ["data-science", "machine-learning", "python", "prediction", "project"]
  },
  {
    title: "Blockchain Development Learning Resources",
    content: "Getting into blockchain development. Here are the resources I'm using:\n\n📚 Fundamentals:\n- Bitcoin whitepaper\n- Ethereum documentation\n- Blockchain basics on Coursera\n\n💻 Development:\n- Solidity documentation\n- CryptoZombies (gamified learning)\n- Remix IDE for smart contracts\n- Web3.js/Ethers.js for frontend\n\n🛠️ Tools:\n- Hardhat development environment\n- MetaMask for testing\n- Ganache local blockchain\n\nThe learning curve is steep but exciting! Anyone else diving into Web3?",
    category: "resource",
    tags: ["blockchain", "solidity", "web3", "ethereum", "smart-contracts"]
  }
];

export const seedCommunityPosts = async () => {
  try {
    console.log('Seeding community posts...');
    
    // Check if we're connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Skipping community posts seeding.');
      return;
    }

    // Clear existing posts
    await CommunityPost.deleteMany({});
    console.log('Cleared existing community posts');

    // Find system user and some test users
    const systemUser = await User.findOne({ email: 'system@road2skill.com' });
    const testUsers = await User.find({ 
      email: { $in: ['dipu@gmail.com', 'sahil@gmail.com'] } 
    });

    if (!systemUser) {
      console.log('System user not found. Please seed users first.');
      return;
    }

    // Randomly assign authors to posts
    const allUsers = [systemUser, ...testUsers].filter(user => user);
    
    // Add user reference to each post
    const postsWithAuthors = sampleCommunityPosts.map((post, index) => ({
      ...post,
      author: allUsers[index % allUsers.length]._id,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random dates within last 30 days
      likes: [],
      comments: []
    }));

    // Insert community posts
    const createdPosts = await CommunityPost.insertMany(postsWithAuthors);
    console.log(`Created ${createdPosts.length} community posts`);

  } catch (error) {
    console.error('Error seeding community posts:', error);
  }
};
