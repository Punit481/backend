import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserStatus } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  name!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email address' })
  email!: string;

  @ApiProperty({ example: 'securePassword123', description: 'Plain password (will be hashed)' })
  password!: string;

  @ApiPropertyOptional({ example: 'user', description: 'Role: user or admin' })
  role?: string;

  @ApiPropertyOptional({ enum: UserStatus, example: UserStatus.PENDING, description: 'Account status' })
  status?: UserStatus;
}