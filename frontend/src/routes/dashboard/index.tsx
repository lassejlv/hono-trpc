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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LogOutIcon } from 'lucide-react';
import { useState } from 'react';

export default function index() {
  const navigate = useNavigate();

  const [previewAvatar, setPreviewAvatar] = useState<boolean>(false);

  const { data, isError, isLoading } = useAuth();

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return await client.auth.updateUser.mutate({ name: data.name, avatar: data.avatar });
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
    const avatar = formData.get('avatar') as string;
    updateMutation.mutate({ name, avatar });
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
          <TabsTrigger value='danger'>Danger</TabsTrigger>
          {data.admin && (
            <TabsTrigger value='#' onClick={() => navigate('/dashboard/admin')}>
              Admin
            </TabsTrigger>
          )}
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
              <Label htmlFor='avatar'>Avatar</Label>
              <Input name='avatar' type='text' placeholder='Avatar URL' defaultValue={data.avatar as string} />

              <span className='text-sm text-gray-500 cursor-pointer' onClick={() => setPreviewAvatar(!previewAvatar)}>
                {previewAvatar ? 'Hide' : 'Show'} Avatar Preview
              </span>

              {previewAvatar && <img src={data.avatar as string} alt='avatar' className='w-10 h-10 rounded-full' />}
            </div>

            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Label htmlFor='email'>Email</Label>
                      <Input type='email' defaultValue={data.email} disabled />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Email cannot be changed</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className='flex gap-4'>
              <Button type='submit' variant='secondary' disabled={updateMutation.isPending}>
                {updateMutation.isPending ? <Spinner /> : 'Update'}
              </Button>
              <Button variant='destructive' onClick={() => navigate('/logout')}>
                <LogOutIcon size={16} />
                Logout
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value='security'>
          <Security />
        </TabsContent>

        <TabsContent value='danger'>
          <Danger />
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
      <ul className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {data.map((session: any) => (
          <li key={session.id}>
            <p>Session ID: {session.id}</p>

            <p>Created at: {formatDate(session.createdAt)}</p>
            <p>Expire: {formatDate(session.expiresAt)}</p>
            <Button variant='destructive' disabled={revokeMutation.isPending} onClick={() => revokeMutation.mutate(session.id)}>
              {revokeMutation.isPending ? <Spinner size={16} /> : 'Revoke'}
            </Button>
          </li>
        ))}
      </ul>
    </>
  );
}

function Danger() {
  const deleteMutation = useMutation({
    mutationKey: ['delete'],
    mutationFn: async (passoword: string) => {
      return await client.auth.deleteUser.mutate({
        confirm: true,
        abosolutelySureToDeleteThisAccount: true,
        password: passoword,
      });
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
    const password = formData.get('password') as string;
    deleteMutation.mutate(password);
  };

  return (
    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
      <h1 className='text-2xl font-bold'>Danger Zone</h1>

      <p className='text-red-500'>This action is irreversible. You will lose all your data and account.</p>
      <div>
        <Label htmlFor='name'>Password</Label>
        <Input name='password' type='password' placeholder='Enter your password to confirm' />
      </div>

      <div className='flex gap-4'>
        <Button type='submit' variant='destructive' disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? <Spinner /> : 'Delete Account'}
        </Button>
      </div>
    </form>
  );
}
