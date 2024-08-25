import { useQuery } from '@tanstack/react-query';
import { client } from '@/main';

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['me'],
    retry: false,
    queryFn: async () => {
      return await client.auth.me.query();
    },
  });

  return { data, isError, isLoading };
};
