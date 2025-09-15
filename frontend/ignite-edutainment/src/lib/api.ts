import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API calls (with mock fallback if backend is unavailable)
export const authAPI = {
  studentLogin: async (credentials: { username: string; password: string }) => {
    try {
      return await api.post('/auth/student/login', credentials);
    } catch (error: any) {
      if (!error.response) {
        // Mock success response for demo environments without backend
        const { username } = credentials;
        return {
          data: {
            token: 'mock-student-token',
            user: {
              id: 'student-1',
              username,
              fullName: 'Demo Student',
              schoolName: 'Demo School',
              state: 'Delhi',
              class: '10',
              preferredLanguage: 'English',
              profilePicture: ''
            },
          },
        } as any;
      }
      throw error;
    }
  },
  
  studentRegister: async (data: {
    username: string;
    password: string;
    fullName: string;
    schoolName: string;
    state: string;
    class: string;
    preferredLanguage: string;
    profilePicture?: string;
  }) => {
    try {
      return await api.post('/auth/student/register', data);
    } catch (error: any) {
      if (!error.response) {
        return {
          data: {
            token: 'mock-student-token',
            user: {
              id: 'student-1',
              username: data.username,
              fullName: data.fullName || 'Demo Student',
              schoolName: data.schoolName || 'Demo School',
              state: data.state || 'Delhi',
              class: data.class || '10',
              preferredLanguage: data.preferredLanguage || 'English',
              profilePicture: data.profilePicture || ''
            },
          },
        } as any;
      }
      throw error;
    }
  },
  
  teacherLogin: async (credentials: { username: string; password: string }) => {
    try {
      return await api.post('/auth/teacher/login', credentials);
    } catch (error: any) {
      if (!error.response) {
        const { username } = credentials;
        return {
          data: {
            token: 'mock-teacher-token',
            user: {
              id: 'teacher-1',
              username,
              fullName: 'Demo Teacher',
              schoolName: 'Demo School',
              state: 'Maharashtra',
              subjects: ['Mathematics', 'Physics'],
              classes: ['9', '10', '11'],
              preferredLanguages: ['English'],
              profilePicture: ''
            },
          },
        } as any;
      }
      throw error;
    }
  },
  
  teacherRegister: async (data: {
    username: string;
    password: string;
    fullName: string;
    schoolName: string;
    state: string;
    subjects: string[];
    classes: string[];
    preferredLanguages: string[];
    profilePicture?: string;
  }) => {
    try {
      return await api.post('/auth/teacher/register', data);
    } catch (error: any) {
      if (!error.response) {
        return {
          data: {
            token: 'mock-teacher-token',
            user: {
              id: 'teacher-1',
              username: data.username,
              fullName: data.fullName || 'Demo Teacher',
              schoolName: data.schoolName || 'Demo School',
              state: data.state || 'Maharashtra',
              subjects: data.subjects?.length ? data.subjects : ['Mathematics'],
              classes: data.classes?.length ? data.classes : ['9', '10'],
              preferredLanguages: data.preferredLanguages?.length ? data.preferredLanguages : ['English'],
              profilePicture: data.profilePicture || ''
            },
          },
        } as any;
      }
      throw error;
    }
  },
};

// Video API calls
export const videoAPI = {
  getVideos: () => api.get('/videos'),
  uploadVideo: (data: {
    title: string;
    description: string;
    classes: string[];
    language: string;
    videoUrl: string;
  }) => api.post('/videos', data),
  deleteVideo: (id: string) => api.delete(`/videos/${id}`),
  getVideosByTeacher: (teacherId: string) => api.get(`/videos/teacher/${teacherId}`),
};

// Student API calls
export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data: any) => api.put('/student/profile', data),
  getRecommendations: () => api.get('/student/recommendations'),
  submitGameScore: (data: { gameId: string; score: number; points: number }) =>
    api.post('/student/game-score', data),
  getGameScores: () => api.get('/student/game-scores'),
};

// Teacher API calls
export const teacherAPI = {
  getProfile: () => api.get('/teacher/profile'),
  updateProfile: (data: any) => api.put('/teacher/profile', data),
  getAnalytics: () => api.get('/teacher/analytics'),
  getStudents: () => api.get('/teacher/students'),
};

// Search API calls
export const searchAPI = {
  searchTeachers: (query: string) => api.get(`/search/teachers?q=${query}`),
  searchByClass: (className: string) => api.get(`/search/class?class=${className}`),
};

export default api;