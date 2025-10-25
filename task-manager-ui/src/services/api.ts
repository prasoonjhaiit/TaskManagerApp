import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';

// ⚠️ IMPORTANT: Replace 5062 with your actual backend port
// Check your backend terminal for the actual port number
const API_BASE_URL = 'http://localhost:5123/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// API service for task operations
export const taskApi = {
  /**
   * Get all tasks
   * Endpoint: GET /api/tasks
   */
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks');
    return response.data;
  },

  /**
   * Get single task by ID
   * Endpoint: GET /api/tasks/{id}
   */
  getTask: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create a new task
   * Endpoint: POST /api/tasks
   */
  createTask: async (task: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post<Task>('/tasks', task);
    return response.data;
  },

  /**
   * Update an existing task
   * Endpoint: PUT /api/tasks/{id}
   */
  updateTask: async (id: number, task: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, task);
    return response.data;
  },

  /**
   * Delete a task
   * Endpoint: DELETE /api/tasks/{id}
   */
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}`);
  },
};

export default apiClient;