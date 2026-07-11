import { IsString, IsOptional, IsBoolean, IsInt, Min, Max, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSimulationDto {
  @ApiProperty({ example: 'Instagram Bias Detection', description: 'Simulation title' })
  @IsString()
  title: string;

  @ApiProperty({ 
    example: 'INSTAGRAM', 
    description: 'Simulation type',
    enum: ['INSTAGRAM', 'TWITTER', 'FACEBOOK', 'TIKTOK', 'WHATSAPP', 'NEWS_PORTAL', 'DISCUSSION_FORUM'],
  })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'Learn to detect bias in Instagram posts' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'Difficulty level 1-5' })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  difficultyLevel?: number;

  @ApiPropertyOptional({ example: false, description: 'Is this a template?' })
  @IsBoolean()
  @IsOptional()
  isTemplate?: boolean;

  @ApiPropertyOptional({ description: 'Thumbnail image URL' })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;
}