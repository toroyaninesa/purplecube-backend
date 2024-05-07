import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Job } from './job.entity';

@Entity()
export class JobStages extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  stageTitle: string;

  @Column({ nullable: false })
  stagePrefix: string;

  @Column({ nullable: false })
  orderNumber: number;

  @ManyToOne(() => Job, (job) => job.jobStages)
  job: Job;
}
