import { RoleType } from '@contracts/enums/role.enum';
import { CreateUserInput, CreateUserSchema } from '@contracts/schemas/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useCreateUser } from './useUsers';

type UseCreateUserFormProps = {
  onSuccess?: () => void;
};

export const useCreateUserForm = ({ onSuccess }: UseCreateUserFormProps) => {
  const {
    formState: { errors, isSubmitting },
    ...form
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      role: RoleType.PEMBELI,
      status: true,
    },
  });

  const { mutate, isPending } = useCreateUser({
    mutationConfig: {
      onSuccess,
    },
  });

  const onSubmit = (data: CreateUserInput) => {
    mutate(data);
  };

  return { form, onSubmit, isPending, errors, isSubmitting };
};
