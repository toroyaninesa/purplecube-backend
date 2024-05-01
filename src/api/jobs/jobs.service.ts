import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Job } from './entities/job.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/models /user.entity';
import { Application } from '../applications/entities/application.entity';
import { ApplicationsService } from '../applications/applications.service';
import {
  EmploymentLevelEnum,
  EmploymentTypeEnum,
} from './entities/search.enum';
import { Category } from './entities/category.entity';
import { EStatus } from '../applications/entities/status.enum';

@Injectable()
export class JobsService {
  @InjectRepository(Job)
  private readonly jobRepository: Repository<Job>;
  @InjectRepository(Category)
  private readonly catRepository: Repository<Category>;
  @InjectRepository(Application)
  readonly applicationRepository: Repository<Application>;

  constructor(
    private userService: UserService,
    private app: ApplicationsService,
  ) {}

  public async create(userId: number, job: Job, categories: number[]) {
    const user: User = await this.userService.findUserById(userId);
    const data = {
      ...job,
      company: { id: user.companyId },
    };
    if (!categories) {
      return this.jobRepository.save(data);
    }

    if (categories) {
      await this.jobRepository.save(data);
      const newjob: Job = await this.findJobById(data.id);
      for (const cat of categories) {
        const foundCat = await this.findCategoryById(cat);
        if (foundCat) {
          newjob.categories.push(foundCat);
        }
      }
      return this.jobRepository.save(newjob);
    }
  }

  findCategoryById(id: number) {
    return this.catRepository.findOne({ where: { id } });
  }

  getAllCategories() {
    return this.catRepository.createQueryBuilder('category').getMany();
  }

  async findAll(
    limit: number,
    skip: number,
    employment?: EmploymentTypeEnum[],
    level?: EmploymentLevelEnum[],
    cat?: string[],
    title?: string,
  ) {
    const query = this.jobRepository
      .createQueryBuilder('job')
      .leftJoinAndSelect('job.company', 'company')
      .orderBy('job.created_at', 'DESC')
      .leftJoinAndSelect('job.categories', 'category')
      .skip(skip)
      .take(limit);
    if (employment) {
      query.andWhere('job.employment IN (:...employment)', { employment });
    }
    if (level) {
      query.andWhere('job.level IN (:...level)', { level });
    }
    if (title) {
      query.andWhere('LOWER(job.title) like LOWER(:title)', {
        title: '%' + title + '%',
      });
    }
    if (cat) {
      query.andWhere('category.title IN (:...cat)', { cat });
    }
    const count = await query.getCount();

    return { count, jobs: await query.getMany() };
  }

  findJobById(id: number): Promise<Job | undefined> {
    return this.jobRepository.findOne({
      where: { id },
      relations: { company: true, categories: true },
    });
  }

  async saveJobToUser(id: number, userId: number, currentUserId: number) {
    const currentUser: User = await this.userService.findUserById(
      currentUserId,
    );
    const user: User = await this.userService.findUserById(userId);
    if (user && user.id === currentUser.id) {
      const job = await this.findJobById(id);
      if (
        job &&
        user.saved_jobs.filter((saveJob) => saveJob.id === job.id).length < 1
      ) {
        user.saved_jobs.push(job);
        return this.userService.update(user);
      }
      throw new HttpException(
        'The job does not exist or it is already saved',
        400,
      );
    }
    throw new HttpException('You are not authorized to do this action', 401);
  }

  async applyToJob(userId: number, jobId: number) {
    const job = await this.findJobById(jobId);
    if (job && job.no_applicants < job.max_applications) {
      const application = {
        id: userId,
        job: { id: jobId },
      };
      job.no_applicants += 1;
      const apps = await this.app.getApplications(userId);
      if (apps.filter((app) => app.job.id === jobId).length < 1) {
        await this.jobRepository.save(job);
        return this.app.save(application);
      }
      throw new BadRequestException('You have already saved this job');
    }
    throw new BadRequestException("Sorry, you can't apply to this job");
  }

  async getCompanyPositions(userId: number) {
    const user: User = await this.userService.findUserById(userId);
    return this.jobRepository.find({
      where: { company: { id: user.companyId } },
      relations: { company: true, applications: true, categories: true },
    });
  }

  async getJobApplicants(userId: number, id: number) {
    const jobs = await this.getCompanyPositions(userId);
    if (jobs.filter((job) => job.id == id).length < 1) {
      throw new UnauthorizedException();
    }
    return this.app.getJobApplications(id);
  }

  async getApplicationById(userId: number, id: number) {
    const application: Application = await this.applicationRepository
      .createQueryBuilder('application')
      .where('application.id =(:id)', { id })
      .leftJoinAndSelect('application.user', 'user')
      .leftJoinAndSelect('user.experience', 'experience')
      .leftJoinAndSelect('application.job', 'job')
      .leftJoinAndSelect('job.company', 'company')
      .getOne();

    if (!application)
      throw new NotFoundException({
        message: 'No matched applications found!',
      });
    const user: User = await this.userService.findUserById(userId);
    if (user.companyId !== application.job.company.id) {
      return new UnauthorizedException();
    }
    return application;
  }

  async moveApplicationStatus(id: number, status: EStatus) {
    if (!this.isApplicationStatusValid(status))
      throw new BadRequestException({
        message: `Status ${status} is not valid`,
      });
    await this.applicationRepository
      .createQueryBuilder('application')
      .where('application.id =(:id)', { id })
      .update<Application>(Application, { status })
      .updateEntity(true)
      .execute();
    return await this.getSingleApplicationById(id);
  }

  private async getSingleApplicationById(id: number) {
    return await this.applicationRepository
      .createQueryBuilder('application')
      .where('application.id =(:id)', { id })
      .getOne();
  }

  private isApplicationStatusValid(status: string) {
    return (
      status === EStatus.DECISION ||
      status === EStatus.SUBMITTED ||
      status === EStatus.SCREENING
    );
  }
}
