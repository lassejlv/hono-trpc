import { useQuery } from '@tanstack/react-query';
import { client } from '@/main';
import Spinner from '@/components/Spinner';
import type { SelectUser } from '../../../db/schemas/user';

function Index() {
  const { data, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      // console.log(await client.sayHi.query());

      const users = await client.users.getUsers.query();
      console.log(users);

      // const res = await client.hello.query({ name: 'world' });
      await new Promise((resolve) => setTimeout(resolve, 500));
      return 'Hello';
    },
  });

  return <>{isLoading ? <Spinner size={24} /> : <p>{data}</p>}</>;
}

export default Index;
