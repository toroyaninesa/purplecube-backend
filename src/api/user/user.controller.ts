import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Experience } from './models /experience.entity';
import { User } from './models /user.entity';

@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('experience')
  allExperience(@Headers() headers) {
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    return this.userService.getAllExperience(headers.authorization);
  }

  @Post('experience')
  experienceList(@Body() list: Experience[], @Headers() headers) {
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    return this.userService.addExperienceList(list, headers.authorization);
  }

  @Delete('experience/:id')
  deleteExperienceById(@Param('id') id: number) {
    return this.userService.deleteExperienceById(id);
  }

  @Put('')
  updateUser(@Headers() headers, @Body() user: User) {
    if (!headers.authorization) {
      throw new UnauthorizedException();
    }
    return this.userService.updateUser(headers.authorization, user);
  }
}
