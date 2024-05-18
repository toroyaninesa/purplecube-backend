import { HttpModule, Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { AuthModule } from '../user/auth/auth.module';
import { Experience } from '../user/models /experience.entity';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  imports: [
    TypeOrmModule.forFeature([Application]),
    TypeOrmModule.forFeature([Experience]),
    AuthModule,
    HttpModule,
  ],
})
export class ApplicationsModule {}
