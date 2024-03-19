import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Exclude } from 'class-transformer';
import ERole from '../auth/role/role.enum';
import { Job } from '../../jobs/entities/job.entity';
import { Application } from "../../applications/entities/application.entity";
import { Experience } from "./experience.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public email!: string;

  @Exclude()
  @Column({ type: 'varchar' })
  public password!: string;

  @Column({ type: 'varchar', nullable: true })
  public name: string | null;

  @Column({ type: 'varchar', nullable: true })
  public surname: string | null;

  @Column({ type: 'int', nullable: true })
  public companyId: number | null;

  @Column({
    type: 'enum',
    enum: ERole,
    default: ERole.User,
  })
  public role: ERole;

  @Column({ type: 'timestamp', nullable: true, default: null })
  public lastLoginAt: Date | null;

  @ManyToMany(() => Job, { cascade: true , createForeignKeyConstraints: true})
  @JoinTable({
    name: 'user_saved_jobs',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'job_id', referencedColumnName: 'id' },
  })
  saved_jobs: Job[];

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Experience, (experience) => experience.user)
  experience: Experience[];
}
