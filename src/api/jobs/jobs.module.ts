import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from "@nestjs/typeorm";

import { Job } from "./entities/job.entity";
import { JwtStrategy } from "../user/auth/auth.strategy";
import { AuthModule } from "../user/auth/auth.module";
import { UserService } from "../user/user.service";
import { UserModule } from "../user/user.module";
import { AuthHelper } from "../user/auth/auth.helper";
import { ApplicationsModule } from "../applications/applications.module";
import { Category } from "./entities/category.entity";
import { Application } from "../applications/entities/application.entity";


@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Application]),
    UserModule,
    AuthModule,
    ApplicationsModule,
  ],
  controllers: [JobsController],
  providers: [JobsService],
  exports: [JobsService]
})
export class JobsModule {

}
