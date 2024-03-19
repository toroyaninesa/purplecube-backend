import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthHelper } from '../user/auth/auth.helper';

@Injectable()
export class ApplicationsService {
  @InjectRepository(Application)
  readonly applicationRepository: Repository<Application>;
  constructor(private auth: AuthHelper) {}

  public save(app: any) {
    return this.applicationRepository.save(app);
  }

  async getApplications(token: string) {
    const user: { id: number } = await this.auth.decode(token.split(' ')[1]);
    return this.applicationRepository.find({
      where: { user: { id: user.id } },
      relations: { user: true, job: true },
      join: {
        alias: 'application',
        leftJoinAndSelect: {
          job: 'application.job',
          company: 'job.company',
        },
      },
    });
  }

  getJobApplications(id: number) {
    return this.applicationRepository
      .createQueryBuilder('application')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .leftJoinAndSelect('application.user', 'user')
      .where('job.id = (:id)', { id })
      .getMany();
  }
}
