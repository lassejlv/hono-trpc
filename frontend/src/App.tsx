import { useQuery } from '@tanstack/react-query';
import { client } from './main';
import Spinner from './components/Spinner';

export default function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const res = await client.hello.query({ name: 'world' });
      return res;
    },
  });

  return <>{isLoading ? <Spinner size={24} /> : <p>{data}</p>}</>;
}
