import { client } from '@/main';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import type { SelectUser } from '../../../../db/schemas/user';
import Spinner from '@/components/Spinner';

export default function UserProfile() {
  const params = useParams();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['user', params.id],
    retry: false,
    queryFn: async () => {
      return (await client.user.getUser.query(params.id as string)) as SelectUser;
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return <div>{error.message}</div>;
  if (!data) return <div>User not found</div>;

  return (
    <>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </>
  );
}
