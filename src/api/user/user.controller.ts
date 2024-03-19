import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApplicationsService } from '../applications/applications.service';
import { Application } from '../applications/entities/application.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly applicationService: ApplicationsService,
  ) {}

  @Get('current')
  async getByToken(@Headers() headers) {
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    return this.userService.getUserByToken(headers.authorization);
  }

  @Get('saved')
  saveJob(@Headers() headers) {
    return this.userService.findSavedJobs(headers.authorization);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findUserById(+id);
  }
 /*
  @Post(':id/experience')
  getUserExperience
*/
}
