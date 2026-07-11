import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalSimulations,
      totalInteractions,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { roles: { has: 'STUDENT' } } }),
      this.prisma.user.count({ where: { roles: { has: 'TEACHER' } } }),
      this.prisma.simulation.count(),
      this.prisma.postInteraction.count(),
    ]);

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalSimulations,
      totalInteractions,
    };
  }

  async getStudentAnalytics(userId: string) {
    const interactions = await this.prisma.postInteraction.findMany({
      where: { userId },
      include: {
        post: {
          select: {
            biasType: true,
            isMisinformation: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = interactions.length;
    const correct = interactions.filter((i) => i.isCorrect).length;
    const totalPoints = interactions.reduce((sum, i) => sum + i.pointsEarned, 0);

    // Bias recognition by type
    const biasAccuracy: Record<string, { total: number; correct: number }> = {};
    interactions.forEach((i) => {
      const biasType = i.post.biasType || 'UNKNOWN';
      if (!biasAccuracy[biasType]) {
        biasAccuracy[biasType] = { total: 0, correct: 0 };
      }
      biasAccuracy[biasType].total++;
      if (i.isCorrect) biasAccuracy[biasType].correct++;
    });

    // Weekly activity
    const weeklyActivity = this.getWeeklyActivity(interactions);

    return {
      overview: {
        totalInteractions: total,
        correctInteractions: correct,
        accuracy: total > 0 ? Math.round((correct / total) * 100) : 0,
        totalPoints,
      },
      biasAccuracy: Object.entries(biasAccuracy).map(([type, data]) => ({
        biasType: type,
        total: data.total,
        correct: data.correct,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      })),
      weeklyActivity,
    };
  }

  async getTeacherDashboard(teacherId: string) {
    // Get teacher's classes
    const classes = await this.prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: { select: { students: true } },
        students: {
          include: {
            student: {
              include: {
                user: { select: { fullName: true } },
              },
            },
          },
        },
      },
    });

    const classIds = classes.map((c) => c.id);
    const studentIds = classes.flatMap((c) =>
      c.students.map((s) => s.student.userId),
    );

    // Get student progress
    const studentProgress = await Promise.all(
      studentIds.map(async (userId) => {
        const profile = await this.prisma.studentProfile.findUnique({
          where: { userId },
        });
        const interactions = await this.prisma.postInteraction.count({
          where: { userId },
        });
        const correctInteractions = await this.prisma.postInteraction.count({
          where: { userId, isCorrect: true },
        });

        const user = await this.prisma.user.findUnique({
          where: { id: userId },
          select: { fullName: true },
        });

        return {
          userId,
          fullName: user?.fullName,
          xp: profile?.xp || 0,
          level: profile?.level || 1,
          interactions,
          accuracy: interactions > 0 ? Math.round((correctInteractions / interactions) * 100) : 0,
        };
      }),
    );

    return {
      classes: classes.map((c) => ({
        id: c.id,
        name: c.name,
        studentCount: c._count.students,
      })),
      students: studentProgress.sort((a, b) => b.xp - a.xp),
      overview: {
        totalStudents: studentIds.length,
        averageXP: studentProgress.length > 0
          ? Math.round(studentProgress.reduce((sum, s) => sum + s.xp, 0) / studentProgress.length)
          : 0,
        averageAccuracy: studentProgress.length > 0
          ? Math.round(studentProgress.reduce((sum, s) => sum + s.accuracy, 0) / studentProgress.length)
          : 0,
      },
    };
  }

  async getMostCommonBiases() {
    const interactions = await this.prisma.postInteraction.findMany({
      where: { isCorrect: false },
      include: {
        post: { select: { biasType: true } },
      },
    });

    const biasCounts: Record<string, number> = {};
    interactions.forEach((i) => {
      const biasType = i.post.biasType || 'UNKNOWN';
      biasCounts[biasType] = (biasCounts[biasType] || 0) + 1;
    });

    return Object.entries(biasCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([biasType, count]) => ({ biasType, count }));
  }

  private getWeeklyActivity(interactions: any[]) {
    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
    const today = new Date();
    const weekData: Record<string, number> = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
      weekData[dayName] = 0;
    }

    // Count interactions per day
    interactions.forEach((i) => {
      const date = new Date(i.createdAt);
      const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays < 7) {
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        weekData[dayName] = (weekData[dayName] || 0) + 1;
      }
    });

    return Object.entries(weekData).map(([day, count]) => ({ day, count }));
  }
}