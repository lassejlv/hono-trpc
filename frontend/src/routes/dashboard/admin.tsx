import Spinner from '@/components/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { client } from '@/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SelectUser } from '../../../../db/schemas/user';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Admin() {
  const navigate = useNavigate();

  const { data: AuthData, isError: AuthError, isLoading: AuthLoading } = useAuth();

  const {
    data: users,
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      return (await client.admin.getUsers.query({ limit: 10 })) as SelectUser[];
    },
  });

  const deleteUser = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: async (id: number) => {
      return client.admin.deleteUser.mutate({ id });
    },
    onSuccess: () => {
      refetch();
      toast.success('User deleted');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (AuthError) return <Spinner size={16} />;
  if (AuthLoading) return navigate('/login');
  if (!AuthData) return navigate('/login');
  if (!AuthData.admin) return navigate('/dashboard');

  if (isLoading) return <Spinner size={16} />;
  if (isError) return <div>Admin ERROR: {error.message}</div>;
  if (!users) return <Spinner size={16} />;

  return (
    <>
      <h1 className='text-3xl font-bold'>Admin</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className='text-right'>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users
            .filter((user) => user.id !== AuthData.id)
            .map((user) => (
              <TableRow key={user.id}>
                <TableCell className='w-[100px]'>{user.id}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.createdAt}</TableCell>
                <TableCell className='text-right'>
                  <Button
                    variant='destructive'
                    disabled={deleteUser.isPending}
                    onClick={() => {
                      const confirm = window.confirm('Are you sure you want to delete this user?');
                      if (!confirm) return;

                      return deleteUser.mutate(user.id);
                    }}
                  >
                    Delete User
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}
