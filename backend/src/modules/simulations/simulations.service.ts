import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../database/prisma.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { InteractionDto } from './dto/interaction.dto';
import { SimulationType, InteractionType, BiasTypeEnum } from '@prisma/client';

@Injectable()
export class SimulationsService {
  private readonly logger = new Logger(SimulationsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async findAll(params: {
    page?: number;
    limit?: number;
    type?: SimulationType;
    difficultyLevel?: number;
  }) {
    const { page = 1, limit = 10, type, difficultyLevel } = params;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (type) where.type = type;
    if (difficultyLevel) where.difficultyLevel = difficultyLevel;

    const [simulations, total] = await Promise.all([
      this.prisma.simulation.findMany({
        where,
        skip,
        take: limit,
        include: {
          _count: {
            select: { posts: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.simulation.count({ where }),
    ]);

    return {
      data: simulations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const simulation = await this.prisma.simulation.findUnique({
      where: { id },
      include: {
        posts: {
          orderBy: { postedAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!simulation) {
      throw new NotFoundException('Simulation not found');
    }

    return simulation;
  }

  async create(dto: CreateSimulationDto, userId: string) {
    const simulation = await this.prisma.simulation.create({
      data: {
        title: dto.title,
        type: dto.type as SimulationType,
        description: dto.description,
        difficultyLevel: dto.difficultyLevel || 1,
        createdBy: userId,
        isTemplate: dto.isTemplate || false,
        thumbnailUrl: dto.thumbnailUrl,
      },
    });

    this.eventEmitter.emit('simulation.created', {
      simulationId: simulation.id,
      createdBy: userId,
      type: simulation.type,
    });

    this.logger.log(`Simulation created: ${simulation.title}`);
    return simulation;
  }

  async createPost(simulationId: string, dto: CreatePostDto) {
    const simulation = await this.findById(simulationId);

    const post = await this.prisma.simulationPost.create({
      data: {
        simulationId,
        authorName: dto.authorName,
        authorAvatar: dto.authorAvatar,
        content: dto.content,
        mediaUrls: dto.mediaUrls as any,
        biasType: dto.biasType as BiasTypeEnum,
        isMisinformation: dto.isMisinformation || false,
        factCheckUrl: dto.factCheckUrl,
        metadata: dto.metadata as any,
        postedAt: dto.postedAt || new Date(),
      },
    });

    this.logger.log(`Post created for simulation: ${simulation.title}`);
    return post;
  }

  async interact(postId: string, userId: string, dto: InteractionDto) {
    const post = await this.prisma.simulationPost.findUnique({
      where: { id: postId },
      include: { simulation: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if already interacted
    const existingInteraction = await this.prisma.postInteraction.findFirst({
      where: {
        postId,
        userId,
      },
    });

    if (existingInteraction) {
      throw new BadRequestException('You have already interacted with this post');
    }

    // Calculate points and determine if correct
    const { points, isCorrect } = this.calculatePoints(post, dto.interactionType);

    // Save interaction
    const interaction = await this.prisma.postInteraction.create({
      data: {
        postId,
        userId,
        interactionType: dto.interactionType as InteractionType,
        isCorrect,
        pointsEarned: points,
        timeSpent: dto.timeSpent,
      },
    });

    // Update student XP if points earned
    if (points > 0) {
      await this.prisma.studentProfile.upsert({
        where: { userId },
        create: {
          userId,
          xp: points,
          level: 1,
        },
        update: {
          xp: { increment: points },
        },
      });

      // Check for level up
      await this.checkLevelUp(userId);
    }

    // Generate feedback
    const feedback = this.generateFeedback(post, dto.interactionType);

    // Emit event for analytics
    this.eventEmitter.emit('interaction.completed', {
      userId,
      postId,
      interactionType: dto.interactionType,
      points,
      isCorrect,
      biasType: post.biasType,
    });

    return {
      interaction: {
        id: interaction.id,
        interactionType: interaction.interactionType,
        pointsEarned: points,
        isCorrect,
      },
      feedback,
      pointsEarned: points,
      isCorrect,
    };
  }

  async getStudentProgress(userId: string) {
    const interactions = await this.prisma.postInteraction.findMany({
      where: { userId },
      include: {
        post: {
          select: {
            biasType: true,
            isMisinformation: true,
            content: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const totalInteractions = interactions.length;
    const correctInteractions = interactions.filter((i) => i.isCorrect).length;
    const totalPoints = interactions.reduce((sum, i) => sum + i.pointsEarned, 0);

    // Calculate bias recognition stats
    const biasStats = interactions.reduce((acc: any, interaction) => {
      const biasType = interaction.post.biasType || 'UNKNOWN';
      if (!acc[biasType]) {
        acc[biasType] = { total: 0, correct: 0 };
      }
      acc[biasType].total++;
      if (interaction.isCorrect) acc[biasType].correct++;
      return acc;
    }, {});

    return {
      totalInteractions,
      correctInteractions,
      accuracy: totalInteractions > 0 ? Math.round((correctInteractions / totalInteractions) * 100) : 0,
      totalPoints,
      biasStats,
    };
  }

  private calculatePoints(post: any, interactionType: string): { points: number; isCorrect: boolean } {
    let points = 0;
    let isCorrect = false;

    switch (interactionType) {
      case 'FACT_CHECK':
        points = post.isMisinformation ? 20 : 10;
        isCorrect = true;
        break;
      case 'DISBELIEVE':
        points = post.isMisinformation ? 15 : 0;
        isCorrect = post.isMisinformation;
        break;
      case 'BELIEVE':
        points = post.isMisinformation ? 0 : 15;
        isCorrect = !post.isMisinformation;
        break;
      case 'SEARCH_REFERENCE':
        points = 5;
        isCorrect = true;
        break;
      case 'REPORT':
        points = post.isMisinformation ? 10 : 0;
        isCorrect = post.isMisinformation;
        break;
      case 'BOOKMARK':
        points = 2;
        isCorrect = true;
        break;
      default:
        points = 0;
        isCorrect = false;
    }

    return { points, isCorrect };
  }

  private generateFeedback(post: any, interactionType: string): any {
    const feedback: any = {
      message: '',
      biasExplanation: '',
      tips: [],
    };

    const isCorrectResponse =
      (interactionType === 'FACT_CHECK' && post.isMisinformation) ||
      (interactionType === 'DISBELIEVE' && post.isMisinformation) ||
      (interactionType === 'BELIEVE' && !post.isMisinformation);

    if (isCorrectResponse) {
      feedback.message = '🎉 Bagus! Kamu menunjukkan pemikiran kritis yang baik.';
    } else {
      feedback.message = '🤔 Hmm, coba periksa lagi informasi ini dengan lebih teliti.';
    }

    if (post.biasType) {
      feedback.biasExplanation = this.getBiasExplanation(post.biasType);
    }

    feedback.tips = [
      'Selalu periksa sumber informasi',
      'Bandingkan dengan sumber lain yang terpercaya',
      'Perhatikan tanggal publikasi',
      'Cek apakah ada bias dalam penyampaian informasi',
    ];

    return feedback;
  }

  private getBiasExplanation(biasType: string): string {
    const explanations: Record<string, string> = {
      CONFIRMATION_BIAS: 'Kecenderungan untuk mencari informasi yang mendukung keyakinan yang sudah ada.',
      ANCHORING_BIAS: 'Kecenderungan terlalu bergantung pada informasi pertama yang diterima.',
      AVAILABILITY_BIAS: 'Menilai sesuatu berdasarkan informasi yang paling mudah diingat.',
      HALO_EFFECT: 'Menilai sesuatu secara keseluruhan berdasarkan satu kesan positif atau negatif.',
      BANDWAGON_EFFECT: 'Kecenderungan mengikuti apa yang dilakukan orang banyak.',
      AUTHORITY_BIAS: 'Terlalu percaya pada pendapat figur otoritas tanpa evaluasi kritis.',
      FRAMING_EFFECT: 'Keputusan dipengaruhi oleh cara informasi disajikan.',
      SURVIVORSHIP_BIAS: 'Hanya fokus pada contoh yang berhasil dan mengabaikan yang gagal.',
      SELECTION_BIAS: 'Kesimpulan ditarik dari data yang tidak representatif.',
      FALSE_CONSENSUS: 'Menganggap bahwa orang lain memiliki keyakinan yang sama dengan kita.',
      HINDSIGHT_BIAS: 'Merasa bahwa suatu kejadian sudah bisa diprediksi setelah kejadian tersebut terjadi.',
      OUTCOME_BIAS: 'Menilai keputusan berdasarkan hasilnya, bukan proses pengambilan keputusannya.',
    };

    return explanations[biasType] || 'Jenis bias kognitif yang mempengaruhi penilaian.';
  }

  private async checkLevelUp(userId: string) {
    const profile = await this.prisma.studentProfile.findUnique({
      where: { userId },
    });

    if (!profile) return;

    const xpNeeded = profile.level * profile.level * 100;

    if (profile.xp >= xpNeeded) {
      await this.prisma.studentProfile.update({
        where: { userId },
        data: {
          level: { increment: 1 },
        },
      });

      this.eventEmitter.emit('student.leveledUp', {
        userId,
        newLevel: profile.level + 1,
      });

      this.logger.log(`User ${userId} leveled up to ${profile.level + 1}`);
    }
  }
}