import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsApi } from '../api/posts';
import type { Post, CreatePostRequest } from '../types';

export const usePosts = (userId: string) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => postsApi.getPosts(userId),
    enabled: !!userId,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePostRequest) => postsApi.createPost(data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch posts for the user
      queryClient.invalidateQueries({ queryKey: ['posts', variables.userId] });
    },
  });
};

export const useDeletePost = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['posts', userId] });

      const previousPosts = queryClient.getQueryData<Post[]>(['posts', userId]);

      queryClient.setQueryData<Post[]>(['posts', userId], (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(['posts', userId], context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['posts', userId] });
    },
  });
};

