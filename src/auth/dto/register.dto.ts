import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @ApiProperty({ example: 'jane@example.com' })
  email!: string;

  @ApiProperty({ example: '9876543210' })
  contactNumber!: string;

  @ApiProperty({ example: 25 })
  age!: number;

  @ApiProperty({ example: 'Software Intern' })
  designation!: string;

  @ApiProperty({ example: 'securePassword123' })
  password!: string;
}