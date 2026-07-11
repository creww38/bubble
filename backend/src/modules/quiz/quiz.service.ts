import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const [quizzes, total] = await Promise.all([
      this.prisma.quiz.findMany({
        skip,
        take: limit,
        include: {
          _count: {
            select: { questions: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.quiz.count(),
    ]);

    return {
      data: quizzes,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findById(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            questionText: true,
            questionType: true,
            options: true,
            points: true,
            mediaUrl: true,
            orderIndex: true,
            // Exclude correctAnswer for students
          },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async findByIdWithAnswers(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return quiz;
  }

  async submitAnswer(
    quizId: string,
    questionId: string,
    userId: string,
    answer: any,
  ) {
    const question = await this.prisma.quizQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question || question.quizId !== quizId) {
      throw new NotFoundException('Question not found');
    }

    // Check if answer is correct
    const isCorrect = this.checkAnswer(question, answer);
    const pointsAwarded = isCorrect ? question.points : 0;

    // Save answer
    const quizAnswer = await this.prisma.quizAnswer.create({
      data: {
        studentAssignmentId: userId, // Simplified - should use StudentAssignment
        questionId,
        answer,
        isCorrect,
        pointsAwarded,
      },
    });

    return {
      isCorrect,
      pointsAwarded,
      explanation: question.explanation,
      correctAnswer: isCorrect ? undefined : question.correctAnswer,
    };
  }

  private checkAnswer(question: any, userAnswer: any): boolean {
    const correctAnswer = question.correctAnswer;

    switch (question.questionType) {
      case 'MULTIPLE_CHOICE':
      case 'TRUE_FALSE':
        return userAnswer === correctAnswer;
      
      case 'MATCHING':
        return JSON.stringify(userAnswer) === JSON.stringify(correctAnswer);
      
      case 'ESSAY':
        // For essay, we can't auto-grade, so mark as pending review
        return false;
      
      default:
        return userAnswer === correctAnswer;
    }
  }

  async getStudentQuizResults(userId: string) {
    const answers = await this.prisma.quizAnswer.findMany({
      where: {
        studentAssignment: {
          studentId: userId,
        },
      },
      include: {
        question: {
          select: {
            questionText: true,
            questionType: true,
            points: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const totalPoints = answers.reduce((sum, a) => sum + a.pointsAwarded, 0);
    const maxPoints = answers.reduce((sum, a) => sum + a.question.points, 0);

    return {
      totalQuestions,
      correctAnswers,
      accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
      totalPoints,
      maxPoints,
      score: maxPoints > 0 ? Math.round((totalPoints / maxPoints) * 100) : 0,
    };
  }
}