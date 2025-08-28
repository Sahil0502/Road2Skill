// API configuration for different environments
const getApiBaseUrl = () => {
  // In production, use relative URLs (same domain)
  if (import.meta.env.PROD) {
    return '';
  }
  
  // In development, use localhost
  return 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    STATUS: '/api/auth/status',
    REGISTER: '/api/users',
  },
  ROADMAPS: {
    GET_ALL: '/api/auth/contributions',
    GET_BY_ID: '/api/auth/contributions',
    CREATE: '/api/auth/contributions',
  },
  USER: {
    PROGRESS: '/api/user/progress',
    PROFILE: '/api/user/profile',
    ONBOARDING: '/api/user/onboarding',
  },
  COMMUNITY: {
    POSTS: '/api/community/posts',
  },
  RESOURCES: {
    GET_ALL: '/api/resources',
  },
  CAREER: {
    GUIDANCE: '/api/career-guidance',
  },
  RECOMMENDATIONS: {
    GENERATE: '/api/recommendations/generate',
  }
};
