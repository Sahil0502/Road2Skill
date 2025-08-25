import { Router } from 'express';
import axios from 'axios';
import { User } from '../mongoose/schemas/user.mjs';

const router = Router();

// API Keys from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Validate that API keys are configured
if (!GEMINI_API_KEY) {
  console.warn('⚠️  GEMINI_API_KEY not found in environment variables');
}
if (!YOUTUBE_API_KEY) {
  console.warn('⚠️  YOUTUBE_API_KEY not found in environment variables');
}

// Store user onboarding data
router.post('/api/user/onboarding', async (request, response) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'User not authenticated' });
    }

    const onboardingData = request.body;
    
    // Save to database
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    user.onboarding = {
      ...onboardingData,
      completed: true,
      completedAt: new Date()
    };

    await user.save();

    // Also store in session for immediate use
    request.session.userProfile = {
      ...onboardingData,
      userId,
      completedOnboarding: true,
      createdAt: new Date()
    };

    response.json({ 
      message: 'Onboarding completed successfully',
      profile: user.onboarding 
    });
  } catch (error) {
    console.error('Error saving onboarding data:', error);
    response.status(500).json({ error: 'Failed to save onboarding data' });
  }
});

// Get user profile
router.get('/api/user/profile', async (request, response) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'User not authenticated' });
    }

    // Get profile from database
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    const profile = user.onboarding.completed ? user.onboarding : { completedOnboarding: false };
    response.json(profile);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    response.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Generate personalized recommendations using Gemini AI
router.post('/api/recommendations/generate', async (request, response) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'User not authenticated' });
    }

    // Get user profile from database
    const user = await User.findById(userId);
    if (!user || !user.onboarding.completed) {
      return response.status(400).json({ error: 'User profile is incomplete. Please complete onboarding first.' });
    }

    const userProfile = user.onboarding;
    console.log('Generating recommendations for user:', userId);
    console.log('User profile:', userProfile);

    if (!userProfile.domains || userProfile.domains.length === 0) {
      return response.status(400).json({ error: 'User profile is incomplete. Please complete onboarding first.' });
    }

    // Create prompt for Gemini AI
    const prompt = createRecommendationPrompt(userProfile);
    
    // Generate recommendations using Gemini AI
    console.log('Attempting to generate recommendations with Gemini AI...');
    const recommendations = await generateWithGemini(prompt, userProfile);
    console.log('Generated recommendations using Gemini AI:', recommendations);
    
    // Get YouTube videos
    const videos = await getYouTubeRecommendations(userProfile);
    console.log('Generated videos:', videos);
    
    // Save recommendations to database
    user.recommendations = {
      ...recommendations,
      videos,
      lastGenerated: new Date()
    };
    await user.save();

    // Also store in session for immediate use
    request.session.recommendations = {
      ...recommendations,
      videos,
      generatedAt: new Date(),
      userId
    };

    response.json({
      message: 'Recommendations generated successfully',
      recommendations: user.recommendations
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    response.status(500).json({ error: 'Failed to generate recommendations. Ensure Gemini API key is configured correctly.' });
  }
});

// Get user recommendations
router.get('/api/recommendations', async (request, response) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'User not authenticated' });
    }

    // Get recommendations from database
    const user = await User.findById(userId);
    if (!user || !user.recommendations.lastGenerated) {
      return response.json(null);
    }

    response.json(user.recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    response.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Update user onboarding preferences
router.put('/api/user/onboarding', async (request, response) => {
  try {
    const userId = request.user?.id;
    if (!userId) {
      return response.status(401).json({ error: 'User not authenticated' });
    }

    const updatedData = request.body;
    
    // Update user onboarding data in database
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ error: 'User not found' });
    }

    user.onboarding = {
      ...user.onboarding,
      ...updatedData,
      completed: true,
      completedAt: user.onboarding.completedAt || new Date()
    };

    await user.save();

    response.json({ 
      message: 'Onboarding preferences updated successfully',
      profile: user.onboarding 
    });
  } catch (error) {
    console.error('Error updating onboarding preferences:', error);
    response.status(500).json({ error: 'Failed to update onboarding preferences' });
  }
});

// Generate AI notes for a specific topic
router.post('/api/ai/generate-notes', async (request, response) => {
  try {
    const { topic, userProfile } = request.body;
    
    const prompt = createNotesPrompt(topic, userProfile);
    const notes = await generateNotesWithGemini(prompt, topic);
    
    response.json(notes);
  } catch (error) {
    console.error('Error generating notes:', error);
    response.status(500).json({ error: 'Failed to generate notes. Ensure Gemini API key is configured correctly.' });
  }
});

// Test Gemini API
router.get('/api/test/gemini', async (request, response) => {
  try {
    console.log('Testing Gemini API...');
    console.log('API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');
    
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'mock-key') {
      return response.json({ 
        status: 'error', 
        message: 'Gemini API key not configured',
        apiKey: 'Missing or mock key'
      });
    }

    const testPrompt = 'Hello! Please respond with a simple JSON object containing a greeting message.';
    
    const apiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Gemini API Response:', apiResponse.data);
    
    response.json({
      status: 'success',
      message: 'Gemini API is working',
      response: apiResponse.data.candidates[0].content.parts[0].text
    });

  } catch (error) {
    console.error('Gemini API Test Error:', error.response?.data || error.message);
    response.json({
      status: 'error',
      message: 'Gemini API test failed',
      error: error.response?.data || error.message
    });
  }
});

// Test YouTube Data API
router.get('/api/test/youtube', async (request, response) => {
  try {
    console.log('Testing YouTube API...');
    console.log('API Key:', YOUTUBE_API_KEY ? 'Present' : 'Missing');
    
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'mock-key') {
      return response.json({ 
        status: 'error', 
        message: 'YouTube API key not configured',
        apiKey: 'Missing or mock key'
      });
    }

    // Test with search endpoint (ensure YouTube Data API v3 is enabled in Google Cloud Console)
    const testUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=python%20tutorial&type=video&maxResults=3&key=${YOUTUBE_API_KEY}`;

    console.log('Trying YouTube search endpoint...');
    const apiResponse = await axios.get(testUrl);
        
    response.json({
      status: 'success',
      message: 'YouTube API is working (search endpoint)',
      videosFound: apiResponse.data.items?.length || 0
    });

  } catch (error) {
    console.error('YouTube API Test Error:', error.response?.data || error.message);
    response.json({
      status: 'error',
      message: 'YouTube API test failed - API key may need additional permissions',
      error: error.response?.data || error.message,
      suggestion: 'Enable YouTube Data API v3 in Google Cloud Console, ensure API key has no restrictions or proper scopes, and verify quota availability.'
    });
  }
});

// Bookmark item
router.post('/api/user/bookmark', async (request, response) => {
  try {
    const { type, itemId } = request.body;
    const userId = request.user?.id;

    if (!request.session.bookmarks) {
      request.session.bookmarks = [];
    }

    const bookmark = {
      id: Date.now().toString(),
      type,
      itemId,
      userId,
      createdAt: new Date()
    };

    request.session.bookmarks.push(bookmark);

    response.json({ message: 'Item bookmarked successfully', bookmark });
  } catch (error) {
    console.error('Error bookmarking item:', error);
    response.status(500).json({ error: 'Failed to bookmark item' });
  }
});

// Helper function to create recommendation prompt (optimized for best results)
function createRecommendationPrompt(userProfile) {
  return `
    You are an expert learning path curator. Generate highly personalized, real-time learning recommendations based on the user's profile. Ensure recommendations are current, diverse, and tailored to the user's experience, goals, and style. Avoid generic suggestions; focus on actionable, high-quality paths and resources. Always generate at least 3 roadmaps and 5 resources, even if the profile is general.

    User Profile:
    - Experience Level: ${userProfile.experience}
    - Interested Domains: ${userProfile.domains?.join(', ') || 'General Programming'}
    - Current Study: ${userProfile.currentStudy || 'No specific current study'}
    - Learning Goals: ${userProfile.goals?.join(', ') || 'Skill improvement'}
    - Time Commitment: ${userProfile.timeCommitment} hours per week
    - Preferred Learning Style: ${userProfile.preferredLearningStyle || 'Mixed'}
    - Current Skills: ${userProfile.currentSkills?.join(', ') || 'None specified'}

    Provide:
    1. 3-5 personalized learning roadmaps (step-by-step paths) with difficulty, estimated time, match score (0-100), and 2-3 specific reasons why it fits the user.
    2. 5-8 relevant resources (mix of free articles, official docs, online courses, tutorials from reputable sources like freeCodeCamp, Coursera, official docs, etc.). Include URLs to real, current resources.
    3. For each roadmap and resource, ensure alignment with user's time, style (e.g., hands-on projects for hands-on style), and goals (e.g., career-focused if goal is career change).

    Output strictly as valid JSON (no extra text, markdown, or explanations):
    {
      "roadmaps": [
        {
          "id": "unique-string-id",
          "title": "Roadmap Title",
          "description": "Detailed step-by-step description (3-5 steps)",
          "difficulty": "Beginner|Intermediate|Advanced",
          "estimatedTime": "X-Y months at user's time commitment",
          "matchScore": 85,
          "reasons": ["Reason 1 tailored to profile", "Reason 2"]
        }
      ],
      "resources": [
        {
          "id": "unique-string-id",
          "title": "Resource Title",
          "type": "Article|Documentation|Tutorial|Course|Book",
          "source": "Source name (e.g., freeCodeCamp, MDN)",
          "readTime": "X hours/minutes",
          "difficulty": "Beginner|Intermediate|Advanced",
          "url": "https://real-url.com (must be a valid, current link)"
        }
      ]
    }

    Ensure JSON is parseable and all fields are filled appropriately. Prioritize quality over quantity.
  `;
}

// Helper function to create notes prompt (optimized for best results)
function createNotesPrompt(topic, userProfile) {
  return `
    You are an expert educator creating comprehensive, personalized study notes for the topic: "${topic}".

    Tailor the notes to the user's context:
    - Experience level: ${userProfile?.experience || 'Intermediate'}
    - Learning style: ${userProfile?.preferredLearningStyle || 'Mixed'} (e.g., include more examples/code if hands-on)
    - Current skills: ${userProfile?.currentSkills?.join(', ') || 'General programming'}
    - Goals: ${userProfile?.goals?.join(', ') || 'Skill improvement'} (e.g., emphasize practical applications if career-focused)

    Structure the notes for easy review:
    1. Introduction and Key Concepts: Core definitions, fundamentals, and why it matters.
    2. Detailed Explanations: Break down complex ideas with analogies suitable for user's experience.
    3. Practical Examples: Include code snippets, real-world use cases, or step-by-step walkthroughs (2-4 examples).
    4. Important Points to Remember: Bullet list of key takeaways, tips, and best practices.
    5. Common Pitfalls and Troubleshooting: Warnings, common errors, and how to avoid/fix them.
    6. Next Steps: 3-5 suggestions for advanced topics, projects, or related resources with URLs.

    Keep notes concise yet thorough (800-1500 words), engaging, and optimized for retention. Use markdown for formatting (headings, bullets, code blocks).

    Output only the structured notes as plain text (no extra introductions or JSON).
  `;
}

// Generate AI-powered recommendations using Gemini API
async function generateWithGemini(prompt, userProfile) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'mock-key') {
      throw new Error('Gemini API key not configured');
    }

    console.log('Using real Gemini API...');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    let aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini AI Raw Response:', aiResponse);

    // Clean the response to remove potential markdown wrappers
    let cleanedResponse = aiResponse.trim();
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.slice(7).trim();
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.slice(0, -3).trim();
    }

    try {
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      throw new Error('Failed to parse Gemini response');
    }
  } catch (error) {
    console.error('Error with Gemini API:', error);
    throw error;
  }
}

// Generate AI notes using Gemini API
async function generateNotesWithGemini(prompt, topic) {
  try {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === 'mock-key') {
      throw new Error('Gemini API key not configured');
    }

    console.log('Using real Gemini API for notes...');
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.candidates[0].content.parts[0].text;
    console.log('Gemini AI Notes Response:', aiResponse);

    return {
      id: Date.now().toString(),
      title: `${topic} - Study Notes`,
      content: aiResponse,
      topic,
      createdAt: new Date().toISOString(),
      aiGenerated: true
    };
  } catch (error) {
    console.error('Error generating notes with Gemini:', error);
    throw error;
  }
}

// Get personalized YouTube video recommendations using real YouTube Data API
// Note: Ensure YouTube Data API v3 is enabled in Google Cloud Console and API key has no restrictions (or proper IP/browser referrals if restricted).
// Common issues: Quota exceeded, forbidden (403) - check console for quotas and enable the API fully.
async function getYouTubeRecommendations(userProfile) {
  try {
    const { experience, domains, currentSkills, preferredLearningStyle, goals } = userProfile;
    
    if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'mock-key') {
      throw new Error('YouTube API key not configured');
    }

    let allVideos = [];
    
    // Create dynamic search queries based on user profile for better relevance
    const searchQueries = domains.map(domain => {
      return [
        `${experience} ${domain} tutorial ${preferredLearningStyle.toLowerCase()}`,
        `${domain} for ${goals.join(' ')} ${currentSkills.join(' ')}`,
        `best ${domain} course ${experience} level`
      ];
    }).flat();

    // Add general query if needed
    if (searchQueries.length < 3) {
      searchQueries.push(`${experience} programming tutorial ${preferredLearningStyle.toLowerCase()}`);
    }

    console.log('YouTube search queries:', searchQueries);

    for (const query of searchQueries) { // Increased to all queries, but monitor quota
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        
        const items = response.data.items || [];
        
        const videos = items.map(item => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url,
          publishedAt: item.snippet.publishedAt,
          description: item.snippet.description,
          relevance: 'High',
          relevanceScore: calculateVideoRelevance(item.snippet, userProfile),
          query: query
        }));

        allVideos.push(...videos);
      } catch (queryError) {
        console.log(`Query "${query}" failed:`, queryError.response?.data?.error?.message || queryError.message);
      }
    }

    // Remove duplicates and sort by relevance
    const uniqueVideos = allVideos.filter((video, index, self) => 
      index === self.findIndex(v => v.id === video.id)
    );

    uniqueVideos.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    console.log(`Found ${uniqueVideos.length} unique videos from YouTube API`);
    
    if (uniqueVideos.length === 0) {
      throw new Error('No videos found - check YouTube API quotas or permissions');
    }

    return uniqueVideos.slice(0, 6); // Top 6 videos

  } catch (error) {
    console.error('Error fetching YouTube recommendations:', error);
    throw error;
  }
}

// Calculate video relevance score based on user profile
function calculateVideoRelevance(snippet, userProfile) {
  let score = 50; // Base score
  
  const title = snippet.title.toLowerCase();
  const description = snippet.description.toLowerCase();
  const content = `${title} ${description}`;
  
  // Check for experience level match
  if (content.includes(userProfile.experience.toLowerCase())) {
    score += 20;
  }
  
  // Check for domain keywords
  userProfile.domains.forEach(domain => {
    if (content.includes(domain.toLowerCase())) {
      score += 15;
    }
  });
  
  // Check for current skills
  userProfile.currentSkills.forEach(skill => {
    if (content.includes(skill.toLowerCase())) {
      score += 10;
    }
  });
  
  // Learning style keywords
  const styleKeywords = {
    'hands-on': ['project', 'build', 'code along'],
    'visual': ['video', 'diagram', 'animation'],
    'theoretical': ['concept', 'theory', 'explanation']
  };
  const userStyle = userProfile.preferredLearningStyle.toLowerCase();
  if (styleKeywords[userStyle]) {
    styleKeywords[userStyle].forEach(keyword => {
      if (content.includes(keyword)) {
        score += 5;
      }
    });
  }
  
  // Boost for educational channels
  const educationalChannels = ['freecodecamp', 'programming with mosh', 'traversy media', 'tech with tim', 'corey schafer', 'sentdex', '3blue1brown'];
  if (educationalChannels.some(channel => snippet.channelTitle.toLowerCase().includes(channel))) {
    score += 15;
  }
  
  return Math.min(score, 100);
}

export default router;