import Spinner from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { client } from '@/main';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Props {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const navigate = useNavigate();

  const registerMutaion = useMutation({
    mutationKey: ['register'],
    mutationFn: async ({ name, email, password }: Props) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return await client.auth.register.mutate({ name, email, password });
    },
    onSuccess: () => {
      toast.success('Account created!');
      navigate('/login');
    },
    onError: (error) => {
      console.log(error);

      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    registerMutaion.mutate({ name, email, password });
  };

  return (
    <>
      <h1 className='text-3xl font-bold'>Register</h1>
      <p className='text-gray-500'>Create an account to get started</p>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <Label htmlFor='name'>Name</Label>
        <Input name='name' type='text' placeholder='John Doe' />

        <Label htmlFor='email'>Email</Label>
        <Input name='email' type='email' placeholder='john@doe.gg' />

        <Label htmlFor='password'>Password</Label>
        <Input name='password' type='password' placeholder='********' />

        <Button variant='secondary' type='submit' disabled={registerMutaion.isPending}>
          {registerMutaion.isPending ? <Spinner size={16} /> : 'Create account'}
        </Button>
      </form>
    </>
  );
}
