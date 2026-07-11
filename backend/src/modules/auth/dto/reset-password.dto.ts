import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Password reset token' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewStrongP@ss456', description: 'New password' })
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  newPassword: string;
}