import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get admin dashboard stats' })
  async getDashboard() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('student/:userId')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Get student analytics (Teacher/Admin)' })
  async getStudentAnalytics(@Param('userId') userId: string) {
    return this.analyticsService.getStudentAnalytics(userId);
  }

  @Get('my-progress')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get my learning analytics' })
  async getMyProgress(@CurrentUser('id') userId: string) {
    return this.analyticsService.getStudentAnalytics(userId);
  }

  @Get('teacher')
  @Roles('TEACHER')
  @ApiOperation({ summary: 'Get teacher dashboard' })
  async getTeacherDashboard(@CurrentUser('id') teacherId: string) {
    return this.analyticsService.getTeacherDashboard(teacherId);
  }

  @Get('common-biases')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Get most common biases' })
  async getCommonBiases() {
    return this.analyticsService.getMostCommonBiases();
  }
}