import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
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
  create(@Req() request, @Body() data: { job: Job; categories: number[] }) {
    return this.jobsService.create(request.id, data.job, data.categories);
  }

  @Get('categories')
  getAllCategories() {
    return this.jobsService.getAllCategories();
  }

  @Roles(ERole.Company, ERole.User)
  @UseGuards(RolesGuard)
  @Get('applications/:id')
  findApplicationById(@Req() request, @Param('id') id: number) {
    return this.jobsService.getApplicationById(request.id, id);
  }

  @Roles(ERole.Company, ERole.Admin)
  @UseGuards(RolesGuard)
  @Post('applications/:id')
  doApplicationStatusScreening(
    @Param('id') id: number,
    @Body() body: { stageId: number },
  ) {
    return this.jobsService.moveApplicationStatus(id, body.stageId);
  }

  @Roles(ERole.Company, ERole.Admin)
  @UseGuards(RolesGuard)
  @Get('my')
  getCompanyPositions(@Req() request) {
    return this.jobsService.getCompanyPositions(request.id);
  }

  @Roles(ERole.Company)
  @UseGuards(RolesGuard)
  @Get(':id/applicants')
  getPositionApplicants(@Req() request, @Param('id') id: number) {
    return this.jobsService.getJobApplicants(request.id, id);
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

  @Post('save/:id')
  saveJob(
    @Req() request,
    @Param('id') id: number,
    @Body() body: { id: number },
  ) {
    return this.jobsService.saveJobToUser(id, body.id, request.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findJobById(+id);
  }

  @Post('apply/:id')
  applyToJob(@Req() request, @Param('id') id: string) {
    return this.jobsService.applyToJob(request.id, +id);
  }
}
