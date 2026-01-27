import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthenticatedUser } from '@contracts/interfaces';
import { AxiosError } from 'axios';
import { Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
  private readonly logger = new Logger(CommonService.name);
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async sendRequest<T>({
    method,
    url,
    data,
    headers,
  }: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    data?: unknown;
    headers?: Record<string, string>;
  }): Promise<T> {
    const response = await firstValueFrom(
      this.httpService
        .request<T>({
          method,
          url,
          data,
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(`Error calling ${url}:`, error.response?.data);
            throw new HttpException(error.response?.data || 'Service Unavailable', error.response?.status || 502);
          }),
        ),
    );
    return response.data;
  }

  getInternalHeaders(user?: AuthenticatedUser) {
    const headers: Record<string, string> = {
      'X-INTERNAL-KEY': this.configService.getOrThrow<string>('INTERNAL_API_KEY'),
      'Content-Type': 'application/json',
    };

    if (user) {
      headers['user'] = JSON.stringify(user);
    }

    return headers;
  }
}
