import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refreshToken }
          );

          const newAccessToken = data.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data: { email: string; password: string }) => 
    api.post('/auth/login', data),
  register: (data: { email: string; password: string; fullName: string; role: string }) => 
    api.post('/auth/register', data),
  verifyEmail: (token: string) => 
    api.post('/auth/verify-email', { token }),
  forgotPassword: (email: string) => 
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, newPassword: string) => 
    api.post('/auth/reset-password', { token, newPassword }),
  getProfile: () => 
    api.get('/auth/me'),
  logout: () => 
    api.post('/auth/logout'),
};

// Simulations API
export const simulationsAPI = {
  getAll: (params?: any) => 
    api.get('/simulations', { params }),
  getById: (id: string) => 
    api.get(`/simulations/${id}`),
  interact: (postId: string, interactionType: string) => 
    api.post(`/simulations/posts/${postId}/interact`, { interactionType }),
  getProgress: () => 
    api.get('/simulations/student/progress'),
};

// AI Mentor API
export const aiMentorAPI = {
  chat: (message: string, context?: any) => 
    api.post('/ai-mentor/chat', { message, context }),
  getHint: (postId: string, simulationId?: string) => 
    api.get(`/ai-mentor/hint/${postId}`, { params: { simulationId } }),
  getExplanation: (topic: string) => 
    api.post('/ai-mentor/explanation', { topic }),
  getRecommendations: () => 
    api.get('/ai-mentor/recommendations'),
};

// Gamification API
export const gamificationAPI = {
  getProgress: () => 
    api.get('/gamification/progress'),
  getBadges: () => 
    api.get('/gamification/badges'),
  getLeaderboard: (limit?: number) => 
    api.get('/gamification/leaderboard', { params: { limit } }),
  getDailyChallenge: () => 
    api.get('/gamification/daily-challenge'),
  completeDailyChallenge: (challengeId: string) => 
    api.post(`/gamification/daily-challenge/${challengeId}/complete`),
  checkBadges: () => 
    api.post('/gamification/check-badges'),
};

// Quiz API
export const quizAPI = {
  getAll: (params?: any) => 
    api.get('/quiz', { params }),
  getById: (id: string) => 
    api.get(`/quiz/${id}`),
  submitAnswer: (quizId: string, questionId: string, answer: any) => 
    api.post(`/quiz/${quizId}/questions/${questionId}/answer`, { answer }),
  getResults: () => 
    api.get('/quiz/student/results'),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => 
    api.get('/analytics/dashboard'),
  getMyProgress: () => 
    api.get('/analytics/my-progress'),
  getTeacherDashboard: () => 
    api.get('/analytics/teacher'),
  getCommonBiases: () => 
    api.get('/analytics/common-biases'),
};

// Fact Check API
export const factCheckAPI = {
  getBiasTypes: () => 
    api.get('/fact-check/bias-types'),
  getTips: () => 
    api.get('/fact-check/tips'),
  analyzeContent: (content: string) => 
    api.post('/fact-check/analyze', { content }),
};