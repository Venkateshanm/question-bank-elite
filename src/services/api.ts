import { MCQQuestion, QuestionStats, GenerateQuestionRequest, ImportResult, Unit, Topic } from '@/types/mcq';

const API_BASE_URL = 'http://localhost:3001/api';

// Generic API function with error handling
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API call failed for ${endpoint}:`, error);
    throw error;
  }
}

// Question-related API calls
export const questionAPI = {
  // Get all questions with optional filters
  getQuestions: (filters?: { unit?: string; topic?: string; bloomsLevel?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    const query = queryParams.toString();
    return apiCall<{ questions: MCQQuestion[]; total: number; page: number; totalPages: number }>
      (`/questions${query ? `?${query}` : ''}`);
  },

  // Get question by ID
  getQuestion: (id: number) => 
    apiCall<MCQQuestion>(`/questions/${id}`),

  // Create new question
  createQuestion: (question: Omit<MCQQuestion, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiCall<MCQQuestion>('/questions', {
      method: 'POST',
      body: JSON.stringify(question),
    }),

  // Update question
  updateQuestion: (id: number, question: Partial<MCQQuestion>) =>
    apiCall<MCQQuestion>(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(question),
    }),

  // Delete question
  deleteQuestion: (id: number) =>
    apiCall<{ success: boolean }>(`/questions/${id}`, {
      method: 'DELETE',
    }),

  // Get question statistics
  getStats: () =>
    apiCall<QuestionStats>('/questions/stats'),

  // Generate questions based on criteria
  generateQuestions: (request: GenerateQuestionRequest) =>
    apiCall<MCQQuestion[]>('/questions/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    }),
};

// Unit and Topic API calls
export const unitAPI = {
  // Get all units with topics
  getUnits: () =>
    apiCall<Unit[]>('/units'),

  // Get topics for a specific unit
  getTopicsByUnit: (unitId: number) =>
    apiCall<Topic[]>(`/units/${unitId}/topics`),
};

// Import API calls
export const importAPI = {
  // Import questions from file
  importQuestions: (file: File, format: 'csv' | 'sql' | 'md' | 'txt') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', format);

    return fetch(`${API_BASE_URL}/import`, {
      method: 'POST',
      body: formData,
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Import failed: ${response.status}`);
      }
      return response.json() as Promise<ImportResult>;
    });
  },
};

// Export API calls
export const exportAPI = {
  // Export questions to specified format
  exportQuestions: (questions: MCQQuestion[], format: 'pdf' | 'txt' | 'md', includeAnswers: boolean) =>
    fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questions,
        format,
        includeAnswers,
      }),
    }).then(response => {
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      return response.blob();
    }),
};
