import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor, Headers, UseGuards
} from "@nestjs/common";
import { ApplicationsService } from "./applications.service";
import { CreateApplicationDto } from "./dto/create-application.dto";
import { UpdateApplicationDto } from "./dto/update-application.dto";
import { Roles } from "../user/auth/role/role.decorator";
import ERole from "../user/auth/role/role.enum";
import { RolesGuard } from "../user/auth/role/role.guard";

@Controller("applications")
@UseInterceptors(ClassSerializerInterceptor)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {
  }

  @Get()
  findUserApplications(@Headers() headers) {
    return this.applicationsService.getApplications(headers.authorization);
  }


  findA
  /* @Post()
   create(@Body() createApplicationDto: CreateApplicationDto) {
     return this.applicationsService.create(createApplicationDto);
   }

   @Get()
   findAll() {
     return this.applicationsService.findAll();
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
     return this.applicationsService.findOne(+id);
   }

   @Patch(':id')
   update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
     return this.applicationsService.update(+id, updateApplicationDto);
   }

   @Delete(':id')
   remove(@Param('id') id: string) {
     return this.applicationsService.remove(+id);
   }*/
}
