import { apiClient } from './client';
import type { User } from '../types';

export const usersApi = {
  getUsers: async (pageNumber: number, pageSize: number): Promise<User[]> => {
    return apiClient.get<User[]>(`/users?pageNumber=${pageNumber}&pageSize=${pageSize}`);
  },

  getUsersCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/users/count');
    return response.count;
  },
};

