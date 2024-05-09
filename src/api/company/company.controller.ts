import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from '../user/auth/auth.guard';
import { RolesGuard } from '../user/auth/role/role.guard';
import { Roles } from '../user/auth/role/role.decorator';
import ERole from '../user/auth/role/role.enum';

@Controller('company')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Roles(ERole.Admin, ERole.Company)
  @UseGuards(RolesGuard)
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  findAll(@Query('limit') limit: number, @Query('skip') skip: number) {
    return this.companyService.findAll(limit, skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Roles(ERole.Admin, ERole.Company)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  @Roles(ERole.Admin, ERole.Company)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
