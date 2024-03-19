import {
  BadRequestException, ClassSerializerInterceptor,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
  UseInterceptors
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../models /user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs';
import { UserService } from "../user.service";

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
export class AuthHelper {
  @InjectRepository(User)
  private readonly repository: Repository<User>;

  private readonly jwt: JwtService;

  constructor(jwt: JwtService) {
    this.jwt = jwt;
  }

  // Decoding the JWT Token
  public async decode(token: string): Promise<any> {
    return this.jwt.decode(token);
  }

  // Get User by User ID we get from decode()
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

  // Generate JWT Token
  public generateToken(user: User): string {
    const payload = { id: user.id };
    return this.jwt.sign(payload);
  }

  // Validate User's password
  public isPasswordValid(password: string, userPassword: string): boolean {
    return bcrypt.compareSync(password, userPassword);
  }

  // Encode User's password
  public encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }

  // Validate JWT Token, throw forbidden error if JWT Token is invalid
  private async validate(token: string): Promise<boolean | never> {
    const decoded: unknown = this.jwt.verify(token);

    if (!decoded) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const user: User = await this.validateUser(decoded);

    if (!user) {
      throw new UnauthorizedException();
    }

    return true;
  }

}
