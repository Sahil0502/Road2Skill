# Road2Skill - Professional Learning Platform

🚀 **[Live Demo](https://road2skill-production.up.railway.app/)** | 📱 **Responsive Design** | ⚡ **Modern Tech Stack**

Road2Skill is a full-stack learning platform that helps users master new skills through structured roadmaps, curated resources, and community collaboration. Built with React.js and Node.js, featuring real-time progress tracking, interactive dashboards, and modern UI/UX design.

## 🎯 Project Overview

A comprehensive skill development platform designed to guide learners from beginner to professional level. The application features user authentication, progress tracking, community interaction, and personalized learning paths - all deployed on Railway with Docker containerization.

## ⭐ Key Features

### 🗺️ Interactive Learning Roadmaps
- **Visual Learning Paths**: Step-by-step roadmaps for different skills and technologies
- **Progress Tracking**: Real-time completion status and learning analytics
- **Custom Roadmaps**: Users can create and share their own learning paths
- **Difficulty Levels**: Beginner to advanced content organization

### 📚 Resource Hub
- **Curated Content**: High-quality learning materials including videos, articles, and courses
- **Smart Filtering**: Advanced search by category, difficulty, and content type
- **Community Contributions**: User-generated resource recommendations
- **Bookmarking System**: Save and organize favorite learning materials

### 👥 Community Platform
- **Discussion Forums**: Connect with learners worldwide
- **Experience Sharing**: Post questions, insights, and learning experiences
- **Social Features**: Like, comment, and engage with community content
- **Knowledge Exchange**: Collaborative learning environment

### 💼 Career Guidance
- **Professional Advice**: Expert tips on resume building and interview preparation
- **Industry Insights**: Current trends and skill requirements
- **Portfolio Guidance**: Help with project showcasing and career development
- **Transition Support**: Resources for career changes and skill upgrades

### 📊 Progress Analytics
- **Learning Dashboard**: Comprehensive view of learning progress and achievements
- **Skill Tracking**: Monitor progress across different learning paths
- **Performance Metrics**: Detailed analytics on learning patterns and milestones
- **Goal Setting**: Set and track personal learning objectives

## 🛠️ Technology Stack

### Backend
- **Node.js & Express.js** - RESTful API server with modern ES6+ modules
- **MongoDB & Mongoose** - NoSQL database with ODM for data modeling
- **Passport.js** - Authentication middleware with local strategy
- **bcrypt** - Secure password hashing and authentication
- **express-session** - Session management for user state
- **express-validator** - Input validation and sanitization
- **CORS** - Cross-origin resource sharing configuration

### Frontend
- **React.js 18** - Modern component-based UI with hooks and context
- **Vite** - Fast build tool and development server
- **React Router DOM** - Client-side routing and navigation
- **Framer Motion** - Smooth animations and micro-interactions
- **React Icons** - Comprehensive icon library
- **Axios** - HTTP client for API communication
- **CSS3** - Modern styling with CSS variables and flexbox/grid

### DevOps & Deployment
- **Docker** - Containerization for consistent deployments
- **Railway.com** - Cloud hosting and continuous deployment
- **Git & GitHub** - Version control and collaboration
- **ESLint** - Code linting and quality assurance
- **Nodemon** - Development server with hot reloading

### Database Design
```
Users Collection:
├── Authentication (email, password)
├── Profile Information (name, bio, skills)
├── Progress Tracking (completed roadmaps, achievements)
└── Preferences (theme, notifications)

Roadmaps Collection:
├── Content Structure (title, description, steps)
├── Metadata (difficulty, category, duration)
├── Creator Information (author, created date)
└── Progress Tracking (completion rates, user feedback)

Community Posts:
├── Post Content (title, description, media)
├── Engagement (likes, comments, shares)
├── Categorization (tags, topics)
└── Author Information (user references)

Resources Collection:
├── Learning Materials (links, descriptions)
├── Classification (type, difficulty, category)
├── Quality Metrics (ratings, reviews)
└── Curation Data (contributor, verification)
```

## 🚀 Quick Start

### Live Application
**🌐 [Visit Road2Skill](https://road2skill-production.up.railway.app/)**

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (v5.0+)
- npm or yarn package manager
- Git

### Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Sahil0502/Road2Skill.git
cd Road2Skill
```

#### 2. Backend Setup
```bash
cd express
npm install

# Create .env file
echo "MONGODB_URI=mongodb://localhost:27017/road2skill
SESSION_SECRET=your_secure_session_secret_here
PORT=3001
NODE_ENV=development" > .env

# Start the backend server
npm run start:dev
```

#### 3. Frontend Setup
```bash
cd ../Frontend/Road2Skill
npm install

# Start the development server
npm run dev
```

#### 4. Access the Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

### Docker Deployment
```bash
# Build and run with Docker
docker build -t road2skill .
docker run -p 3001:3001 road2skill
```

## 📁 Project Architecture

```
Road2Skill/
├── 🐳 docker-compose.yml          # Multi-service Docker configuration
├── 🐳 Dockerfile                  # Production container build
├── 🚂 railway.json               # Railway deployment configuration
├── 📄 README.md                   # Project documentation
│
├── 🖥️ express/                    # Backend API Server
│   ├── src/
│   │   ├── 📊 mongoose/           # Database layer
│   │   │   ├── schemas/           # MongoDB data models
│   │   │   │   ├── user.mjs       # User authentication & profiles
│   │   │   │   ├── roadmap.mjs    # Learning path structures
│   │   │   │   ├── community.mjs  # Community posts & interactions
│   │   │   │   ├── contribution.mjs # User contributions
│   │   │   │   └── careerGuidance.mjs # Career advice content
│   │   │   ├── seed.mjs           # Database initialization
│   │   │   └── seed-*.mjs         # Sample data population
│   │   ├── 🛣️ routers/            # API endpoint handlers
│   │   │   ├── users.mjs          # User management endpoints
│   │   │   ├── roadmaps.mjs       # Roadmap CRUD operations
│   │   │   ├── community.mjs      # Community features API
│   │   │   ├── contribution.mjs   # Content contribution API
│   │   │   ├── recommendations.mjs # Personalized suggestions
│   │   │   └── careerGuidance.mjs # Career guidance API
│   │   ├── 🔐 strategies/         # Authentication strategies
│   │   └── 🔧 utils/             # Helper functions & validation
│   └── 📦 package.json           # Backend dependencies
│
└── 🎨 Frontend/Road2Skill/       # React Frontend Application
    ├── src/
    │   ├── 🧩 components/        # React UI components
    │   │   ├── Home.jsx          # Landing page & hero section
    │   │   ├── Login.jsx         # User authentication
    │   │   ├── CreateAccountForm.jsx # User registration
    │   │   ├── RoadmapExplore.jsx # Browse learning paths
    │   │   ├── RoadmapLearning.jsx # Interactive learning interface
    │   │   ├── ResourceHub.jsx   # Curated learning materials
    │   │   ├── CommunityInsights.jsx # Social learning features
    │   │   ├── CareerGuidance.jsx # Professional development
    │   │   ├── UserProfile.jsx   # Profile management
    │   │   ├── MyLearningProgress.jsx # Progress tracking
    │   │   ├── PersonalizedRecommendations.jsx # AI suggestions
    │   │   ├── ContributionForm.jsx # Content creation
    │   │   └── UserOnboarding.jsx # New user experience
    │   ├── 🎨 componentsCss/     # Component-specific styles
    │   ├── 🖼️ assets/           # Images, icons, media files
    │   ├── ⚙️ config/           # Environment & API configuration
    │   └── 📱 App.jsx           # Main application component
    └── 📦 package.json          # Frontend dependencies
```

## 🔌 API Endpoints

### Authentication & User Management
```bash
POST   /api/auth/register        # User registration with validation
POST   /api/auth/login          # Secure login with session creation
POST   /api/auth/logout         # Session termination
GET    /api/auth/status         # Authentication status check
GET    /api/user/profile/:id?   # User profile retrieval
PUT    /api/user/profile        # Profile updates and preferences
```

### Learning Content Management
```bash
GET    /api/contributions       # Fetch all roadmaps with pagination
GET    /api/contributions/:id   # Detailed roadmap information
POST   /api/contributions       # Create new learning roadmap
PUT    /api/contributions/:id   # Update existing roadmap
DELETE /api/contributions/:id   # Remove roadmap (authorized users)
```

### Progress & Analytics
```bash
GET    /api/user/progress       # Personal learning progress
POST   /api/user/progress/:roadmapId  # Update completion status
GET    /api/recommendations     # Personalized learning suggestions
POST   /api/user/achievements   # Track milestones and badges
```

### Community Features
```bash
GET    /api/community/posts     # Community discussion posts
POST   /api/community/posts     # Create new discussion
PUT    /api/community/posts/:id # Update post content
DELETE /api/community/posts/:id # Remove post (author/admin)
POST   /api/community/like/:id  # Like/unlike posts
POST   /api/community/comment/:id # Add comments to posts
```

### Resource Hub
```bash
GET    /api/resources           # Curated learning resources
POST   /api/resources           # Add new resource (community)
PUT    /api/resources/:id       # Update resource information
GET    /api/resources/search    # Search resources by criteria
POST   /api/resources/bookmark/:id # Bookmark favorite resources
```

### Career Development
```bash
GET    /api/career-guidance     # Career advice and tips
POST   /api/career-guidance     # Contribute career insights
PUT    /api/career-guidance/:id # Update guidance content
GET    /api/career/trends       # Industry trends and insights
```

## 🎨 Key Components & Features

### Frontend Architecture
- **App.jsx** - Main application router with context providers and theme management
- **Home.jsx** - Responsive landing page with feature showcase and call-to-action sections
- **RoadmapExplore.jsx** - Interactive roadmap browser with search, filtering, and category organization
- **RoadmapLearning.jsx** - Immersive learning interface with progress tracking and step-by-step guidance
- **ResourceHub.jsx** - Curated learning resource library with advanced filtering and bookmarking
- **CommunityInsights.jsx** - Social learning platform with discussion threads and user engagement
- **CareerGuidance.jsx** - Professional development section with expert advice and industry insights

### User Experience Features
- **Responsive Design** - Mobile-first approach with seamless cross-device compatibility
- **Modern UI/UX** - Clean, intuitive interface with consistent design language
- **Smooth Animations** - Framer Motion integration for engaging micro-interactions
- **Dark/Light Themes** - User preference-based theme switching with system detection
- **Progressive Loading** - Optimized performance with lazy loading and code splitting
- **Accessibility** - WCAG compliant design with keyboard navigation and screen reader support

### Backend Capabilities
- **RESTful API Design** - Well-structured endpoints following REST conventions
- **Data Validation** - Comprehensive input validation and sanitization using express-validator
- **Error Handling** - Centralized error management with meaningful error responses
- **Authentication Security** - bcrypt password hashing with secure session management
- **Database Optimization** - Efficient MongoDB queries with proper indexing
- **CORS Configuration** - Secure cross-origin request handling

## 🔒 Security & Performance

### Security Implementation
- **Authentication**: Passport.js with local strategy and bcrypt password hashing
- **Session Management**: Secure session handling with express-session and connect-mongo
- **Input Validation**: express-validator for comprehensive data sanitization
- **CORS Protection**: Configured cross-origin resource sharing policies
- **Environment Variables**: Secure configuration management for sensitive data
- **Password Security**: Industry-standard bcrypt hashing with salt rounds

### Performance Optimizations
- **Database Indexing**: Optimized MongoDB queries with proper indexing strategies
- **Frontend Bundling**: Vite build optimization for faster load times
- **Code Splitting**: React lazy loading for improved initial page load
- **API Efficiency**: RESTful design patterns for minimal data transfer
- **Caching Strategies**: Browser caching and session storage optimization
- **Error Boundaries**: React error boundaries for graceful error handling

## 🚀 Deployment & DevOps

### Production Deployment
- **Platform**: Railway.com cloud hosting with automatic deployments
- **Containerization**: Docker for consistent environment across development and production
- **CI/CD Pipeline**: GitHub integration with automatic builds on push
- **Environment Management**: Separate configurations for development and production
- **Health Monitoring**: Railway health checks and restart policies
- **SSL/TLS**: Automatic HTTPS encryption for secure data transmission

### Development Workflow
```bash
# Development Commands
npm run start:dev    # Backend development with nodemon
npm run dev         # Frontend development with Vite hot reload
npm run build       # Production build optimization
npm run lint        # Code quality checks with ESLint
```

## 📈 Future Roadmap

### Planned Enhancements
- **AI-Powered Recommendations** - Machine learning for personalized learning paths
- **Mobile Application** - React Native iOS/Android apps
- **Video Learning Integration** - Embedded video tutorials and interactive content
- **Certification System** - Skill verification and digital certificates
- **Advanced Analytics** - Detailed learning insights and performance metrics
- **API Ecosystem** - Third-party integrations and developer API access
- **Mentorship Platform** - Connect learners with industry experts
- **Gamification** - Achievement systems, leaderboards, and learning challenges

## 🤝 Contributing

I welcome contributions from developers who want to improve the learning experience! Here's how you can get involved:

### Development Process
1. **Fork the repository** and create your feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Set up your development environment**
   ```bash
   # Install dependencies for both frontend and backend
   cd express && npm install
   cd ../Frontend/Road2Skill && npm install
   ```

3. **Make your changes** following the project conventions
   - Follow React best practices and modern hooks patterns
   - Use consistent naming conventions across components
   - Write clean, well-documented code with meaningful comments
   - Ensure responsive design compatibility

4. **Test thoroughly** before submitting
   ```bash
   npm run lint        # Check code quality
   npm run build       # Test production build
   ```

5. **Submit your contribution**
   ```bash
   git commit -m 'Add amazing feature'
   git push origin feature/amazing-feature
   ```
   Then open a Pull Request with detailed description of changes.

### Code Standards
- **ES6+** modern JavaScript features
- **React Hooks** functional component patterns
- **RESTful API** design principles
- **MongoDB** best practices for data modeling
- **Responsive Design** mobile-first approach

## 📞 Contact & Links

### Project Information
- **🌐 Live Demo**: [https://road2skill-production.up.railway.app/](https://road2skill-production.up.railway.app/)
- **📂 GitHub Repository**: [https://github.com/Sahil0502/Road2Skill](https://github.com/Sahil0502/Road2Skill)
- **👨‍💻 Developer**: Sahil Singh
- **📧 Contact**: [sahilsinghm32@gmail.com]
- **💼 LinkedIn**: [https://www.linkedin.com/in/sahil-singh-ss9824/]

### Project Statistics
- **🔧 Backend**: Node.js, Express.js, MongoDB
- **🎨 Frontend**: React.js, Vite, Framer Motion
- **🚀 Deployment**: Railway.com, Docker
- **📊 Database**: MongoDB with Mongoose ODM
- **🔐 Authentication**: Passport.js with bcrypt
- **📱 Responsive**: Mobile-first design approach

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open Source Community** - For the amazing tools and libraries that made this project possible
- **Modern Web Standards** - Following industry best practices for full-stack development
- **Learning Community** - Inspired by the need for accessible, structured skill development

---

<div align="center">

**⭐ Road2Skill - Empowering developers through structured learning paths ⭐**

*Built with passion for education and modern web technologies*

**[🚀 Try Live Demo](https://road2skill-production.up.railway.app/)** | **[⭐ Star this repository](https://github.com/Sahil0502/Road2Skill)** | **[🐛 Report Issues](https://github.com/Sahil0502/Road2Skill/issues)**

</div> 
