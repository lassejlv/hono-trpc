import { useQuery } from '@tanstack/react-query';
import { client } from '@/main';
import type { SelectUser } from '../../../db/schemas/user';

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['me'],
    retry: false,
    queryFn: async () => {
      return (await client.auth.me.query()) as SelectUser;
    },
  });

  return { data, isError, isLoading };
};
