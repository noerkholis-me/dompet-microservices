import { CommonService } from '@common/common.service';
import { CreateUserDto, UpdateUserDto } from '@contracts/dto/users';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private baseUrl: string;

  constructor(
    private commonService: CommonService,
    private configService: ConfigService,
  ) {
    this.baseUrl = this.configService.getOrThrow<string>('RBAC_SERVICE_URL');
  }

  async getAllUsers() {
    const data = await this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/users`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async getUserById(id: string) {
    const data = await this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/users/${id}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async createUser(createUserDto: CreateUserDto) {
    const data = await this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/users`,
      headers: this.commonService.getInternalHeaders(),
      data: createUserDto,
    });

    return data;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const data = await this.commonService.sendRequest({
      method: 'PUT',
      url: `${this.baseUrl}/users/${id}`,
      headers: this.commonService.getInternalHeaders(),
      data: updateUserDto,
    });

    return data;
  }

  async deleteUser(id: string) {
    const data = await this.commonService.sendRequest({
      method: 'DELETE',
      url: `${this.baseUrl}/users/${id}`,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }
}
