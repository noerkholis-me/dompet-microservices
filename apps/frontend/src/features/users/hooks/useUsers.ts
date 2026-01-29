import { useMutation, useQuery } from '@tanstack/react-query';
import { createUser, getUsers } from '../api/users';
import { MutationConfig } from '@/lib/react-query';
import { toast } from 'sonner';

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: getUsers,
  });
};

type UseCreateUser = {
  mutationConfig?: MutationConfig<typeof createUser>;
};
export const useCreateUser = (params: UseCreateUser = {}) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => createUser(data),
    onSuccess: (data, ...args) => {
      toast.success('Success', { description: 'User baru berhasil ditambahkan' });
      params.mutationConfig?.onSuccess?.(data, ...args);
    },
    onError: () => {
      toast.error('Error', { description: 'Terjadi kesalahan' });
    },
  });
};
