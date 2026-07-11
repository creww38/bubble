import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ClassesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.class.findMany({
      include: {
        _count: { select: { students: true } },
        teacher: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const classData = await this.prisma.class.findUnique({
      where: { id },
      include: {
        students: {
          include: {
            student: {
              include: {
                user: { select: { id: true, fullName: true, email: true } },
              },
            },
          },
        },
        teacher: {
          include: { user: { select: { fullName: true } } },
        },
      },
    });

    if (!classData) throw new NotFoundException('Class not found');
    return classData;
  }

  async findByTeacher(teacherId: string) {
    return this.prisma.class.findMany({
      where: { teacherId },
      include: {
        _count: { select: { students: true } },
      },
    });
  }

  async create(data: { name: string; grade: number; schoolId: string; teacherId: string }) {
    return this.prisma.class.create({ data });
  }

  async addStudent(classId: string, studentProfileId: string) {
    return this.prisma.classStudent.create({
      data: { classId, studentProfileId },
    });
  }

  async removeStudent(classId: string, studentProfileId: string) {
    return this.prisma.classStudent.delete({
      where: {
        classId_studentProfileId: { classId, studentProfileId },
      },
    });
  }
}