import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Spinner from '@/components/Spinner';
import { useMutation } from '@tanstack/react-query';
import { client } from '@/main';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function Logout() {
  const navigate = useNavigate();

  const { data, isError, isLoading } = useAuth();

  const logout = useMutation({
    mutationKey: ['logout'],
    mutationFn: async () => {
      return await client.auth.logout.query();
    },
    onSuccess: () => {
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) return <Spinner />;
  if (isError) return navigate('/login');
  if (!data) return navigate('/login');

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      <h1 className='text-3xl font-bold'>Logout</h1>
      <p className='text-gray-500'>Are you sure you want to logout?</p>

      <div className='flex gap-4 my-3'>
        <Button variant='destructive' onClick={() => logout.mutate()} disabled={logout.isPending}>
          {logout.isPending ? <Spinner /> : 'Logout'}
        </Button>
        <Button variant='link' onClick={() => navigate('/dashboard')}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
