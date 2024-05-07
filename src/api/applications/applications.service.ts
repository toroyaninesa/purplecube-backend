import { HttpService, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ApplicationsService {
  @InjectRepository(Application)
  readonly applicationRepository: Repository<Application>;
  constructor(private readonly httpService: HttpService) {}

  public save(app: any) {
    return this.applicationRepository.save(app);
  }

  async getApplications(userId: number) {
    return this.applicationRepository.find({
      where: { user: { id: userId } },
      relations: { user: true, job: true },
      join: {
        alias: 'application',
        leftJoinAndSelect: {
          job: 'application.job',
          jobStages: 'job.jobStages',
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

  async calculateSimilarityScoreForApplicant(body: {
    resumePrompt: string[];
    requirementsPrompt: string[];
  }) {
    const url = process.env.ML_SCRIPTS_BASE_URL + '/get-similarity-score';
    try {
      const response = await this.httpService.post(url, body).toPromise();
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
}
