import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthHelper } from './auth.helper';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authHelper: AuthHelper) {
    super();
  }
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context
      .switchToHttp()
      .getRequest()
      .headers.authorization?.split(' ')[1];
    return await this.authHelper.validate(token);
  }
}
