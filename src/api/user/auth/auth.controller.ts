import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Inject,
  Post,
  UseInterceptors
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { User } from "../models /user.entity";
import { AuthHelper } from "./auth.helper";

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  @Inject(AuthService)
  private readonly service: AuthService;
  @Inject(AuthHelper)
  private readonly helper: AuthHelper;



  @Post('register')
  private register(@Body() body: RegisterDto): Promise<User | never> {
    return this.service.register(body);
  }


  @Post('login')
  private login(@Body() body: LoginDto): Promise<{ token: string }> {
    return this.service.login(body);
  }

  @Post('refresh-access-token')
  refreshAccessToken(@Body('accessToken') accessToken: string) {
    if (!accessToken) {
      throw new BadRequestException();
    }
    return this.service.refreshAccessToken(accessToken);
  }

}
