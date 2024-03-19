import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { JobsModule } from './jobs/jobs.module';
import { CompanyModule } from './company/company.module';
import { ApplicationsModule } from './applications/applications.module';


@Module({
  imports: [UserModule, JobsModule, CompanyModule, ApplicationsModule]
})
export class ApiModule {}
