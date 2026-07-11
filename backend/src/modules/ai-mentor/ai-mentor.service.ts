import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OpenAIService } from './services/openai.service';

@Injectable()
export class AIMentorService {
  private readonly logger = new Logger(AIMentorService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly openAIService: OpenAIService,
  ) {}

  async chat(userId: string, message: string, context?: any) {
    // Save user message first
    const userInteraction = await this.prisma.aIInteraction.create({
      data: {
        userId,
        userMessage: message,
        aiResponse: '',
        interactionType: 'QUESTION',
      },
    });

    // Get conversation history (last 10 messages)
    const history = await this.getConversationHistory(userId, 10);

    // Generate AI response using Socratic method
    const aiResponse = await this.openAIService.generateSocraticResponse(
      message,
      history,
      context,
    );

    // Update with AI response
    await this.prisma.aIInteraction.update({
      where: { id: userInteraction.id },
      data: {
        aiResponse,
        interactionType: this.determineInteractionType(aiResponse),
      },
    });

    return {
      messageId: userInteraction.id,
      response: aiResponse,
      timestamp: new Date(),
    };
  }

  async getHint(userId: string, simulationId: string, postId: string) {
    const post = await this.prisma.simulationPost.findUnique({
      where: { id: postId },
      include: { simulation: true },
    });

    if (!post) {
      return { hint: 'Post not found.' };
    }

    const hint = await this.openAIService.generateHint(post);

    // Save interaction
    await this.prisma.aIInteraction.create({
      data: {
        userId,
        simulationId,
        userMessage: 'Request hint for post',
        aiResponse: hint,
        interactionType: 'HINT',
      },
    });

    return { hint, postId };
  }

  async getExplanation(userId: string, topic: string) {
    const explanation = await this.openAIService.generateExplanation(topic);

    await this.prisma.aIInteraction.create({
      data: {
        userId,
        userMessage: `Explain: ${topic}`,
        aiResponse: explanation,
        interactionType: 'EXPLANATION',
      },
    });

    return { explanation, topic };
  }

  async getRecommendations(userId: string) {
    // Analyze student's weak areas based on interactions
    const interactions = await this.prisma.postInteraction.findMany({
      where: { userId, isCorrect: false },
      include: {
        post: {
          select: { biasType: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    // Find most common bias types they struggle with
    const biasCount = interactions.reduce((acc: any, interaction) => {
      const biasType = interaction.post.biasType || 'GENERAL';
      acc[biasType] = (acc[biasType] || 0) + 1;
      return acc;
    }, {});

    const weakAreas = Object.entries(biasCount)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 3)
      .map(([biasType]) => biasType);

    const recommendations = await this.openAIService.generateRecommendations(weakAreas);

    await this.prisma.aIInteraction.create({
      data: {
        userId,
        userMessage: 'Request recommendations',
        aiResponse: JSON.stringify(recommendations),
        interactionType: 'RECOMMENDATION',
      },
    });

    return { recommendations, weakAreas };
  }

  async getConversationHistory(userId: string, limit: number = 10) {
    const interactions = await this.prisma.aIInteraction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        userMessage: true,
        aiResponse: true,
      },
    });

    // Return in chronological order
    return interactions.reverse();
  }

  private determineInteractionType(response: string): string {
    if (response.includes('?')) return 'QUESTION';
    if (response.includes('Hint:') || response.includes('Petunjuk:')) return 'HINT';
    if (response.length > 500) return 'EXPLANATION';
    return 'RECOMMENDATION';
  }
}