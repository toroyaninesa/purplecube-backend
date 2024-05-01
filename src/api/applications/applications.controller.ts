import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../user/auth/auth.guard';

@Controller('applications')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findUserApplications(@Req() request) {
    return this.applicationsService.getApplications(request.id);
  }

  @Post('similarity-score')
  calculateApplicantSimilarityScore(
    @Req() request,
    @Body() body: { resumePrompt: string[]; requirementsPrompt: string[] },
  ) {
    return this.applicationsService.calculateSimilarityScoreForApplicant(body);
  }
}
