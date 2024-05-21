import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../user/auth/auth.guard';
import {Roles} from "../user/auth/role/role.decorator";
import ERole from "../user/auth/role/role.enum";
import {RolesGuard} from "../user/auth/role/role.guard";

@Controller('applications')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  @Roles(ERole.User)
  @UseGuards(RolesGuard)
  findUserApplications(@Req() request) {
    return this.applicationsService.getApplications(request.id);
  }

  @Post('similarity-score/')
  async calculateApplicantSimilarityScore(@Body () body) {
    return this.applicationsService.calculateMultipleSimilarityScores(body.ids);
  }
}
