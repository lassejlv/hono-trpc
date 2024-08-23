import { useQuery } from '@tanstack/react-query';
import { client } from '../main';
import Spinner from '@/components/Spinner';

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const res = await client.hello.query({ name: 'world' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return res;
    },
  });

  return <>{isLoading ? <Spinner size={24} /> : <p>{data}</p>}</>;
}

export default Index;
