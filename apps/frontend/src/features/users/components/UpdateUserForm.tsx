import React from 'react';
import { useUpdateUserForm } from '../hooks/useUpdateUserForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { RoleType } from '@contracts/enums/role.enum';
import { UpdateUserInput } from '@contracts/schemas/users';

type UpdateUserFormProps = {
  userId: string;
  initialData?: Partial<UpdateUserInput>;
  onSuccess: () => void;
  onCancel: () => void;
};

export const UpdateUserForm: React.FC<UpdateUserFormProps> = ({ userId, initialData, onSuccess, onCancel }) => {
  const { form, onSubmit, isPending, errors } = useUpdateUserForm({
    id: userId,
    onSuccess,
    defaultValues: initialData,
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="update-name">Nama Lengkap</Label>
        <Input
          id="update-name"
          placeholder="Masukkan nama lengkap"
          {...form.register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="update-email">Email</Label>
        <Input
          id="update-email"
          type="email"
          placeholder="Masukkan email"
          {...form.register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="update-password">Password (Opsional)</Label>
        <Input
          id="update-password"
          type="password"
          placeholder="Kosongkan jika tidak ingin mengubah"
          {...form.register('password')}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select value={form.watch('role')} onValueChange={(value: RoleType) => form.setValue('role', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RoleType.ADMIN}>Admin</SelectItem>
              <SelectItem value={RoleType.PEMBELI}>Pembeli</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={form.watch('status') ? 'aktif' : 'nonaktif'}
            onValueChange={(value: string) => form.setValue('status', value === 'aktif')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aktif">Aktif</SelectItem>
              <SelectItem value="nonaktif">Nonaktif</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Simpan'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
