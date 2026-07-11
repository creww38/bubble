import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { InteractionDto } from './dto/interaction.dto';

@ApiTags('Simulations')
@Controller('simulations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SimulationsController {
  constructor(private readonly simService: SimulationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all simulations' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'type', required: false, enum: ['INSTAGRAM', 'TWITTER', 'WHATSAPP', 'NEWS_PORTAL'] })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: string,
  ) {
    return this.simService.findAll({ page, limit, type: type as any });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get simulation by ID with posts' })
  async findOne(@Param('id') id: string) {
    return this.simService.findById(id);
  }

  @Post()
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Create new simulation (Teacher/Admin)' })
  async create(
    @Body() dto: CreateSimulationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.simService.create(dto, userId);
  }

  @Post(':id/posts')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Add post to simulation' })
  async createPost(
    @Param('id') simulationId: string,
    @Body() dto: CreatePostDto,
  ) {
    return this.simService.createPost(simulationId, dto);
  }

  @Post('posts/:id/interact')
  @ApiOperation({ summary: 'Interact with a post' })
  async interact(
    @Param('id') postId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: InteractionDto,
  ) {
    return this.simService.interact(postId, userId, dto);
  }

  @Get('student/progress')
  @Roles('STUDENT')
  @ApiOperation({ summary: 'Get student simulation progress' })
  async getProgress(@CurrentUser('id') userId: string) {
    return this.simService.getStudentProgress(userId);
  }
}