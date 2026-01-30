import { UpdateUserInput, UpdateUserSchema } from '@contracts/schemas/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useUpdateUser } from './useUpdate';
import { RoleType } from '@contracts/enums/role.enum';

type UseUpdateUserFormProps = {
  onSuccess?: () => void;
  defaultValues?: Partial<UpdateUserInput>;
  id: string;
};

export const useUpdateUserForm = ({ onSuccess, id, defaultValues }: UseUpdateUserFormProps) => {
  const {
    formState: { errors, isSubmitting },
    ...form
  } = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      email: '',
      name: '',
      password: '',
      role: RoleType.PEMBELI,
      status: true,
      ...defaultValues,
    },
  });

  const { mutate, isPending } = useUpdateUser({ id, mutationConfig: { onSuccess } });

  const onSubmit = (data: UpdateUserInput) => {
    mutate(data);
  };

  return { form, onSubmit, isPending, errors, isSubmitting };
};
