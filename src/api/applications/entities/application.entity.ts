import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/models /user.entity';
import { Job } from '../../jobs/entities/job.entity';
import { EStatus } from './status.enum';

@Entity()
export class Application extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EStatus,
    default: EStatus.SUBMITTED,
  })
  status: EStatus;

  @Column({ default: false })
  hired: boolean;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Job, (job) => job.applications)
  job: Job;
}
