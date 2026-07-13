import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  DEACTIVATE = 'deactivate',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status!: UserStatus;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'user' })
  role!: string;

  @Column()
  contactNumber!: string;

  @Column()
  age!: number;

  @Column()
  designation!: string;
}