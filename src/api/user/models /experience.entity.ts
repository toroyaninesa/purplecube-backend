import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Experience extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public companyName: string;

  @Column({ type: 'varchar' })
  public positionTitle: string;

  @Column({ type: 'text', nullable: true })
  public description: string;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public startDate: Date | null;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public endDate: Date | null;

  @ManyToOne(() => User, (user) => user.experience)
  user: User;
}
