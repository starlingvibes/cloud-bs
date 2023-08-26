import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { File } from './File';
import { History } from './History';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ enum: ['admin', 'user'] })
  role: string;

  @Column()
  password: string;

  @OneToMany(() => File, (file) => file.user)
  files: File[];

  @OneToMany(() => History, (history) => history.user)
  history: History[];
}
