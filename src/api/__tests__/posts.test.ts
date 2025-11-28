import { describe, it, expect, vi, beforeEach } from 'vitest';
import { postsApi } from '../posts';
import { apiClient } from '../client';

// Mock the apiClient
vi.mock('../client', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('postsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPosts', () => {
    it('should fetch posts for a user', async () => {
      const mockPosts = [
        {
          id: '1',
          user_id: 'user1',
          title: 'Test Post',
          body: 'Test Body',
          created_at: '2024-01-01T00:00:00Z',
        },
      ];

      vi.mocked(apiClient.get).mockResolvedValue(mockPosts);

      const result = await postsApi.getPosts('user1');

      expect(apiClient.get).toHaveBeenCalledWith('/posts?userId=user1');
      expect(result).toEqual(mockPosts);
    });
  });

  describe('createPost', () => {
    it('should create a new post', async () => {
      const newPost = {
        title: 'New Post',
        body: 'New Body',
        userId: 'user1',
      };

      const createdPost = {
        id: '2',
        user_id: 'user1',
        title: 'New Post',
        body: 'New Body',
        created_at: '2024-01-02T00:00:00Z',
      };

      vi.mocked(apiClient.post).mockResolvedValue(createdPost);

      const result = await postsApi.createPost(newPost);

      expect(apiClient.post).toHaveBeenCalledWith('/posts', newPost);
      expect(result).toEqual(createdPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post and return success', async () => {
      vi.mocked(apiClient.delete).mockResolvedValue(undefined);

      await postsApi.deletePost('post1');

      expect(apiClient.delete).toHaveBeenCalledWith('/posts/post1');
    });

    it('should throw an error if delete fails', async () => {
      const error = new Error('Post not found');
      vi.mocked(apiClient.delete).mockRejectedValue(error);

      await expect(postsApi.deletePost('invalid-id')).rejects.toThrow('Post not found');
    });
  });
});

