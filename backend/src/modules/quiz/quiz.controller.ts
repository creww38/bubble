import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { QuizService } from './quiz.service';

@ApiTags('Quiz')
@Controller('quiz')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  @ApiOperation({ summary: 'Get all quizzes' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.quizService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get quiz by ID (without answers)' })
  async findOne(@Param('id') id: string) {
    return this.quizService.findById(id);
  }

  @Get(':id/admin')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Get quiz with answers (Teacher/Admin)' })
  async findOneWithAnswers(@Param('id') id: string) {
    return this.quizService.findByIdWithAnswers(id);
  }

  @Post(':quizId/questions/:questionId/answer')
  @ApiOperation({ summary: 'Submit answer for a question' })
  async submitAnswer(
    @Param('quizId') quizId: string,
    @Param('questionId') questionId: string,
    @CurrentUser('id') userId: string,
    @Body('answer') answer: any,
  ) {
    return this.quizService.submitAnswer(quizId, questionId, userId, answer);
  }

  @Get('student/results')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get student quiz results' })
  async getResults(@CurrentUser('id') userId: string) {
    return this.quizService.getStudentQuizResults(userId);
  }
}