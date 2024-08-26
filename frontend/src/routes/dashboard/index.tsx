import Spinner from '@/components/Spinner';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { client } from '@/main';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';

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
    </>
  );
}
