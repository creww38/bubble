import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class GamificationService {
  private readonly logger = new Logger(GamificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStudentProgress(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return {
        xp: 0,
        level: 1,
        totalScore: 0,
        streak: 0,
        xpToNextLevel: 100,
        progress: 0,
      };
    }

    const xpToNextLevel = profile.level * profile.level * 100;
    const progress = Math.round((profile.xp / xpToNextLevel) * 100);

    return {
      xp: profile.xp,
      level: profile.level,
      totalScore: profile.totalScore,
      streak: profile.streak,
      xpToNextLevel,
      progress: Math.min(progress, 100),
    };
  }

  async getBadges(userId: string) {
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      include: {
        badge: true,
      },
      orderBy: { awardedAt: 'desc' },
    });

    return userBadges.map((ub) => ({
      id: ub.badge.id,
      name: ub.badge.name,
      description: ub.badge.description,
      iconUrl: ub.badge.iconUrl,
      category: ub.badge.category,
      awardedAt: ub.awardedAt,
    }));
  }

  async getLeaderboard(params: { limit?: number; type?: string } = {}) {
    const { limit = 10 } = params;

    const topStudents = await this.prisma.studentProfile.findMany({
      take: limit,
      orderBy: { xp: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return topStudents.map((student, index) => ({
      rank: index + 1,
      userId: student.user.id,
      fullName: student.user.fullName,
      avatarUrl: student.user.avatarUrl,
      xp: student.xp,
      level: student.level,
      streak: student.streak,
    }));
  }

  async getClassLeaderboard(classId: string, limit: number = 10) {
    const classStudents = await this.prisma.classStudent.findMany({
      where: { classId },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    const sorted = classStudents
      .sort((a, b) => b.student.xp - a.student.xp)
      .slice(0, limit)
      .map((cs, index) => ({
        rank: index + 1,
        userId: cs.student.user.id,
        fullName: cs.student.user.fullName,
        avatarUrl: cs.student.user.avatarUrl,
        xp: cs.student.xp,
        level: cs.student.level,
      }));

    return sorted;
  }

  async checkAndAwardBadges(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) return [];

    const allBadges = await this.prisma.badge.findMany();
    const userBadges = await this.prisma.userBadge.findMany({
      where: { userId },
      select: { badgeId: true },
    });

    const existingBadgeIds = userBadges.map((ub) => ub.badgeId);
    const newBadges: any[] = [];

    for (const badge of allBadges) {
      if (existingBadgeIds.includes(badge.id)) continue;

      const criteria = badge.criteria as any;
      let earned = false;

      // Check different criteria types
      if (criteria.xpRequired && profile.xp >= criteria.xpRequired) {
        earned = true;
      }
      if (criteria.levelRequired && profile.level >= criteria.levelRequired) {
        earned = true;
      }
      if (criteria.streakRequired && profile.streak >= criteria.streakRequired) {
        earned = true;
      }

      if (earned) {
        await this.prisma.userBadge.create({
          data: {
            userId,
            badgeId: badge.id,
          },
        });
        newBadges.push(badge);
        this.logger.log(`Badge "${badge.name}" awarded to user ${userId}`);
      }
    }

    return newBadges;
  }

  async getDailyChallenge() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const challenge = await this.prisma.dailyChallenge.findFirst({
      where: {
        date: {
          gte: today,
        },
      },
    });

    return challenge || {
      title: 'Tantangan Hari Ini',
      description: 'Identifikasi 3 berita yang mengandung bias hari ini!',
      type: 'FACT_CHECK',
      reward: 50,
    };
  }

  async completeDailyChallenge(userId: string, challengeId: string) {
    const challenge = await this.prisma.dailyChallenge.findUnique({
      where: { id: challengeId },
    });

    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Check if already completed
    const existing = await this.prisma.dailyChallengeCompletion.findUnique({
      where: {
        challengeId_userId: {
          challengeId,
          userId,
        },
      },
    });

    if (existing) {
      return { message: 'Challenge already completed', alreadyCompleted: true };
    }

    // Mark as completed
    await this.prisma.dailyChallengeCompletion.create({
      data: {
        challengeId,
        userId,
      },
    });

    // Award XP
    await this.prisma.studentProfile.update({
      where: { userId },
      data: {
        xp: { increment: challenge.reward },
      },
    });

    // Update streak
    await this.updateStreak(userId);

    return {
      message: 'Challenge completed!',
      xpAwarded: challenge.reward,
    };
  }

  private async updateStreak(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was activity yesterday
    const yesterdayActivity = await this.prisma.postInteraction.findFirst({
      where: {
        userId,
        createdAt: {
          gte: yesterday,
          lt: today,
        },
      },
    });

    const newStreak = yesterdayActivity ? profile.streak + 1 : 1;

    await this.prisma.studentProfile.update({
      where: { userId },
      data: { streak: newStreak },
    });
  }
}