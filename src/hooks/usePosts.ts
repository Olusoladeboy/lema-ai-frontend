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

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => postsApi.deletePost(postId),
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueriesData({ queryKey: ['posts'] });

      // Optimistically update by removing the post from all post queries
      queryClient.setQueriesData<Post[]>({ queryKey: ['posts'] }, (old) => {
        if (!old) return old;
        return old.filter((post) => post.id !== postId);
      });

      return { previousPosts };
    },
    onError: (_err, _postId, context) => {
      // Rollback on error
      if (context?.previousPosts) {
        context.previousPosts.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

