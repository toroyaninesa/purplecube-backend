import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/models /user.entity';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currentStageId: number;

  @Column({ nullable: true })
  finalStageMessage: string;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;
}
