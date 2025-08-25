import mongoose from 'mongoose';
import Contribution from './schemas/contribution.mjs';
import { User } from './schemas/user.mjs';

// Sample roadmap data for each domain
const sampleRoadmaps = [
  // Web Development
  {
    title: "Full Stack Web Development with MERN",
    contributorName: "Road2Skill Team",
    domain: "web-development",
    techStack: "MongoDB, Express.js, React, Node.js",
    roadmapDescription: "Complete roadmap to become a full-stack web developer using the MERN stack. Learn both frontend and backend development.",
    roadmapSteps: [
      {
        stepTitle: "HTML & CSS Fundamentals",
        stepDescription: "Learn the building blocks of web development - HTML for structure and CSS for styling",
        resources: [
          "https://www.w3schools.com/html/",
          "https://www.w3schools.com/css/",
          "https://flexboxfroggy.com/"
        ]
      },
      {
        stepTitle: "JavaScript Basics",
        stepDescription: "Master JavaScript fundamentals including variables, functions, and DOM manipulation",
        resources: [
          "https://javascript.info/",
          "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
          "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
        ]
      },
      {
        stepTitle: "React Frontend",
        stepDescription: "Build dynamic user interfaces with React components, hooks, and state management",
        resources: [
          "https://react.dev/",
          "https://www.freecodecamp.org/learn/front-end-development-libraries/",
          "https://reactrouter.com/"
        ]
      },
      {
        stepTitle: "Node.js & Express Backend",
        stepDescription: "Create server-side applications and APIs using Node.js and Express framework",
        resources: [
          "https://nodejs.org/en/docs/",
          "https://expressjs.com/",
          "https://www.freecodecamp.org/learn/back-end-development-and-apis/"
        ]
      },
      {
        stepTitle: "MongoDB Database",
        stepDescription: "Learn NoSQL database design and integration with MongoDB and Mongoose",
        resources: [
          "https://docs.mongodb.com/",
          "https://mongoosejs.com/",
          "https://university.mongodb.com/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "6-8 months",
    tags: ["javascript", "react", "nodejs", "mongodb", "fullstack"]
  },
  {
    title: "Frontend Web Development with React",
    contributorName: "Road2Skill Team",
    domain: "web-development",
    techStack: "HTML, CSS, JavaScript, React, TypeScript",
    roadmapDescription: "Become a professional frontend developer specializing in React and modern web technologies.",
    roadmapSteps: [
      {
        stepTitle: "Web Fundamentals",
        stepDescription: "Master HTML5, CSS3, and responsive design principles",
        resources: [
          "https://developer.mozilla.org/en-US/docs/Learn",
          "https://www.freecodecamp.org/learn/responsive-web-design/",
          "https://css-tricks.com/"
        ]
      },
      {
        stepTitle: "JavaScript ES6+",
        stepDescription: "Learn modern JavaScript features and best practices",
        resources: [
          "https://es6.io/",
          "https://javascript.info/",
          "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/"
        ]
      },
      {
        stepTitle: "React Ecosystem",
        stepDescription: "Master React, hooks, context, and popular libraries",
        resources: [
          "https://react.dev/",
          "https://redux.js.org/",
          "https://react-hook-form.com/"
        ]
      }
    ],
    difficultyLevel: "Beginner",
    estimatedTimeToComplete: "4-6 months",
    tags: ["react", "javascript", "frontend", "css", "html"]
  },

  // Mobile Development
  {
    title: "React Native Mobile App Development",
    contributorName: "Road2Skill Team",
    domain: "mobile-development",
    techStack: "React Native, JavaScript, Expo",
    roadmapDescription: "Build cross-platform mobile applications using React Native and JavaScript.",
    roadmapSteps: [
      {
        stepTitle: "React Fundamentals",
        stepDescription: "Learn React concepts that form the foundation of React Native",
        resources: [
          "https://react.dev/",
          "https://www.freecodecamp.org/learn/front-end-development-libraries/",
          "https://reactjs.org/tutorial/tutorial.html"
        ]
      },
      {
        stepTitle: "React Native Basics",
        stepDescription: "Understand React Native components, navigation, and mobile-specific features",
        resources: [
          "https://reactnative.dev/",
          "https://docs.expo.dev/",
          "https://reactnavigation.org/"
        ]
      },
      {
        stepTitle: "Mobile UI/UX",
        stepDescription: "Learn mobile design patterns and create responsive mobile interfaces",
        resources: [
          "https://material.io/design/",
          "https://developer.apple.com/design/human-interface-guidelines/",
          "https://www.figma.com/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "5-7 months",
    tags: ["react-native", "mobile", "javascript", "ios", "android"]
  },
  {
    title: "Native Android Development with Kotlin",
    contributorName: "Road2Skill Team",
    domain: "mobile-development",
    techStack: "Kotlin, Android Studio, Jetpack Compose",
    roadmapDescription: "Develop native Android applications using Kotlin and modern Android development tools.",
    roadmapSteps: [
      {
        stepTitle: "Kotlin Programming",
        stepDescription: "Learn Kotlin language fundamentals and object-oriented programming",
        resources: [
          "https://kotlinlang.org/docs/getting-started.html",
          "https://developer.android.com/kotlin",
          "https://www.codecademy.com/learn/learn-kotlin"
        ]
      },
      {
        stepTitle: "Android Fundamentals",
        stepDescription: "Understand Android architecture, activities, fragments, and lifecycle",
        resources: [
          "https://developer.android.com/courses/android-basics-kotlin/course",
          "https://developer.android.com/guide",
          "https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "6-8 months",
    tags: ["kotlin", "android", "mobile", "jetpack-compose"]
  },

  // Data Science
  {
    title: "Data Science with Python",
    contributorName: "Road2Skill Team",
    domain: "data-science",
    techStack: "Python, Pandas, NumPy, Matplotlib, Jupyter",
    roadmapDescription: "Complete data science learning path using Python and popular data science libraries.",
    roadmapSteps: [
      {
        stepTitle: "Python for Data Science",
        stepDescription: "Learn Python programming fundamentals and data structures",
        resources: [
          "https://www.python.org/about/gettingstarted/",
          "https://www.kaggle.com/learn/python",
          "https://www.codecademy.com/learn/learn-python-3"
        ]
      },
      {
        stepTitle: "Data Manipulation with Pandas",
        stepDescription: "Master data cleaning, transformation, and analysis using Pandas",
        resources: [
          "https://pandas.pydata.org/docs/getting_started/index.html",
          "https://www.kaggle.com/learn/pandas",
          "https://www.datacamp.com/courses/data-manipulation-with-pandas"
        ]
      },
      {
        stepTitle: "Data Visualization",
        stepDescription: "Create meaningful visualizations using Matplotlib, Seaborn, and Plotly",
        resources: [
          "https://matplotlib.org/tutorials/index.html",
          "https://seaborn.pydata.org/tutorial.html",
          "https://plotly.com/python/"
        ]
      }
    ],
    difficultyLevel: "Beginner",
    estimatedTimeToComplete: "4-6 months",
    tags: ["python", "data-science", "pandas", "visualization", "analytics"]
  },
  {
    title: "Advanced Data Analytics & Statistics",
    contributorName: "Road2Skill Team",
    domain: "data-science",
    techStack: "Python, R, SQL, Scikit-learn, Statistics",
    roadmapDescription: "Deep dive into statistical analysis, hypothesis testing, and advanced analytics techniques.",
    roadmapSteps: [
      {
        stepTitle: "Statistical Foundations",
        stepDescription: "Learn descriptive and inferential statistics, probability, and hypothesis testing",
        resources: [
          "https://www.khanacademy.org/math/statistics-probability",
          "https://www.coursera.org/learn/statistical-thinking",
          "https://statsthinking21.org/"
        ]
      },
      {
        stepTitle: "SQL for Data Analysis",
        stepDescription: "Master SQL queries for data extraction and database analysis",
        resources: [
          "https://www.w3schools.com/sql/",
          "https://sqlbolt.com/",
          "https://www.kaggle.com/learn/intro-to-sql"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "6-9 months",
    tags: ["statistics", "sql", "analytics", "python", "r"]
  },

  // Machine Learning
  {
    title: "Machine Learning Fundamentals",
    contributorName: "Road2Skill Team",
    domain: "machine-learning",
    techStack: "Python, Scikit-learn, TensorFlow, Keras",
    roadmapDescription: "Learn machine learning concepts and build predictive models using Python.",
    roadmapSteps: [
      {
        stepTitle: "ML Mathematics",
        stepDescription: "Understand linear algebra, calculus, and statistics for machine learning",
        resources: [
          "https://www.khanacademy.org/math/linear-algebra",
          "https://www.coursera.org/learn/machine-learning-course",
          "https://mml-book.github.io/"
        ]
      },
      {
        stepTitle: "Supervised Learning",
        stepDescription: "Learn regression, classification, and model evaluation techniques",
        resources: [
          "https://scikit-learn.org/stable/user_guide.html",
          "https://www.kaggle.com/learn/machine-learning",
          "https://www.coursera.org/learn/machine-learning"
        ]
      },
      {
        stepTitle: "Deep Learning",
        stepDescription: "Build neural networks using TensorFlow and Keras",
        resources: [
          "https://www.tensorflow.org/tutorials",
          "https://keras.io/guides/",
          "https://www.deeplearning.ai/"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "8-12 months",
    tags: ["machine-learning", "python", "tensorflow", "neural-networks", "ai"]
  },

  // Cybersecurity
  {
    title: "Ethical Hacking & Penetration Testing",
    contributorName: "Road2Skill Team",
    domain: "cybersecurity",
    techStack: "Kali Linux, Metasploit, Wireshark, Nmap",
    roadmapDescription: "Learn ethical hacking techniques and penetration testing methodologies.",
    roadmapSteps: [
      {
        stepTitle: "Networking Fundamentals",
        stepDescription: "Understand TCP/IP, OSI model, and network protocols",
        resources: [
          "https://www.cisco.com/c/en/us/solutions/small-business/resource-center/networking/networking-basics.html",
          "https://www.comptia.org/certifications/network",
          "https://www.coursera.org/learn/computer-networking"
        ]
      },
      {
        stepTitle: "Linux Security",
        stepDescription: "Master Linux command line and security tools",
        resources: [
          "https://www.kali.org/docs/",
          "https://linuxjourney.com/",
          "https://www.cyberciti.biz/tips/"
        ]
      },
      {
        stepTitle: "Penetration Testing",
        stepDescription: "Learn vulnerability assessment and penetration testing techniques",
        resources: [
          "https://www.offensive-security.com/pwk-oscp/",
          "https://www.sans.org/cyber-security-courses/",
          "https://www.cybrary.it/"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "9-12 months",
    tags: ["cybersecurity", "ethical-hacking", "penetration-testing", "linux", "networking"]
  },
  {
    title: "Cybersecurity Fundamentals",
    contributorName: "Road2Skill Team",
    domain: "cybersecurity",
    techStack: "Network Security, Cryptography, Risk Management",
    roadmapDescription: "Build foundational knowledge in cybersecurity principles and practices.",
    roadmapSteps: [
      {
        stepTitle: "Security Basics",
        stepDescription: "Learn fundamental security concepts and threat landscape",
        resources: [
          "https://www.sans.org/white-papers/",
          "https://www.cisecurity.org/controls/",
          "https://www.nist.gov/cyberframework"
        ]
      },
      {
        stepTitle: "Cryptography",
        stepDescription: "Understand encryption, hashing, and digital signatures",
        resources: [
          "https://www.coursera.org/learn/crypto",
          "https://cryptopals.com/",
          "https://www.khanacademy.org/computing/computer-science/cryptography"
        ]
      }
    ],
    difficultyLevel: "Beginner",
    estimatedTimeToComplete: "4-6 months",
    tags: ["cybersecurity", "cryptography", "network-security", "risk-management"]
  },

  // Cloud Computing
  {
    title: "AWS Cloud Solutions Architect",
    contributorName: "Road2Skill Team",
    domain: "cloud-computing",
    techStack: "AWS, EC2, S3, Lambda, CloudFormation",
    roadmapDescription: "Master Amazon Web Services and become a certified cloud solutions architect.",
    roadmapSteps: [
      {
        stepTitle: "Cloud Fundamentals",
        stepDescription: "Understand cloud computing concepts and service models",
        resources: [
          "https://aws.amazon.com/getting-started/",
          "https://www.coursera.org/learn/aws-cloud-technical-essentials",
          "https://cloudacademy.com/"
        ]
      },
      {
        stepTitle: "AWS Core Services",
        stepDescription: "Learn EC2, S3, VPC, and other fundamental AWS services",
        resources: [
          "https://aws.amazon.com/training/",
          "https://acloudguru.com/",
          "https://www.whizlabs.com/"
        ]
      },
      {
        stepTitle: "Architecture & Best Practices",
        stepDescription: "Design scalable and secure cloud architectures",
        resources: [
          "https://aws.amazon.com/architecture/",
          "https://aws.amazon.com/whitepapers/",
          "https://wellarchitectedlabs.com/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "6-9 months",
    tags: ["aws", "cloud", "architecture", "devops", "infrastructure"]
  },
  {
    title: "Multi-Cloud DevOps Engineering",
    contributorName: "Road2Skill Team",
    domain: "cloud-computing",
    techStack: "AWS, Azure, GCP, Kubernetes, Terraform",
    roadmapDescription: "Learn to work across multiple cloud platforms with modern DevOps practices.",
    roadmapSteps: [
      {
        stepTitle: "Infrastructure as Code",
        stepDescription: "Master Terraform and CloudFormation for infrastructure automation",
        resources: [
          "https://www.terraform.io/docs/",
          "https://learn.hashicorp.com/terraform",
          "https://www.pulumi.com/"
        ]
      },
      {
        stepTitle: "Container Orchestration",
        stepDescription: "Learn Docker and Kubernetes for containerized applications",
        resources: [
          "https://kubernetes.io/docs/tutorials/",
          "https://docker-curriculum.com/",
          "https://www.cncf.io/certification/cka/"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "8-12 months",
    tags: ["multi-cloud", "kubernetes", "terraform", "devops", "containers"]
  },

  // Database
  {
    title: "Database Administration & Design",
    contributorName: "Road2Skill Team",
    domain: "database",
    techStack: "PostgreSQL, MySQL, MongoDB, Redis",
    roadmapDescription: "Become a database expert with skills in both SQL and NoSQL databases.",
    roadmapSteps: [
      {
        stepTitle: "SQL Fundamentals",
        stepDescription: "Master SQL queries, joins, and database design principles",
        resources: [
          "https://www.postgresql.org/docs/",
          "https://www.w3schools.com/sql/",
          "https://sqlbolt.com/"
        ]
      },
      {
        stepTitle: "Database Administration",
        stepDescription: "Learn backup, recovery, performance tuning, and security",
        resources: [
          "https://www.postgresql.org/docs/current/admin.html",
          "https://dev.mysql.com/doc/",
          "https://dba.stackexchange.com/"
        ]
      },
      {
        stepTitle: "NoSQL Databases",
        stepDescription: "Understand MongoDB, Redis, and other NoSQL technologies",
        resources: [
          "https://docs.mongodb.com/",
          "https://redis.io/documentation",
          "https://university.mongodb.com/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "5-7 months",
    tags: ["sql", "postgresql", "mongodb", "database-design", "dba"]
  },
  {
    title: "Big Data & Data Engineering",
    contributorName: "Road2Skill Team",
    domain: "database",
    techStack: "Apache Spark, Hadoop, Kafka, Elasticsearch",
    roadmapDescription: "Handle large-scale data processing and build robust data pipelines.",
    roadmapSteps: [
      {
        stepTitle: "Big Data Fundamentals",
        stepDescription: "Understand distributed systems and big data concepts",
        resources: [
          "https://spark.apache.org/docs/latest/",
          "https://hadoop.apache.org/docs/",
          "https://www.coursera.org/learn/big-data-introduction"
        ]
      },
      {
        stepTitle: "Data Pipeline Engineering",
        stepDescription: "Build ETL pipelines using Apache Kafka and other tools",
        resources: [
          "https://kafka.apache.org/documentation/",
          "https://airflow.apache.org/docs/",
          "https://www.elastic.co/guide/"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "7-10 months",
    tags: ["big-data", "spark", "kafka", "data-engineering", "etl"]
  },

  // Game Development
  {
    title: "Unity Game Development",
    contributorName: "Road2Skill Team",
    domain: "game-development",
    techStack: "Unity, C#, Blender, Photoshop",
    roadmapDescription: "Create 2D and 3D games using Unity engine and C# programming.",
    roadmapSteps: [
      {
        stepTitle: "C# Programming",
        stepDescription: "Learn C# fundamentals and object-oriented programming",
        resources: [
          "https://docs.microsoft.com/en-us/dotnet/csharp/",
          "https://www.codecademy.com/learn/learn-c-sharp",
          "https://unity.com/learn"
        ]
      },
      {
        stepTitle: "Unity Basics",
        stepDescription: "Master Unity interface, components, and game objects",
        resources: [
          "https://learn.unity.com/",
          "https://unity.com/learn/get-started",
          "https://www.youtube.com/user/Unity3D"
        ]
      },
      {
        stepTitle: "Game Design & Art",
        stepDescription: "Learn game design principles and create game assets",
        resources: [
          "https://www.blender.org/support/tutorials/",
          "https://www.adobe.com/products/photoshop/landpa.html",
          "https://www.gamasutra.com/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "6-9 months",
    tags: ["unity", "csharp", "game-development", "3d", "mobile-games"]
  },
  {
    title: "Indie Game Development",
    contributorName: "Road2Skill Team",
    domain: "game-development",
    techStack: "Godot, Python, Aseprite, GIMP",
    roadmapDescription: "Create indie games using open-source tools and learn the complete game development process.",
    roadmapSteps: [
      {
        stepTitle: "Game Development Fundamentals",
        stepDescription: "Learn game loops, physics, and basic programming concepts",
        resources: [
          "https://docs.godotengine.org/en/stable/",
          "https://www.pygame.org/docs/",
          "https://itch.io/game-development"
        ]
      },
      {
        stepTitle: "2D Art & Animation",
        stepDescription: "Create sprites, animations, and 2D game assets",
        resources: [
          "https://www.aseprite.org/docs/",
          "https://www.gimp.org/tutorials/",
          "https://opengameart.org/"
        ]
      }
    ],
    difficultyLevel: "Beginner",
    estimatedTimeToComplete: "4-6 months",
    tags: ["indie-games", "godot", "2d", "pixel-art", "python"]
  },

  // DevOps
  {
    title: "DevOps Engineering Fundamentals",
    contributorName: "Road2Skill Team",
    domain: "devops",
    techStack: "Docker, Kubernetes, Jenkins, Git, Linux",
    roadmapDescription: "Master DevOps practices, CI/CD pipelines, and infrastructure automation.",
    roadmapSteps: [
      {
        stepTitle: "Linux & Scripting",
        stepDescription: "Master Linux command line and shell scripting",
        resources: [
          "https://linuxjourney.com/",
          "https://www.shellscript.sh/",
          "https://www.edx.org/course/introduction-to-linux"
        ]
      },
      {
        stepTitle: "Version Control & CI/CD",
        stepDescription: "Learn Git, GitHub Actions, and Jenkins for automation",
        resources: [
          "https://git-scm.com/docs",
          "https://www.jenkins.io/doc/",
          "https://docs.github.com/en/actions"
        ]
      },
      {
        stepTitle: "Containerization",
        stepDescription: "Master Docker and Kubernetes for application deployment",
        resources: [
          "https://docs.docker.com/",
          "https://kubernetes.io/docs/tutorials/",
          "https://www.cncf.io/"
        ]
      }
    ],
    difficultyLevel: "Intermediate",
    estimatedTimeToComplete: "6-8 months",
    tags: ["devops", "docker", "kubernetes", "jenkins", "automation"]
  },
  {
    title: "Site Reliability Engineering (SRE)",
    contributorName: "Road2Skill Team",
    domain: "devops",
    techStack: "Prometheus, Grafana, ELK Stack, Terraform, Ansible",
    roadmapDescription: "Learn SRE practices, monitoring, observability, and infrastructure reliability.",
    roadmapSteps: [
      {
        stepTitle: "Monitoring & Observability",
        stepDescription: "Implement comprehensive monitoring and alerting systems",
        resources: [
          "https://prometheus.io/docs/",
          "https://grafana.com/docs/",
          "https://www.elastic.co/guide/"
        ]
      },
      {
        stepTitle: "Infrastructure as Code",
        stepDescription: "Automate infrastructure with Terraform and Ansible",
        resources: [
          "https://www.terraform.io/docs/",
          "https://docs.ansible.com/",
          "https://learn.hashicorp.com/"
        ]
      }
    ],
    difficultyLevel: "Advanced",
    estimatedTimeToComplete: "8-10 months",
    tags: ["sre", "monitoring", "terraform", "ansible", "reliability"]
  }
];

export const seedContributions = async () => {
  try {
    // Check if we're connected to MongoDB
    if (mongoose.connection.readyState !== 1) {
      console.log('Database not connected. Skipping contribution seeding.');
      return;
    }

    // Clear existing contributions
    await Contribution.deleteMany({});
    console.log('Cleared existing contributions');

    // Find a default user or create one
    let defaultUser = await User.findOne({ email: 'system@road2skill.com' });
    if (!defaultUser) {
      defaultUser = await User.create({
        username: 'road2skill_system',
        email: 'system@road2skill.com',
        password: 'system_generated', // This should be hashed in real implementation
        isVerified: true
      });
    }

    // Add user reference to each roadmap
    const roadmapsWithUser = sampleRoadmaps.map(roadmap => ({
      ...roadmap,
      user: defaultUser._id
    }));

    // Insert sample roadmaps
    const createdRoadmaps = await Contribution.insertMany(roadmapsWithUser);
    console.log(`Created ${createdRoadmaps.length} sample roadmaps`);
    
    // Log count by domain
    const domainCounts = {};
    createdRoadmaps.forEach(roadmap => {
      domainCounts[roadmap.domain] = (domainCounts[roadmap.domain] || 0) + 1;
    });
    
    console.log('Roadmaps created by domain:');
    Object.entries(domainCounts).forEach(([domain, count]) => {
      console.log(`  ${domain}: ${count} roadmaps`);
    });

  } catch (error) {
    console.error('Error seeding contributions:', error);
  }
};

export default sampleRoadmaps;
