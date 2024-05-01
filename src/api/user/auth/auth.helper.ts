import {
  ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../models /user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthHelper {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  private readonly jwt: JwtService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  public async validate(token: string): Promise<boolean | never> {
    let decoded: unknown;
    try {
      decoded = this.jwt.verify(token);
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }

  public async decode(token: string): Promise<any> {
    return this.jwt.decode(token);
  }

  public async validateUser(decoded: any): Promise<User> {
    return this.repository.findOne({
      where: { id: decoded.id },
      join: {
        alias: 'user',
        leftJoinAndSelect: {
          saved_jobs: 'user.saved_jobs',
          company: 'saved_jobs.company',
        },
      },
    });
  }

  public generateToken(user: User): string {
    const payload = { id: user.id, role: user.role };
    return this.jwt.sign(payload);
  }

  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
