import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MutationConfig } from '@/lib/react-query';
import { updateUser } from '../api/users';
import { toast } from 'sonner';
import { userKeys } from '../api/user.keys';

type UseUpdateUser = {
  id: string;
  mutationConfig?: MutationConfig<typeof updateUser>;
};

export const useUpdateUser = (params: UseUpdateUser) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...params.mutationConfig,
    mutationFn: (data) => updateUser(data, params.id),
    onSuccess: (data, ...args) => {
      toast.success('Update Success', { description: `Berhasil update data ${data.name}` });
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      params.mutationConfig?.onSuccess?.(data, ...args);
    },
    onError: (error) => {
      toast.error('Error', { description: error.message });
    },
  });
};
