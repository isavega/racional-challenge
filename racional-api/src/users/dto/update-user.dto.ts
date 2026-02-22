import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'María González' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'maria@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '12.345.678-K' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.toUpperCase() : value)
  rut?: string;

  @ApiPropertyOptional({ example: '+56912345678' })
  @IsOptional()
  @IsString()
  phone?: string;
}
