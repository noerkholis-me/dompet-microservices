import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '@common/dto/users/create-user.dto';
import { UpdateUserDto } from '@common/dto/users/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const users = await this.prisma.user.findMany({
      include: { roles: true },
    });

    return users;
  }

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: { ...dto } });

    if (dto.role) {
      await this.prisma.userRole.create({
        data: { userId: user.id, role: dto.role },
      });
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted' };
  }
}
