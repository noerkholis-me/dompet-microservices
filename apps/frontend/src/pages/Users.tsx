import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Search, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { CreateUserInput, CreateUserSchema } from '@contracts/schemas/users';
import { RoleType } from '@contracts/enums/role.enum';
import { User } from '@contracts/generated';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserInput>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      role: RoleType.PEMBELI,
      status: true,
    },
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      setUsers(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Gagal memuat data user',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchQuery]);

  const openCreateModal = () => {
    setSelectedUser(null);
    reset({
      name: '',
      email: '',
      password: '',
      role: RoleType.PEMBELI,
      status: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    reset({
      name: user.name,
      email: user.email,
      password: '',
      role: RoleType.PEMBELI,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const onSubmit = async (data: CreateUserInput) => {
    try {
      setIsSubmitting(true);
      if (selectedUser) {
        await userService.update(selectedUser.id, {
          name: data.name,
          email: data.email,
          password: data.password || undefined,
          status: data.status,
          role: data.role,
        });
        toast({
          title: 'Berhasil',
          description: 'User berhasil diperbarui',
        });
      } else {
        await userService.create(data);
        toast({
          title: 'Berhasil',
          description: 'User berhasil ditambahkan',
        });
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;

    try {
      await userService.delete(selectedUser.id);
      toast({
        title: 'Berhasil',
        description: 'User berhasil dihapus',
      });
      setIsDeleteDialogOpen(false);
      fetchUsers();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Daftar User</h1>
          <p className="text-muted-foreground">Kelola pengguna sistem DOMPET Microservices</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Nama Lengkap</TableHead>
                  {/* <TableHead>Username</TableHead> */}
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      Tidak ada data user
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user, index) => (
                    <TableRow key={user.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={user.roles?.some((role) => role.role === RoleType.ADMIN) ? 'default' : 'secondary'}
                        >
                          {user.roles?.some((role) => role.role === RoleType.ADMIN) ? 'Admin' : 'Pembeli'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={user.status ? 'default' : 'outline'}
                          className={user.status ? 'bg-success text-success-foreground' : 'text-muted-foreground'}
                        >
                          {user.status ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditModal(user)}
                              aria-label={`Edit ${user.name}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit User</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(user)}
                              aria-label={`Hapus ${user.name}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Hapus User</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="namaLengkap">Nama Lengkap</Label>
              <Input id="namaLengkap" {...register('name')} className={errors.name ? 'border-destructive' : ''} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...register('email')} className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={watch('role')} onValueChange={(value: RoleType) => setValue('role', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="pembeli">Pembeli</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={watch('status') ? 'aktif' : 'nonaktif'}
                  onValueChange={(value: string) => setValue('status', value === 'aktif')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="nonaktif">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
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
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus User</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus user "{selectedUser?.name}"? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Users;
