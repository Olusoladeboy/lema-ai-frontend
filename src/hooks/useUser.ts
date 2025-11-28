import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';
import type { User } from '../types';

export const useUser = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async (): Promise<User | null> => {
      if (!userId) return null;
      
      // Fetch users in batches to find the one we need
      // Start with a large page size to cover most cases
      let pageNumber = 0;
      const pageSize = 100;
      
      while (true) {
        const users = await usersApi.getUsers(pageNumber, pageSize);
        const user = users.find((u) => u.id === userId);
        
        if (user) {
          return user;
        }
        
        // If we got fewer users than requested, we've reached the end
        if (users.length < pageSize) {
          return null;
        }
        
        pageNumber++;
        
        // Safety limit to prevent infinite loops
        if (pageNumber > 100) {
          return null;
        }
      }
    },
    enabled: !!userId,
  });
};

