import Spinner from '@/components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { client } from '@/main';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function index() {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await client.auth.updateUser.mutate({ name: data.name });
    },
    onSuccess: (data) => {
      return toast.success(data);
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    updateMutation.mutate({ name });
  };

  if (isLoading) return <Spinner size={16} />;
  if (isError) return navigate('/login');
  if (!data) return navigate('/login');

  return (
    <>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <p className='text-gray-500'>Welcome to the dashboard my freind</p>

      <Tabs defaultValue='profile' className='w-[400px]'>
        <TabsList>
          <TabsTrigger value='profile'>Profile</TabsTrigger>
          <TabsTrigger value='security'>Security</TabsTrigger>
        </TabsList>
        {/* profile */}
        <TabsContent value='profile'>
          <Button variant='link'>
            <Link to={`/user/${data.id}`}>View Profile</Link>
          </Button>

          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label htmlFor='name'>Name</Label>
              <Input name='name' type='text' placeholder='Enter your name' defaultValue={data.name} />
            </div>
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input type='email' defaultValue={data.email} disabled />
              <p className='text-gray-500'>You can't change your email</p>
            </div>

            <Button type='submit' variant='secondary' disabled={updateMutation.isPending}>
              {updateMutation.isPending ? <Spinner /> : 'Update'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value='security'>
          <Security />
        </TabsContent>
      </Tabs>
    </>
  );
}

function Security() {
  const { isLoading, isError, data, error, refetch } = useQuery({
    queryKey: ['sessions'],
    queryFn: async () => {
      return await client.auth.getSessions.query();
    },
  });

  const revokeMutation = useMutation({
    mutationKey: ['revoke'],
    mutationFn: async (sessionId: string) => {
      return await client.auth.revokeSession.query(`${sessionId}`);
    },
    onSuccess: (data) => {
      // refetch sessions
      refetch();
      return toast.success(data);
    },
    onError: (error) => {
      return toast.error(error.message);
    },
  });

  if (isLoading) return <Spinner size={16} />;
  if (isError) return <h1>Error: {error.message}</h1>;
  if (!data) return <h1>No sessions</h1>;

  const formatDate = (date: any) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  };

  return (
    <>
      <h1 className='text-2xl font-bold'>Sessions</h1>
      <ul>
        {data.map((session: any) => (
          <li key={session.id}>
            <p>Session ID: {session.id}</p>

            <p>Created at: {formatDate(session.createdAt)}</p>
            <p>Expire: {formatDate(session.expiresAt)}</p>
            <Button variant='destructive' disabled={revokeMutation.isPending} onClick={() => revokeMutation.mutate(session.id)}>
              Revoke
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}
