import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { AuthModule } from '../user/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), AuthModule],
  controllers: [CompanyController],
  providers: [CompanyService, AuthModule],
})
export class CompanyModule {}
