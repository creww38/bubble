import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { GamificationService } from './gamification.service';

@ApiTags('Gamification')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
  constructor(private readonly gamificationService: GamificationService) {}

  @Get('progress')
  @ApiOperation({ summary: 'Get student XP and level progress' })
  async getProgress(@CurrentUser('id') userId: string) {
    return this.gamificationService.getStudentProgress(userId);
  }

  @Get('badges')
  @ApiOperation({ summary: 'Get student badges' })
  async getBadges(@CurrentUser('id') userId: string) {
    return this.gamificationService.getBadges(userId);
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Get global leaderboard' })
  async getLeaderboard(@Query('limit') limit?: number) {
    return this.gamificationService.getLeaderboard({ limit });
  }

  @Get('leaderboard/class/:classId')
  @ApiOperation({ summary: 'Get class leaderboard' })
  async getClassLeaderboard(
    @Param('classId') classId: string,
    @Query('limit') limit?: number,
  ) {
    return this.gamificationService.getClassLeaderboard(classId, limit);
  }

  @Post('check-badges')
  @ApiOperation({ summary: 'Check and award new badges' })
  async checkBadges(@CurrentUser('id') userId: string) {
    return this.gamificationService.checkAndAwardBadges(userId);
  }

  @Get('daily-challenge')
  @ApiOperation({ summary: 'Get daily challenge' })
  async getDailyChallenge() {
    return this.gamificationService.getDailyChallenge();
  }

  @Post('daily-challenge/:challengeId/complete')
  @ApiOperation({ summary: 'Complete daily challenge' })
  async completeDailyChallenge(
    @CurrentUser('id') userId: string,
    @Param('challengeId') challengeId: string,
  ) {
    return this.gamificationService.completeDailyChallenge(userId, challengeId);
  }
}