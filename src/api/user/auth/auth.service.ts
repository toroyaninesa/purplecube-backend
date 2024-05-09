import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models /user.entity';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { LoginDto, RegisterDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private readonly repository: Repository<User>;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;
  private readonly jwt: JwtService;
  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  public async register(body: RegisterDto): Promise<User | never> {
    const { name, email, password, role }: RegisterDto = body;
    let user: User = await this.repository.findOne({ where: { email } });

    if (user) {
      throw new HttpException('Conflict', HttpStatus.CONFLICT);
    }
    user = new User();

    user.name = name;
    user.email = email;
    user.password = this.helper.encodePassword(password);
    user.role = role;

    return this.repository.save(user);
  }

  public async login(body: LoginDto): Promise<{ user: User; token: string }> {
    const { email, password }: LoginDto = body;
    const user: User = await this.repository.findOne({
      where: { email },
      relations: { saved_jobs: true },
    });

    if (!user) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid: boolean = this.helper.isPasswordValid(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    }

    await this.repository.update(user.id, { lastLoginAt: new Date() });

    return {
      token: this.helper.generateToken(user),
      user,
    };
  }

  async refreshAccessToken(accessToken: string) {
    let userPayload: any;
    try {
      userPayload = this.jwt.decode(accessToken);
      if (!userPayload || !userPayload.id) {
        throw new Error();
      }
    } catch (e) {
      throw new BadRequestException();
    }
    const user = await this.helper.validateUser(userPayload);
    if (!user) {
      throw new BadRequestException();
    }
    return this.generateResponseWithToken(user);
  }

  private generateResponseWithToken(user: User) {
    return {
      token: this.jwt.sign({ id: user.id, role: user.role }),
      user,
    };
  }
}
