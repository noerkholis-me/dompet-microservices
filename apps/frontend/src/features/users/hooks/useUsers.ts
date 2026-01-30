import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createUser, getUsers } from '../api/users';
import { MutationConfig } from '@/lib/react-query';
import { toast } from 'sonner';
import { userKeys } from '../api/user.keys';

export const useGetUsers = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: getUsers,
  });
};

type UseCreateUser = {
  mutationConfig?: MutationConfig<typeof createUser>;
};
export const useCreateUser = (params: UseCreateUser = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => createUser(data),
    onSuccess: (data, ...args) => {
      toast.success('Success', { description: 'User baru berhasil ditambahkan' });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      params.mutationConfig?.onSuccess?.(data, ...args);
    },
    onError: () => {
      toast.error('Error', { description: 'Terjadi kesalahan' });
    },
  });
};
