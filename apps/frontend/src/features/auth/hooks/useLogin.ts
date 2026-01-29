import { MutationConfig } from '@/lib/react-query';
import { login } from '../api/auth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

type UseLoginParams = {
  mutationConfig?: MutationConfig<typeof login>;
};

export const useLogin = (params: UseLoginParams = {}) => {
  const { setAuth } = useAuth();
  const { onSuccess, ...restConfig } = params.mutationConfig || {};

  return useMutation({
    ...restConfig,
    mutationFn: login,
    onSuccess: (data, ...args) => {
      setAuth(data);
      toast.success('Login Berhasil', { description: 'Selamat datang kembali' });
      onSuccess?.(data, ...args);
    },
    onError: (error) => {
      toast.error('Login gagal', {
        description: error.message,
      });
    },
  });
};
