import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Buy groceries', description: 'Title of the task' })
  title!: string;

  @ApiPropertyOptional({ example: 'Milk, eggs, bread', description: 'Optional task details' })
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether the task is completed' })
  completed?: boolean;
}