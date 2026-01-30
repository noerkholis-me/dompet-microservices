import React from 'react';
import { useCreateUserForm } from '../hooks/useCreateUserForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { RoleType } from '@contracts/enums/role.enum';

type CreateUserFormProps = {
  onSuccess: () => void;
  onCancel: () => void;
};

export const CreateUserForm: React.FC<CreateUserFormProps> = ({ onSuccess, onCancel }) => {
  const { form, onSubmit, isPending, errors } = useCreateUserForm({ onSuccess });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="create-name">Nama Lengkap</Label>
        <Input
          id="create-name"
          placeholder="Masukkan nama lengkap"
          {...form.register('name')}
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-email">Email</Label>
        <Input
          id="create-email"
          type="email"
          placeholder="Masukkan email"
          {...form.register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="create-password">Password</Label>
        <Input
          id="create-password"
          type="password"
          placeholder="Masukkan password"
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
