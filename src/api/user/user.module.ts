import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models /user.entity';
import { ApplicationsModule } from '../applications/applications.module';
import { Experience } from './models /experience.entity';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    AuthModule,
    ApplicationsModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Experience]),
  ],
  exports: [UserService],
})
export class UserModule {}
