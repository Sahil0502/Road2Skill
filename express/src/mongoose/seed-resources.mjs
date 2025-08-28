import mongoose from 'mongoose';
import { Resource } from './schemas/community.mjs';
import { User } from './schemas/user.mjs';

const sampleResources = [
  {
    title: "The Complete JavaScript Course 2025",
    description: "Master modern JavaScript from zero to expert level with this comprehensive course covering ES6+, async/await, modules, and real-world projects.",
    url: "https://www.udemy.com/course/the-complete-javascript-course/",
    type: "course",
    category: "web-development",
    difficulty: "Beginner",
    duration: "69 hours",
    tags: ["javascript", "es6", "async", "projects"],
    rating: { average: 4.7, count: 15420 },
    isVerified: true
  },
  {
    title: "React Official Documentation",
    description: "The official React documentation with tutorials, API reference, and advanced guides. The best place to learn React from the source.",
    url: "https://react.dev/",
    type: "documentation",
    category: "web-development", 
    difficulty: "Intermediate",
    duration: "Self-paced",
    tags: ["react", "frontend", "components", "hooks"],
    rating: { average: 4.9, count: 8900 },
    isVerified: true
  },
  {
    title: "Machine Learning Crash Course by Google",
    description: "A self-study guide for aspiring machine learning practitioners. Features TensorFlow exercises and real-world case studies.",
    url: "https://developers.google.com/machine-learning/crash-course",
    type: "course",
    category: "machine-learning",
    difficulty: "Beginner", 
    duration: "15 hours",
    tags: ["machine-learning", "tensorflow", "google", "free"],
    rating: { average: 4.6, count: 12300 },
    isVerified: true
  },
  {
    title: "AWS Well-Architected Framework",
    description: "Learn the five pillars of the AWS Well-Architected Framework: operational excellence, security, reliability, performance efficiency, and cost optimization.",
    url: "https://aws.amazon.com/architecture/well-architected/",
    type: "documentation",
    category: "cloud-computing",
    difficulty: "Intermediate",
    duration: "4 hours",
    tags: ["aws", "cloud", "architecture", "best-practices"],
    rating: { average: 4.5, count: 3400 },
    isVerified: true
  },
  {
    title: "Cybersecurity Fundamentals",
    description: "IBM's comprehensive course covering security principles, risk management, cryptography, and network security fundamentals.",
    url: "https://www.coursera.org/learn/it-security",
    type: "course",
    category: "cybersecurity",
    difficulty: "Beginner",
    duration: "11 hours",
    tags: ["cybersecurity", "network-security", "ibm", "fundamentals"],
    rating: { average: 4.4, count: 5600 },
    isVerified: true
  },
  {
    title: "MongoDB University",
    description: "Free online courses from MongoDB covering database design, development, and administration with hands-on labs.",
    url: "https://university.mongodb.com/",
    type: "course",
    category: "database",
    difficulty: "Beginner",
    duration: "Varies",
    tags: ["mongodb", "database", "nosql", "free"],
    rating: { average: 4.3, count: 7800 },
    isVerified: true
  },
  {
    title: "Unity Learn Platform",
    description: "Official Unity learning platform with tutorials, projects, and pathways for game development from beginner to advanced.",
    url: "https://learn.unity.com/",
    type: "course",
    category: "game-development",
    difficulty: "Beginner",
    duration: "Self-paced",
    tags: ["unity", "game-development", "3d", "c#"],
    rating: { average: 4.5, count: 9200 },
    isVerified: true
  },
  {
    title: "Flutter Documentation",
    description: "Comprehensive documentation for Flutter framework including widgets catalog, cookbook, and deployment guides.",
    url: "https://docs.flutter.dev/",
    type: "documentation",
    category: "mobile-development",
    difficulty: "Intermediate",
    duration: "Reference",
    tags: ["flutter", "mobile", "dart", "cross-platform"],
    rating: { average: 4.6, count: 6500 },
    isVerified: true
  },
  {
    title: "Kubernetes Basics",
    description: "Interactive tutorial that teaches you how to deploy, scale, and manage containerized applications using Kubernetes.",
    url: "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
    type: "tutorial",
    category: "devops",
    difficulty: "Intermediate",
    duration: "3 hours",
    tags: ["kubernetes", "containers", "devops", "orchestration"],
    rating: { average: 4.4, count: 4300 },
    isVerified: true
  },
  {
    title: "Python for Data Science Handbook",
    description: "Free online book covering essential tools for working with data in Python: IPython, NumPy, Pandas, Matplotlib, Scikit-Learn.",
    url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
    type: "book",
    category: "data-science",
    difficulty: "Intermediate",
    duration: "Self-paced",
    tags: ["python", "data-science", "pandas", "numpy", "matplotlib"],
    rating: { average: 4.7, count: 8900 },
    isVerified: true
  },
  {
    title: "Docker Official Tutorial",
    description: "Learn Docker fundamentals with this hands-on tutorial covering containers, images, Dockerfile, and Docker Compose.",
    url: "https://docs.docker.com/get-started/",
    type: "tutorial",
    category: "devops",
    difficulty: "Beginner",
    duration: "2 hours",
    tags: ["docker", "containers", "devops", "virtualization"],
    rating: { average: 4.5, count: 11200 },
    isVerified: true
  },
  {
    title: "Clean Code by Robert Martin",
    description: "A handbook of agile software craftsmanship that teaches you how to write clean, readable, and maintainable code.",
    url: "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882",
    type: "book",
    category: "web-development",
    difficulty: "Intermediate",
    duration: "464 pages",
    tags: ["clean-code", "best-practices", "programming", "software-engineering"],
    rating: { average: 4.6, count: 15600 },
    isVerified: true
  },
  {
    title: "Ethereum Development Documentation",
    description: "Official Ethereum documentation covering smart contracts, DApps, development tools, and blockchain fundamentals.",
    url: "https://ethereum.org/en/developers/docs/",
    type: "documentation",
    category: "web-development",
    difficulty: "Advanced",
    duration: "Reference",
    tags: ["ethereum", "blockchain", "smart-contracts", "web3"],
    rating: { average: 4.3, count: 3200 },
    isVerified: true
  },
  {
    title: "Design Patterns in Modern C++",
    description: "Learn classic and modern design patterns in C++ with practical examples and real-world applications.",
    url: "https://www.udemy.com/course/patterns-cplusplus/",
    type: "course",
    category: "web-development",
    difficulty: "Advanced",
    duration: "7 hours",
    tags: ["c++", "design-patterns", "programming", "software-architecture"],
    rating: { average: 4.4, count: 2800 },
    isVerified: true
  },
  {
    title: "SQL Tutorial by W3Schools",
    description: "Comprehensive SQL tutorial covering SELECT, INSERT, UPDATE, DELETE statements and advanced database operations.",
    url: "https://www.w3schools.com/sql/",
    type: "tutorial",
    category: "database",
    difficulty: "Beginner",
    duration: "4 hours",
    tags: ["sql", "database", "queries", "tutorial"],
    rating: { average: 4.2, count: 18900 },
    isVerified: true
  },
  {
    title: "Mobile App Security Best Practices",
    description: "OWASP Mobile Security Testing Guide covering security testing methodology and techniques for mobile applications.",
    url: "https://owasp.org/www-project-mobile-security-testing-guide/",
    type: "documentation",
    category: "cybersecurity",
    difficulty: "Advanced",
    duration: "Reference",
    tags: ["mobile-security", "owasp", "testing", "security"],
    rating: { average: 4.5, count: 1900 },
    isVerified: true
  },
  {
    title: "Data Structures and Algorithms",
    description: "Visual learning platform for data structures and algorithms with interactive animations and code examples.",
    url: "https://visualgo.net/",
    type: "tool",
    category: "web-development",
    difficulty: "Intermediate",
    duration: "Interactive",
    tags: ["algorithms", "data-structures", "visualization", "programming"],
    rating: { average: 4.8, count: 7300 },
    isVerified: true
  },
  {
    title: "TensorFlow Developer Certificate",
    description: "Official TensorFlow certification program to demonstrate proficiency in using TensorFlow to solve deep learning problems.",
    url: "https://www.tensorflow.org/certificate",
    type: "course",
    category: "machine-learning",
    difficulty: "Advanced",
    duration: "100+ hours",
    tags: ["tensorflow", "deep-learning", "certification", "neural-networks"],
    rating: { average: 4.6, count: 4500 },
    isVerified: true
  },
  {
    title: "GitHub Actions Documentation",
    description: "Complete guide to GitHub Actions for CI/CD, automation, and workflow management in software development.",
    url: "https://docs.github.com/en/actions",
    type: "documentation",
    category: "devops",
    difficulty: "Intermediate",
    duration: "Reference",
    tags: ["github-actions", "ci-cd", "automation", "workflows"],
    rating: { average: 4.4, count: 6200 },
    isVerified: true
  },
  {
    title: "System Design Interview Course",
    description: "Comprehensive course covering system design fundamentals, scalability, and architectural patterns for technical interviews.",
    url: "https://www.educative.io/courses/grokking-the-system-design-interview",
    type: "course",
    category: "web-development",
    difficulty: "Advanced",
    duration: "12 hours",
    tags: ["system-design", "interviews", "scalability", "architecture"],
    rating: { average: 4.7, count: 8100 },
    isVerified: true
  }
];

export const seedResources = async () => {
  try {
    console.log('Seeding resources...');
    
    // Check if we're connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Skipping resources seeding.');
      return;
    }

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Find system user and some test users
    const systemUser = await User.findOne({ email: 'system@road2skill.com' });
    const testUsers = await User.find({ 
      email: { $in: ['dipu@gmail.com', 'sahil@gmail.com'] } 
    });

    if (!systemUser) {
      console.log('System user not found. Please seed users first.');
      return;
    }

    // Randomly assign submitters to resources
    const allUsers = [systemUser, ...testUsers].filter(user => user);
    
    // Add user reference to each resource
    const resourcesWithSubmitters = sampleResources.map((resource, index) => ({
      ...resource,
      submittedBy: allUsers[index % allUsers.length]._id,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random dates within last 60 days
      reviews: []
    }));

    // Insert resources
    const createdResources = await Resource.insertMany(resourcesWithSubmitters);
    console.log(`Created ${createdResources.length} resources`);

  } catch (error) {
    console.error('Error seeding resources:', error);
  }
};
