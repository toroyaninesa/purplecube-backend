import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
  Headers,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { Job } from './entities/job.entity';
import { JwtAuthGuard } from '../user/auth/auth.guard';
import { Roles } from '../user/auth/role/role.decorator';
import ERole from '../user/auth/role/role.enum';
import { RolesGuard } from '../user/auth/role/role.guard';
import {
  EmploymentLevelEnum,
  EmploymentTypeEnum,
} from './entities/search.enum';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Roles(ERole.Admin, ERole.Company)
  @UseGuards(RolesGuard)
  @Post()
  create(@Headers() headers, @Body() data: { job: Job; categories: number[] }) {
    return this.jobsService.create(
      headers.authorization,
      data.job,
      data.categories,
    );
  }

  @Get('categories')
  getAllCategories() {
    return this.jobsService.getAllCategories();
  }

  @Roles(ERole.Company)
  @UseGuards(RolesGuard)
  @Get('applications/:id')
  findApplicationById(@Headers() headers, @Param('id') id: number) {
    return this.jobsService.getApplicationById(headers.authorization, id);
  }

  @Roles(ERole.Company)
  @UseGuards(RolesGuard)
  @Get('applications/:id')
  doApplicationStatusScreening(@Headers() headers, @Param('id') id: number) {
    return this.jobsService.doApplicationStatusScreening(
      headers.authorization,
      id,
    );
  }

  @Roles(ERole.Company)
  @UseGuards(RolesGuard)
  @Get('my')
  getCompanyPositions(@Headers() headers) {
    return this.jobsService.getCompanyPositions(headers.authorization);
  }

  @Roles(ERole.Company)
  @UseGuards(RolesGuard)
  @Get(':id/applicants')
  getPositionApplicants(@Headers() headers, @Param('id') id: number) {
    return this.jobsService.getJobApplicants(headers.authorization, id);
  }

  @Get('?')
  findAll(
    @Query('limit') limit: number,
    @Query('skip') skip: number,
    @Query('emp') employment?: EmploymentTypeEnum[],
    @Query('level') level?: EmploymentLevelEnum[],
    @Query('cat') cat?: string[],
    @Query('title') title?: string,
  ): Promise<{ jobs: Job[]; count: number }> {
    return this.jobsService.findAll(limit, skip, employment, level, cat, title);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findJobById(+id);
  }

  @Roles(ERole.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }

  @Post('save/:id')
  saveJob(
    @Headers() headers,
    @Param('id') id: number,
    @Body() body: { id: number },
  ) {
    return this.jobsService.saveJobToUser(id, body.id, headers.authorization);
  }

  @Post('apply/:id')
  applyToJob(@Headers() headers, @Param('id') id: string) {
    return this.jobsService.applyToJob(headers.authorization, +id);
  }
}
