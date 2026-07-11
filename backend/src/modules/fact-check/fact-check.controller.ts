import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { FactCheckService } from './fact-check.service';

@ApiTags('Fact Check')
@Controller('fact-check')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FactCheckController {
  constructor(private readonly factCheckService: FactCheckService) {}

  @Get('bias-types')
  @ApiOperation({ summary: 'Get all bias types' })
  async getBiasTypes() {
    return this.factCheckService.getBiasTypes();
  }

  @Get('tips')
  @ApiOperation({ summary: 'Get fact-checking tips' })
  async getTips() {
    return this.factCheckService.getFactCheckTips();
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze content for bias indicators' })
  async analyzeContent(@Body('content') content: string) {
    return this.factCheckService.analyzeContent(content);
  }
}