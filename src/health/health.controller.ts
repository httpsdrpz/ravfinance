import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  private readonly startTime = Date.now();

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Check API health status' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  @ApiResponse({ status: 503, description: 'API is unhealthy' })
  async check() {
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    let databaseStatus = 'ok';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      databaseStatus = 'error';
    }

    return {
      status: 'ok',
      version: '0.1.0',
      uptime: `${uptime}s`,
      database: databaseStatus,
      timestamp: new Date().toISOString(),
    };
  }
}
