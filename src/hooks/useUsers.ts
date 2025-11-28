import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../api/users';

export const useUsers = (pageNumber: number, pageSize: number) => {
  return useQuery({
    queryKey: ['users', pageNumber, pageSize],
    queryFn: () => usersApi.getUsers(pageNumber, pageSize),
  });
};

export const useUsersCount = () => {
  return useQuery({
    queryKey: ['users', 'count'],
    queryFn: () => usersApi.getUsersCount(),
  });
};

