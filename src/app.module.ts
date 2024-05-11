import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config';

const development = 'src/common/env/development.env';
const production = 'src/common/env/production.env';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnvironmentConfigFile(), isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ApiModule,
  ],
})
export class AppModule {}

function getEnvironmentConfigFile() {
  return process.env.NODE_ENV === 'production' ? production : development;
}