import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InteractionDto {
  @ApiProperty({ 
    example: 'FACT_CHECK',
    description: 'Type of interaction',
    enum: ['BELIEVE', 'DISBELIEVE', 'FACT_CHECK', 'SEARCH_REFERENCE', 'REPORT', 'BOOKMARK'],
  })
  @IsString()
  interactionType: string;

  @ApiPropertyOptional({ example: 30, description: 'Time spent in seconds' })
  @IsInt()
  @Min(0)
  @IsOptional()
  timeSpent?: number;
}