import { HttpService, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Experience } from '../user/models /experience.entity';

@Injectable()
export class ApplicationsService {
  @InjectRepository(Application)
  readonly applicationRepository: Repository<Application>;
  @InjectRepository(Experience)
  readonly experienceRepository: Repository<Experience>;
  constructor(private readonly httpService: HttpService) {}

  public save(app: any) {
    return this.applicationRepository.save(app);
  }

  async getApplications(userId: number) {
    const application = await this.applicationRepository.find({
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
    this.sortApplication(application);
    return application;
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

  async calculateMultipleSimilarityScores(ids: number[]) {
    const similarityScores = {};

    const promises = ids.map(async (id) => {
      try {
        const score = await this.calculateSimilarityScoreForApplicant(id);
        similarityScores[id] = score;
      } catch (error) {
        similarityScores[id] = null;
      }
    });

    await Promise.all(promises);

    return similarityScores;
  }

  private async calculateSimilarityScoreForApplicant(id: number) {
    const application = await this.getOneApplication(id);
    const userId = application.user.id;
    const experiences = await this.experienceRepository
      .createQueryBuilder('experience')
      .where('experience.userId = :id', { id: userId })
      .getMany();
    const body = {
      resumePrompt: [
        this.getFirst250Words(
          experiences.map((exp) => exp.description).join(' '),
        ),
      ],
      requirementsPrompt: [this.getFirst250Words(application.job.description)],
    };
    const url = process.env.ML_SCRIPTS_BASE_URL + '/get-similarity-score';
    try {
      const response = await this.httpService.post(url, body).toPromise();
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  private getFirst250Words(input: string): string {
    const words = input.split(/\s+/);
    const first512Words = words.slice(0, 250);
    return first512Words.join(' ');
  }

  getOneApplication(id: number) {
    return this.applicationRepository.findOne({
      where: { id },
      relations: { job: true, user: true },
    });
  }

  private sortApplication(applications) {
    applications.forEach((application) => {
      application.job.jobStages.sort((a, b) => {
        if (a.orderNumber < b.orderNumber) {
          return -1;
        }
        if (a.orderNumber > b.orderNumber) {
          return 1;
        }
        return 0;
      });
    });
  }
}
