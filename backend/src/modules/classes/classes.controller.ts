import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { CurrentUser } from '../../core/decorators/current-user.decorator';
import { ClassesService } from './classes.service';

@ApiTags('Classes')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all classes' })
  async findAll() {
    return this.classesService.findAll();
  }

  @Get('my-classes')
  @Roles('TEACHER')
  @ApiOperation({ summary: 'Get teacher classes' })
  async getMyClasses(@CurrentUser('id') teacherId: string) {
    return this.classesService.findByTeacher(teacherId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get class by ID' })
  async findOne(@Param('id') id: string) {
    return this.classesService.findById(id);
  }

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Create new class' })
  async create(@Body() data: any) {
    return this.classesService.create(data);
  }

  @Post(':id/students')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Add student to class' })
  async addStudent(@Param('id') classId: string, @Body('studentProfileId') studentProfileId: string) {
    return this.classesService.addStudent(classId, studentProfileId);
  }

  @Delete(':id/students/:studentId')
  @Roles('TEACHER', 'ADMIN')
  @ApiOperation({ summary: 'Remove student from class' })
  async removeStudent(@Param('id') classId: string, @Param('studentId') studentId: string) {
    return this.classesService.removeStudent(classId, studentId);
  }
}