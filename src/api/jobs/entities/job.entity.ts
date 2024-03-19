import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Company } from '../../company/entities/company.entity';
import { Application } from "../../applications/entities/application.entity";
import { application } from "express";
import { EmploymentLevelEnum, EmploymentTypeEnum } from "./search.enum";
import { Category } from "./category.entity";

@Entity()
export class Job extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar' })
  public title!: string;

  @Column({ type: 'varchar', nullable: true })
  public description: string;

  @Column({ type: 'int' })
  public max_applications: number;

  @Column({ type: 'int', default: 0 })
  public no_applicants: number;

  @Column({ type: 'boolean', readonly: true, default: false })
  public approved: boolean;

  @Column({
    type: 'enum',
    enum: EmploymentTypeEnum,
    default: EmploymentTypeEnum.FULL_TIME,
  })
  employment: EmploymentTypeEnum;

  @Column({
    type: 'enum',
    enum: EmploymentLevelEnum,
    default: EmploymentLevelEnum.ENTRY,
  })
  level: EmploymentLevelEnum;

  @ManyToOne(() => Company, (company: Company) => company.jobs, {cascade: true})
  public company: Company;

  @ManyToMany(() => Category, { cascade: true , createForeignKeyConstraints: true})
  @JoinTable({
    name: 'job_categories',
  })
  categories: Category[];

  @OneToMany(() => Application, (application) => application.job, {
    nullable: true,
  })
  applications: Application[];

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

}
