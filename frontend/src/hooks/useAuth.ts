import { useQuery } from '@tanstack/react-query';
import type { SelectUser } from '../../../db/schemas/user';
import ky from 'ky';

export const useAuth = () => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['me'],
    retry: false,
    queryFn: async () => {
      try {
        const resp = await ky.get('/auth/me').json<SelectUser>();
        return resp;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  });

  return { data, isError, isLoading };
};
