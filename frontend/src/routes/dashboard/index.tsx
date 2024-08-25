import Spinner from '@/components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { client } from '@/main';
import { toast } from 'sonner';

export default function index() {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useAuth();

  if (isLoading) return <Spinner size={16} />;
  if (isError) return navigate('/login');
  if (!data) return navigate('/login');

  const logoutMutation = async () => {
    try {
      await client.auth.logout.query();
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <h1 className='text-3xl font-bold'>Dashboard</h1>
      <p className='text-gray-500'>Welcome to the dashboard my freind</p>

      <form className='flex flex-col gap-4'>
        <div>
          <Label htmlFor='name'>Name</Label>
          <Input name='name' type='text' placeholder='Enter your name' defaultValue={data.name} />
        </div>

        <div>
          <Label htmlFor='email'>Email</Label>
          <Input type='email' defaultValue={data.email} disabled />
          <p className='text-gray-500'>You can't change your email</p>
        </div>

        <Button variant='secondary' type='submit'>
          Update
        </Button>

        <Button variant='outline' onClick={() => logoutMutation()}>
          <LogOut size={16} />
          Logout
        </Button>
      </form>
    </>
  );
}
