import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Headers,
  Put,
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
  create(@Body() createCompanyDto: CreateCompanyDto, @Headers() headers) {
    return this.companyService.create(createCompanyDto, headers.authorization);
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
  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Headers() headers,
  ) {
    return this.companyService.update(
      id,
      updateCompanyDto,
      headers.authorization,
    );
  }

  @Roles(ERole.Admin, ERole.Company)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
