import { apiClient } from './client';
import type { Post, CreatePostRequest } from '../types';

export const postsApi = {
  getPosts: async (userId: string): Promise<Post[]> => {
    return apiClient.get<Post[]>(`/posts?userId=${userId}`);
  },

  createPost: async (data: CreatePostRequest): Promise<Post> => {
    return apiClient.post<Post>('/posts', data);
  },

  deletePost: async (postId: string): Promise<void> => {
    return apiClient.delete(`/posts/${postId}`);
  },
};

