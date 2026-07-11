import { IsString, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ example: 'John Doe', description: 'Author name' })
  @IsString()
  authorName: string;

  @ApiPropertyOptional({ description: 'Author avatar URL' })
  @IsString()
  @IsOptional()
  authorAvatar?: string;

  @ApiProperty({ example: 'This is a post content...', description: 'Post content' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: ['https://example.com/image.jpg'] })
  @IsArray()
  @IsOptional()
  mediaUrls?: string[];

  @ApiPropertyOptional({ 
    example: 'CONFIRMATION_BIAS',
    description: 'Type of bias in this post',
    enum: ['CONFIRMATION_BIAS', 'ANCHORING_BIAS', 'AVAILABILITY_BIAS', 'HALO_EFFECT', 'BANDWAGON_EFFECT', 'AUTHORITY_BIAS', 'FRAMING_EFFECT', 'SURVIVORSHIP_BIAS', 'SELECTION_BIAS', 'FALSE_CONSENSUS', 'HINDSIGHT_BIAS', 'OUTCOME_BIAS'],
  })
  @IsString()
  @IsOptional()
  biasType?: string;

  @ApiPropertyOptional({ example: false, description: 'Is this misinformation?' })
  @IsBoolean()
  @IsOptional()
  isMisinformation?: boolean;

  @ApiPropertyOptional({ description: 'URL for fact checking reference' })
  @IsString()
  @IsOptional()
  factCheckUrl?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Post date' })
  @IsDateString()
  @IsOptional()
  postedAt?: string;
}