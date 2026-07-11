import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SchoolsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.school.findMany({
      include: {
        _count: { select: { classes: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const school = await this.prisma.school.findUnique({
      where: { id },
      include: {
        classes: {
          include: {
            _count: { select: { students: true } },
          },
        },
      },
    });

    if (!school) throw new NotFoundException('School not found');
    return school;
  }

  async create(data: { name: string; npsn?: string; address?: string; city?: string; province?: string }) {
    return this.prisma.school.create({ data });
  }
}