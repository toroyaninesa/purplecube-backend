import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Headers,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';

@Controller('applications')
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get()
  findUserApplications(@Headers() headers) {
    return this.applicationsService.getApplications(headers.authorization);
  }
}
