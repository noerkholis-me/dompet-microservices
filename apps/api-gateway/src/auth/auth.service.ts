import { CommonService } from '@common/common.service';
import { LoginDto, RefreshDto } from '@contracts/dto/auth';
import { AuthenticatedUser } from '@contracts/interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private baseUrl: string;

  constructor(
    private configService: ConfigService,
    private commonService: CommonService,
  ) {
    this.baseUrl = this.configService.getOrThrow('AUTH_SERVICE_URL');
  }

  async login(dto: LoginDto) {
    const data = await this.commonService.sendRequest<LoginDto>({
      method: 'POST',
      url: `${this.baseUrl}/login`,
      data: dto,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async refresh(dto: RefreshDto) {
    const data = await this.commonService.sendRequest({
      method: 'POST',
      url: `${this.baseUrl}/refresh-token`,
      data: dto,
      headers: this.commonService.getInternalHeaders(),
    });

    return data;
  }

  async me(user?: AuthenticatedUser) {
    const data = await this.commonService.sendRequest({
      method: 'GET',
      url: `${this.baseUrl}/me`,
      headers: this.commonService.getInternalHeaders(user),
    });

    return data;
  }
}
