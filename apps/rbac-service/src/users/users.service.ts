import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '@contracts/dto/users';
import { UpdateUserDto } from '@contracts/dto/users';

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
    const isUserExist = await this.prisma.user.findUnique({
      where: { email: dto.email, status: true },
    });

    if (isUserExist) throw new BadRequestException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        status: dto.status,
      },
    });

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
