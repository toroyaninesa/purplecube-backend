import { Module } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { JobsController } from './jobs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { AuthModule } from '../user/auth/auth.module';
import { UserModule } from '../user/user.module';
import { ApplicationsModule } from '../applications/applications.module';
import { Category } from './entities/category.entity';
import { Application } from '../applications/entities/application.entity';

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
  exports: [JobsService],
})
export class JobsModule {}
