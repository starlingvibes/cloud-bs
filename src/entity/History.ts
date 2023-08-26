import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './User';

@Entity()
export class History {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: '' })
  fileName: string;

  @Column({ type: 'enum', enum: ['CREATE', 'DOWNLOAD', 'DELETE'] })
  action: 'CREATE' | 'DOWNLOAD' | 'DELETE';

  @CreateDateColumn()
  timestamp: Date;
}
