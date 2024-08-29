import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { client } from '@/main';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  email: string;
  password: string;
}

export default function index() {
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: async ({ email, password }: Props) => {
      return client.auth.login.mutate({ email, password });
    },
    onSuccess: (data) => {
      toast.success(data);
      return navigate('/dashboard');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    loginMutation.mutate({ email, password });
  };

  return (
    <>
      <h1 className='text-3xl font-bold'>Login</h1>
      <p className='text-gray-500'>Login to your account to get started</p>

      <a href='/register'>Don't have an account? Register here</a>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <Label htmlFor='email'>Email</Label>
        <Input name='email' type='email' placeholder='john@doe.gg' />

        <Label htmlFor='password'>Password</Label>
        <Input name='password' type='password' placeholder='********' />

        <Button variant='secondary' type='submit' disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <>
              <Spinner size={16} />
            </>
          ) : (
            'Login'
          )}
        </Button>
      </form>
    </>
  );
}
