import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AIMentorService } from './ai-mentor.service';

@ApiTags('AI Mentor')
@Controller('ai-mentor')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AIMentorController {
  constructor(private readonly aiService: AIMentorService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with AI Mentor' })
  async chat(
    @CurrentUser('id') userId: string,
    @Body('message') message: string,
    @Body('context') context?: any,
  ) {
    return this.aiService.chat(userId, message, context);
  }

  @Get('hint/:postId')
  @ApiOperation({ summary: 'Get hint for a specific post' })
  async getHint(
    @CurrentUser('id') userId: string,
    @Param('postId') postId: string,
    @Query('simulationId') simulationId?: string,
  ) {
    return this.aiService.getHint(userId, simulationId, postId);
  }

  @Post('explanation')
  @ApiOperation({ summary: 'Get explanation about a topic' })
  async getExplanation(
    @CurrentUser('id') userId: string,
    @Body('topic') topic: string,
  ) {
    return this.aiService.getExplanation(userId, topic);
  }

  @Get('recommendations')
  @ApiOperation({ summary: 'Get personalized learning recommendations' })
  async getRecommendations(@CurrentUser('id') userId: string) {
    return this.aiService.getRecommendations(userId);
  }
}