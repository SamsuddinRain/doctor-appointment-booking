import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, unique: true })
  googleId?: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PATIENT })
  role: UserRole;
}
