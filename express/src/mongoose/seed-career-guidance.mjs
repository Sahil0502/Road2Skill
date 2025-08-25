import { CareerGuidance } from './schemas/community.mjs';
import { User } from './schemas/user.mjs';

export const seedCareerGuidance = async () => {
  try {
    console.log('Seeding career guidance...');
    
    // Get the system user to use as author
    const systemUser = await User.findOne({ email: 'system@road2skill.com' });
    if (!systemUser) {
      console.error('System user not found. Please seed users first.');
      return;
    }

    // Check if career guidance already exists
    const existingGuidance = await CareerGuidance.findOne();
    if (existingGuidance) {
      console.log('Career guidance already exists, skipping seeding');
      return;
    }

    const careerGuidanceData = [
      {
        title: "How to Write a Professional Software Developer Resume",
        content: `Creating an outstanding software developer resume is crucial for landing your dream job. Here are key tips:

**Technical Skills Section:**
- List programming languages, frameworks, and tools you're proficient in
- Organize by proficiency level (Advanced, Intermediate, Beginner)
- Include relevant certifications and courses

**Project Showcase:**
- Include 3-5 significant projects with GitHub links
- Describe technologies used and your specific contributions
- Quantify impact where possible (e.g., "Improved performance by 40%")

**Experience Description:**
- Use action verbs (Developed, Implemented, Optimized)
- Focus on achievements, not just responsibilities
- Include metrics and business impact

**Keep it Concise:**
- 1-2 pages maximum
- Use clean, professional formatting
- Ensure it's ATS-friendly with standard fonts and clear section headers`,
        category: "resume",
        targetRole: "Software Developer",
        experienceLevel: "all",
        author: systemUser._id,
        tags: ["resume", "software-development", "career-tips", "job-search"]
      },
      {
        title: "Mastering Technical Interviews: Complete Guide",
        content: `Technical interviews can be challenging, but with proper preparation, you can excel. Here's your comprehensive guide:

**Before the Interview:**
- Research the company's tech stack and recent projects
- Practice coding problems on LeetCode, HackerRank, or CodeSignal
- Review system design fundamentals
- Prepare thoughtful questions about the role and team

**During the Interview:**
- Think out loud - explain your thought process
- Start with a simple solution, then optimize
- Ask clarifying questions about requirements
- Test your code with examples
- Discuss trade-offs and alternative approaches

**Common Topics to Review:**
- Data structures (arrays, linked lists, trees, graphs)
- Algorithms (sorting, searching, dynamic programming)
- Time and space complexity analysis
- System design principles
- Database concepts and SQL

**Behavioral Questions:**
- Prepare STAR method responses
- Have examples of challenges overcome
- Show your problem-solving approach`,
        category: "interview",
        targetRole: "Software Engineer",
        experienceLevel: "all",
        author: systemUser._id,
        tags: ["interview", "technical-interview", "coding", "preparation"]
      },
      {
        title: "Building an Impressive Developer Portfolio",
        content: `Your portfolio is often the first impression potential employers have of your work. Make it count:

**Essential Elements:**
- Clean, responsive design that works on all devices
- About section with your story and passion for development
- Contact information and links to GitHub, LinkedIn
- 3-5 quality projects showcasing different skills

**Project Presentation:**
- Include live demos and source code links
- Write clear project descriptions explaining the problem solved
- Detail technologies used and your role
- Add screenshots or GIFs showing functionality
- Explain challenges faced and how you overcame them

**Technical Implementation:**
- Use modern web technologies (React, Vue, or vanilla JS)
- Ensure fast loading times and good SEO
- Implement proper accessibility features
- Make it mobile-responsive

**Content Strategy:**
- Regular blog posts about your learning journey
- Code snippets and tutorials
- Keep it updated with your latest work
- Show your personality and communication skills

**Pro Tips:**
- Get feedback from other developers
- A/B test different layouts
- Include testimonials if available`,
        category: "portfolio",
        targetRole: "Web Developer",
        experienceLevel: "entry",
        author: systemUser._id,
        tags: ["portfolio", "web-development", "showcase", "projects"]
      },
      {
        title: "Effective Networking Strategies for Developers",
        content: `Networking is crucial for career growth in tech. Here's how to build meaningful professional relationships:

**Online Networking:**
- Be active on GitHub - contribute to open source projects
- Share knowledge on Twitter/X and LinkedIn
- Join developer communities (Discord, Slack, Reddit)
- Participate in Stack Overflow discussions
- Write technical blog posts and share insights

**Offline Networking:**
- Attend local meetups and tech conferences
- Join professional organizations (ACM, IEEE)
- Participate in hackathons and coding competitions
- Volunteer at tech events
- Take part in coding bootcamp alumni networks

**Building Relationships:**
- Give before you ask - help others first
- Be genuine in your interactions
- Follow up after meeting new contacts
- Offer to help with projects or knowledge sharing
- Remember personal details and follow up on them

**Maintaining Your Network:**
- Regular check-ins with contacts
- Share relevant opportunities with your network
- Celebrate others' successes
- Ask for advice and guidance when appropriate
- Provide value through introductions and recommendations`,
        category: "networking",
        targetRole: "Software Engineer",
        experienceLevel: "all",
        author: systemUser._id,
        tags: ["networking", "career-growth", "relationships", "community"]
      },
      {
        title: "Effective Job Search Strategies for Tech Professionals",
        content: `Finding the right tech job requires a strategic approach. Here's your roadmap to success:

**Job Search Platforms:**
- AngelList (for startups)
- LinkedIn Jobs with relevant keywords
- Indeed, Glassdoor for company research
- Company career pages directly
- Tech-specific boards like Stack Overflow Jobs

**Application Strategy:**
- Quality over quantity - tailor each application
- Research the company and role thoroughly
- Write personalized cover letters when required
- Apply within 24-48 hours of job posting
- Track applications and follow-up dates

**Leveraging Your Network:**
- Inform your network about your job search
- Ask for referrals from current employees
- Reach out to recruiters in your field
- Connect with hiring managers on LinkedIn
- Attend virtual and in-person networking events

**Preparation Timeline:**
- Update LinkedIn profile and resume
- Prepare portfolio and GitHub repositories
- Practice coding problems and system design
- Research salary ranges for your target roles
- Prepare thoughtful questions for interviews

**Red Flags to Avoid:**
- Unrealistic promises or compensation
- Poor communication during interview process
- Negative reviews on Glassdoor consistently
- Lack of clear job description or requirements`,
        category: "job-search",
        targetRole: "Software Developer",
        experienceLevel: "all",
        author: systemUser._id,
        tags: ["job-search", "applications", "strategy", "career-tips"]
      },
      {
        title: "Successfully Transitioning to a Tech Career",
        content: `Making a career change into tech is challenging but rewarding. Here's your step-by-step guide:

**Skill Assessment and Planning:**
- Identify transferable skills from your current career
- Choose a tech path that aligns with your interests
- Create a realistic timeline (6-18 months typically)
- Set specific, measurable learning goals
- Consider bootcamps vs. self-study vs. formal education

**Building Technical Skills:**
- Start with fundamentals (HTML, CSS, JavaScript for web dev)
- Build projects that solve real problems
- Contribute to open source projects
- Get certifications relevant to your chosen field
- Practice regularly and consistently

**Gaining Experience:**
- Start with freelance projects or volunteer work
- Build a strong portfolio showcasing your abilities
- Consider internships or apprenticeships
- Network with professionals in your target field
- Attend industry meetups and conferences

**Overcoming Common Challenges:**
- Imposter syndrome - everyone starts somewhere
- Age concerns - focus on your unique value proposition
- Salary expectations - consider it a long-term investment
- Time management - balance learning with current responsibilities

**Financial Considerations:**
- Build an emergency fund before transitioning
- Consider part-time learning while employed
- Research salary expectations in your target role
- Factor in potential temporary income reduction`,
        category: "career-change",
        targetRole: "Career Changer",
        experienceLevel: "entry",
        author: systemUser._id,
        tags: ["career-change", "transition", "learning", "skill-building"]
      },
      {
        title: "Essential Skills for Senior Software Engineers",
        content: `Moving from mid-level to senior requires developing both technical and leadership skills:

**Advanced Technical Skills:**
- System design and architecture decisions
- Performance optimization and scalability
- Code review and mentoring abilities
- Understanding of multiple programming paradigms
- DevOps and infrastructure knowledge

**Leadership and Communication:**
- Technical leadership without formal authority
- Cross-team collaboration and communication
- Mentoring junior developers
- Project planning and estimation
- Stakeholder management and business alignment

**Problem-Solving Approach:**
- Breaking down complex problems
- Making architectural decisions with trade-offs
- Debugging complex distributed systems
- Performance analysis and optimization
- Risk assessment and mitigation strategies

**Career Development:**
- Contributing to technical strategy
- Building and leading technical initiatives
- Participating in hiring and team building
- External representation (tech talks, writing)
- Continuous learning and staying current

**Measuring Impact:**
- Focus on team and organizational outcomes
- Improve development velocity and quality
- Reduce technical debt and system complexity
- Enable other team members to be more effective
- Drive adoption of best practices and standards`,
        category: "interview",
        targetRole: "Senior Software Engineer",
        experienceLevel: "senior",
        author: systemUser._id,
        tags: ["senior-engineer", "leadership", "technical-skills", "career-growth"]
      },
      {
        title: "Building Your Personal Brand as a Developer",
        content: `In today's competitive tech market, personal branding sets you apart:

**Content Creation:**
- Write technical blog posts about your learning journey
- Create video tutorials or coding streams
- Share code snippets and mini-tutorials on social media
- Speak at meetups or conferences
- Contribute to technical documentation

**Social Media Presence:**
- LinkedIn: Share professional insights and achievements
- Twitter/X: Engage with tech community and share knowledge
- GitHub: Showcase your code and contribute to open source
- YouTube: Create educational content or project walkthroughs
- Dev.to: Write technical articles and engage with community

**Consistency is Key:**
- Regular posting schedule
- Consistent voice and messaging
- Professional but authentic personality
- Engage meaningfully with others' content
- Share both successes and learning experiences

**Building Authority:**
- Choose 2-3 technologies to specialize in
- Share opinions on industry trends
- Help solve others' technical problems
- Curate valuable resources for your audience
- Collaborate with other developers and creators

**Networking Through Branding:**
- Connect with like-minded professionals
- Participate in online tech communities
- Offer help and advice to newcomers
- Build relationships with other content creators
- Leverage your brand for job opportunities`,
        category: "networking",
        targetRole: "Developer",
        experienceLevel: "mid",
        author: systemUser._id,
        tags: ["personal-brand", "content-creation", "social-media", "networking"]
      },
      {
        title: "Negotiating Your Software Engineer Salary",
        content: `Salary negotiation is a crucial skill that can significantly impact your career earnings:

**Research and Preparation:**
- Use sites like levels.fyi, Glassdoor, and PayScale
- Consider location, company size, and industry
- Factor in total compensation (equity, benefits, bonuses)
- Know your market value and unique strengths
- Prepare specific examples of your impact and achievements

**Timing Your Negotiation:**
- Wait for an offer before discussing numbers
- Never negotiate over email if possible
- Schedule a dedicated call for the conversation
- Be prepared to discuss immediately or ask for time
- Consider multiple offers for leverage

**Negotiation Strategies:**
- Start with gratitude for the offer
- Present data-driven reasoning for your request
- Focus on value you bring to the company
- Be prepared to negotiate beyond base salary
- Consider signing bonuses, equity, or flexible work arrangements

**What to Negotiate:**
- Base salary (most important)
- Equity/stock options
- Signing bonus for immediate needs
- Vacation time and flexible work arrangements
- Professional development budget
- Remote work options

**Common Mistakes to Avoid:**
- Accepting the first offer without consideration
- Making demands without justification
- Focusing only on salary, ignoring total compensation
- Being aggressive or threatening
- Not having a backup plan if negotiation fails`,
        category: "job-search",
        targetRole: "Software Engineer",
        experienceLevel: "mid",
        author: systemUser._id,
        tags: ["salary-negotiation", "compensation", "career-tips", "job-offer"]
      },
      {
        title: "Remote Work Best Practices for Developers",
        content: `Remote work is increasingly common in tech. Here's how to excel in a distributed environment:

**Setting Up Your Workspace:**
- Dedicated workspace with good lighting
- Ergonomic chair and proper desk setup
- Reliable internet and backup connectivity
- Quality microphone and camera for meetings
- Multiple monitors for productivity

**Communication Excellence:**
- Over-communicate progress and blockers
- Use asynchronous communication effectively
- Be responsive during core collaboration hours
- Document decisions and processes clearly
- Master your team's communication tools

**Time Management:**
- Establish clear boundaries between work and personal time
- Use time-blocking for focused work sessions
- Take regular breaks and practice the Pomodoro Technique
- Maintain consistent working hours
- Communicate your availability to team members

**Staying Connected:**
- Participate actively in virtual team meetings
- Schedule regular 1:1s with your manager
- Join virtual coffee chats and team bonding activities
- Contribute to team chat channels
- Be proactive in reaching out for help

**Professional Development:**
- Join virtual conferences and workshops
- Participate in online tech communities
- Schedule time for learning and skill development
- Seek feedback regularly from peers and managers
- Maintain visibility of your work and achievements`,
        category: "job-search",
        targetRole: "Remote Developer",
        experienceLevel: "all",
        author: systemUser._id,
        tags: ["remote-work", "productivity", "communication", "work-life-balance"]
      }
    ];

    await CareerGuidance.insertMany(careerGuidanceData);
    console.log(`Successfully seeded ${careerGuidanceData.length} career guidance entries`);
    
  } catch (error) {
    console.error('Error seeding career guidance:', error);
  }
};
