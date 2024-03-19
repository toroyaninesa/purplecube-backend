import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Job } from '../../jobs/entities/job.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string;

  @Column({ type: 'varchar', nullable: true })
  public image_url: string;

  @OneToMany(() => Job, (job: Job) => job.company)
  public jobs: Job[];
}
