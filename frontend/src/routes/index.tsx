import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

function Index() {
  return (
    <>
      <h1 className='text-3xl font-bold'>Hono x TRPC</h1>
      <p className='text-gray-500'>This is a demo of using the best web application stack :D</p>

      <div className='flex gap-4'>
        <Button variant='outline'>
          <Link to='/register'>Register</Link>
        </Button>
        <Button variant='outline'>
          <Link to='/login'>Login</Link>
        </Button>
      </div>
    </>
  );
}

export default Index;
