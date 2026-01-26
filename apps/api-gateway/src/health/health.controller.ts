import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';
import { SuccessMessage } from '@common/decorators/success-message.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns the current health status of the API',
  })
  @Get('health')
  getHealth(): object {
    return this.healthService.getHealth();
  }

  @ApiOperation({
    summary: 'Ping API',
    description: 'Return Pong',
  })
  @Get('api/ping')
  @SuccessMessage('Pong')
  getPing() {}
}
