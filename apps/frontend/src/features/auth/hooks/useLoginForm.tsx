import { useForm } from 'react-hook-form';
import { LoginInput, LoginSchema } from '@contracts/schemas/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from './useLogin';

type UseLoginFromProps = {
  onSuccess?: () => void;
};

export const useLoginForm = ({ onSuccess }: UseLoginFromProps = {}) => {
  const form = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(LoginSchema),
  });

  const { mutate, isPending } = useLogin({
    mutationConfig: {
      onSuccess,
    },
  });

  const onSubmit = async (data: LoginInput) => {
    mutate(data);
  };

  return { form, onSubmit, isPending };
};
