import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from '@contracts/dto/users';
import { UpdateUserDto } from '@contracts/dto/users';
import * as argon2 from 'argon2';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        roles: { select: { role: true } },
      },
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async createUser(dto: CreateUserDto) {
    const isUserExist = await this.prisma.user.findUnique({
      where: { email: dto.email, status: true },
    });

    if (isUserExist) throw new BadRequestException('User already exists');

    const hashPassword = await argon2.hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashPassword,
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

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      let hashPassword;
      if (dto.password) {
        hashPassword = await argon2.hash(dto.password);
      }

      await tx.user.update({
        where: { id },
        data: {
          email: dto.email,
          name: dto.name,
          password: hashPassword,
          status: dto.status,
          roles: dto.role
            ? {
                deleteMany: {},
                create: { role: dto.role },
              }
            : undefined,
        },
      });
    });
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    await this.prisma.userRole.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted' };
  }
}
